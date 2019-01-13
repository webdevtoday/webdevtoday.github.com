/*
* spa.model.js
* Модуль, содержащий модель
*/

/*jslint		browser: true, continue: true,
	devel: true, indent: 2, maxerr: 50,
	newcap: true, nomen: true, plusplus: true,
	regexp: true, sloppy: true, vars: false,
	white: true
*/

/* global $, spa */

spa.model = (function(){
	'use strict';

	var
		configMap = {anon_id: 'a0'},
		stateMap = {
			anon_user: null,
			cid_serial: 0,
			people_cid_map: {},
			people_db: TAFFY(),
			user: null
		},

		isFakeData = true,

		personProto, makeCid, clearPeopleDb, completeLogin,
		makePerson, removePerson, people, initModule
	;

	// API объекта people
	// ---------------------
	// Объект people доступен по имени spa.model.people.
	// Объект people предоставляет методы и события для управления
	// коллекцией объектов person. Ниже перечислены его открытые методы:
	// * get_user() – возвращает объект person, представляющий текущего
	// пользователя. Если пользователь не аутентифицирован, возвращает
	// объект person, представляющий анонимного пользователя.
	// * get_db() – возвращает базу данных TaffyDB, содержащую все
	// объекты person, в том числе текущего пользователя, –
	// в отсортированном виде.
	// * get_by_cid( <client_id> ) – возвращает объект person,
	// представляющий пользователя с указанным уникальным идентификатором.
	// * login( <user_name> ) – аутентифицируется от имени пользователя
	// с указанным именем. В объект, представляющий текущего пользователя,
	// вносятся изменения, отражающие новый статус.
	// * logout()- возвращает объект текущего пользователя в анонимное
	// состояние.
	//
	// Объект публикует следующие глобальные пользовательские события
	// jQuery:
	// * 'spa-login' публикуется по завершении аутентификации.
	// В качестве данных передается обновленный объект пользователя.
	// * 'spa-logout' публикуется по завершении процедуры выхода из системы.
	// В качестве данных передается прежний объект пользователя.
	//
	// Каждый человек представляется объектом person.
	// Объект person предоставляет следующие методы:
	// * get_is_user() – возвращает true, если объект соответствует
	// текущему пользователю;
	// * get_is_anon() – возвращает true, если объект соответствует
	// анонимному пользователю.
	//
	// Объект person имеет следующие атрибуты:
	// * cid – строковый клиентский идентификатор. Он всегда определен и
	// отличается от атрибута id, только если данные на стороне клиента
	// еще не синхронизированы с сервером.
	// * id – уникальный идентификатор. Может быть равен undefined, если
	// объект еще не синхронизирован с сервером.
	// * name – строка, содержащая имя пользователя.
	// * css_map – хэш атрибутов, используемый для представления аватара.
	//
	personProto = {
		get_is_user: function(){
			return this.cid === stateMap.user.cid;
		},
		get_is_anon: function(){
			return this.cid === stateMap.anon_user.cid;
		}
	};

	makeCid = function(){
		return 'c' + String(stateMap.cid_serial++);
	};

	clearPeopleDb = function(){
		var user = stateMap.user;
		stateMap.people_db = TAFFY();
		stateMap.people_cid_map = {};
		if(user){
			stateMap.people_db.insert(user);
			stateMap.people_cid_map[user.cid] = user;
		}
	};

	completeLogin = function(user_list){
		var user_map = user_list[0];
		delete stateMap.people_cid_map[user_map.cid];
		stateMap.user.cid = user_map._id;
		stateMap.user.id = user_map._id;
		stateMap.user.css_map = user_map.css_map;
		stateMap.people_cid_map[user_map._id] = stateMap.user;

		// Когда добавится обьект chat, здесь нужно будет войти в чат.
		$.gevent.publish('spa-login', [stateMap.user]);
	};

	makePerson = function(person_map){
		var person,
			cid = person_map.cid,
			css_map = person_map.css_map,
			id = person_map.id,
			name = person_map.name;

		if(cid === undefined || !name){
			throw 'client id and name required';
		}

		person = Object.create(personProto);
		person.cid = cid;
		person.name = name;
		person.css_map = css_map;

		if(id){person.id = id;}

		stateMap.people_cid_map[cid] = person;
		stateMap.people_db.insert(person);
		return person;
	};

	removePerson = function(person){
		if(!person){return false;}
		// анонимного пользователя удалять нельзя
		if(person.id === configMap.anon_id){
			return false;
		}

		stateMap.people_db({cid: person.cid}).remove();
		if(person.cid){
			delete stateMap.people_cid_map[person.cid];
		}
		return true;
	};

	people = (function(){
		var get_by_cid, get_db, get_user, login, logout;

		get_by_cid = function(cid){
			return stateMap.people_cid_map[cid];
		};

		get_db = function(){return stateMap.people_db;};
		get_user = function(){return stateMap.user;};

		login = function(name){
			var sio = isFakeData ? spa.fake.mockSio : spa.data.getSio();

			stateMap.user = makePerson({
				cid: makeCid(),
				css_map: {top: 25, left: 25, 'background-color': '#8f8'},
				name: name
			});

			sio.on('userupdate', completeLogin);

			sio.emit('adduser', {
				cid: stateMap.user.cid,
				css_map: stateMap.user.css_map,
				name: stateMap.user.name
			});
		};

		logout = function(){
			var is_removed, user = stateMap.user;
			// Когда добавится обьект chat, здесь нужно будет выйти из чата

			is_removed = removePerson(user);
			stateMap.user = stateMap.anon_user;

			$.gevent.publish('spa-logout', [user]);
			return is_removed;
		};

		return {
			get_by_cid: get_by_cid,
			get_db: get_db,
			get_user: get_user,
			login: login,
			logout: logout
		};
	}());

	initModule = function(){
		var i, people_list, person_map;

		// инициализируем анонимного пользователя
		stateMap.anon_user = makePerson({
			cid: configMap.anon_id,
			id: configMap.anon_id,
			name: 'anonymous'
		});
		stateMap.user = stateMap.anon_user;

		if(isFakeData){
			people_list = spa.fake.getPeopleList();
			for(i = 0; i < people_list.length; i++){
				person_map = people_list[i];
				makePerson({
					cid: person_map._id,
					css_map: person_map.css_map,
					id: person_map._id,
					name: person_map.name
				});
			}
		}
	};

	return {
		initModule: initModule,
		people: people
	};
}());