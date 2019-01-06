/*
* spa.shell.js
* Модуль Shell для SPA
*/
/*jslint		browser: true, continue: true,
	devel: true, indent: 2, maxerr: 50,
	newcap: true, nomen: true, plusplus: true,
	regexp: true, sloppy: true, vars: false,
	white: true
*/
/* global $, spa */

spa.shell = (function(){
	//--------- НАЧАЛО ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ --------
	var
		configMap = {
			anchor_schema_map: {
				chat: {open: true, closed: true}
			},
			main_html: String()
				+ '<div class="spa-shell-head">'
					+ '<div class="spa-shell-head-logo"></div>'
					+ '<div class="spa-shell-head-acct"></div>'
					+ '<div class="spa-shell-head-search"></div>'
				+ '</div>'
				+ '<div class="spa-shell-main">'
					+ '<div class="spa-shell-main-nav"></div>'
					+ '<div class="spa-shell-main-content"></div>'
				+ '</div>'
				+ '<div class="spa-shell-foot"></div>'
				+ '<div class="spa-shell-chat"></div>'
				+ '<div class="spa-shell-modal"></div>',

			chat_extend_time: 250, //1000,
			chat_retract_time: 300,
			chat_extend_height: 450,
			chat_retract_height: 15,
			chat_extended_title: 'Щелкните, чтобы свернуть',
			chat_retracted_title: 'Щелкните, чтобы раскрыть'
		},
		stateMap = {
			$container: null,
			anchor_map: {},
			is_chat_retracted: true
		},
		jqueryMap = {},

		copyAnchorMap, setJqueryMap, toggleChat, changeAnchorPart, onHashchange, onClickChat, initModule;
		//--------- КОНЕЦ ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ --------

		//----------------- НАЧАЛО СЛУЖЕБНЫХ МЕТОДОВ -------------------
		// Возвращает копию сохраненного хэша якорей; минимизация издержек
		copyAnchorMap = function(){
			return $.extend(true, {}, stateMap.anchor_map);
		};
		//------------------ КОНЕЦ СЛУЖЕБНЫХ МЕТОДОВ -------------------

		// -------------------- НАЧАЛО МЕТОДОВ DOM ----------------------
		// Начало метода DOM /setJqueryMap/
		setJqueryMap = function(){
			var $container = stateMap.$container;
			jqueryMap = {
				$container: $container,
				$chat: $container.find('.spa-shell-chat')
			};
		};
		// Конец метода DOM /setJqueryMap/

		// Начало метода DOM /toggleChat/
		// Назначение: свернуть или раскрыть окно чата
		// Состояние: устанавливает stateMap.is_chat_retracted
		//	* true - окно свернуто
		//	* false - окно раскрыто
		//
		// Аргументы:
		//	* do_extend - если true, раскрыть окно; если false - свернуть
		//	* callback - необязательная функция, которая вызывается в конце
		//	* анимации
		// Параметры:
		//	* chat_extend_time, chat_retract_time
		//	* chat_extend_height, chat_retract_height
		// Возвращает: булево значение
		//	* true - анимация окна чата начата
		//	* false - анимация окна чата не начата
		//
		toggleChat = function(do_extend, callback){
			var
				px_chat_ht = jqueryMap.$chat.height(),
				is_open = px_chat_ht === configMap.chat_extend_height,
				is_closed = px_chat_ht === configMap.chat_retract_height,
				is_sliding = !is_open && !is_closed;

			// во избежание гонки
			if(is_sliding){return false;}

			// Начало раскрытия окна чата
			if(do_extend){
				jqueryMap.$chat.animate(
					{height: configMap.chat_extend_height},
					configMap.chat_extend_time,
					function(){
						jqueryMap.$chat.attr(
							'title', configMap.chat_extended_title
						);
						stateMap.is_chat_retracted = false;
						if(callback){callback(jq
							.$chat);}
					}
				);
				return true;
			}
			// Конец раскрытия окна чата

			// Начало сворачивания окна чата
			jqueryMap.$chat.animate(
				{height: configMap.chat_retract_height},
				configMap.chat_retract_time,
				function(){
					jqueryMap.$chat.attr(
						'title', configMap.chat_retracted_title
					);
					stateMap.is_chat_retracted = true;
					if(callback){callback(jqueryMap.$chat);}
				}
			);
			return true;
			// Конец сворачивания окна чата
		};
		// Конец метода DOM /toggleChat/

		// Начало метода DOM /changeAnchorPart/
		// Назначение: изменяет якорь в URI-адресе
		// Аргументы:
		//	* arg_map - хэш, описывающий, какую
		//		часть якоря мы хотим изменить.
		// Возвращает: булево значение
		//	* true - якорь в URI обновлен
		//	* false - не удалось обновить якорь в URI
		// Действие:
		//	Текущая часть якоря сохранена в stateMap.anchor_map.
		//	Обсуждение кодировки см. в документации по uriAnchor.
		//	Этот метод
		//		* Создает копию хэша, вызывая copyAnchorMap().
		//		* Модифицирует пары ключ-значение с помощью arg_map.
		//		* Управляет различием между зависимыми и независимыми значениями в кодировке.
		//		* Пытается изменить URI, используя uriAnchor.
		//		* Возвращает true в случае успеха и false - в случае ошибки.
		//
		changeAnchorPart = function(arg_map){
			var
				anchor_map_revise = copyAnchorMap(),
				bool_return = true,
				key_name, key_name_dep;

			// Начало обьединения изменений в хэше якорей
			KEYVAL:
			for(key_name in arg_map){
				if(arg_map.hasOwnProperty(key_name)){
					// пропустить зависимые ключи
					if(key_name.indexOf('_') === 0){continue KEYVAL;}

					// обновить значение независимого ключа
					anchor_map_revise[key_name] = arg_map[key_name];

					// обновить соответствующий зависимый ключ
					key_name_dep = '_' + key_name;
					if(arg_map[key_name_dep]){
						anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
					}
					else{
						delete anchor_map_revise[key_name_dep];
						delete anchor_map_revise['_s' + key_name_dep];
					}
				}
			}
			// Конец обьединения изменений в хэше якорей

			// Начало попытки обновления URI; в случае ошибки
			// восстановить исходное состояние
			try{
				$.uriAnchor.setAnchor(anchor_map_revise);
			}
			catch(error){
				// восстановить исходное состояние в URI
				$.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
				bool_return = false;
			}
			// Конец попытки обновления URI...

			return bool_return;
		};
		// Конец метода DOM /changeAnchorPart/
		//--------------------- КОНЕЦ МЕТОДОВ DOM ----------------------

		//---------------- НАЧАЛО ОБРАБОТЧИКОВ СОБЫТИЙ -----------------
		// Начало обработчика события /onHashchange/
		// Назначение: обрабатывает событие hashchange
		// Аргументы:
		//	* event - обьект события jQuery.
		// Параметры: нет
		// Возвращает: false
		// Действие:
		//	* Разбирает якорь в URI.
		//	* Сравнивает предложенное состояние приложения с текущим.
		//	* Вносит изменения, только если предложенное состояние
		//		отличается от текущего.
		//
		onHashchange = function(event){
			var
				anchor_map_previous = copyAnchorMap(),
				anchor_map_proposed,
				_s_chat_previous, _s_chat_proposed,
				s_chat_proposed;

			// пытаемся разобрать якорь
			try{anchor_map_proposed = $.uriAnchor.makeAnchorMap();}
			catch(error){
				$.uriAnchor.setAnchor(anchor_map_previous, null, true);
				return false;
			}
			stateMap.anchor_map = anchor_map_proposed;

			// вспомогательные переменные
			_s_chat_previous = anchor_map_previous._s_chat;
			_s_chat_proposed = anchor_map_proposed._s_chat;

			// Начало изменения компонента Chat
			if(!anchor_map_previous
				|| _s_chat_previous !== _s_chat_proposed
			){
				s_chat_proposed = anchor_map_proposed.chat;
				switch(s_chat_proposed){
					case 'open':
						toggleChat(true);
					break;
					case 'closed':
						toggleChat(false);
					break;
					default:
						toggleChat(false);
						delete anchor_map_proposed.chat;
						$.uriAnchor.setAnchor(anchor_map_proposed, null, true);
				}
			}
			// Конец изменения компонента Chat

			return false;
		};
		// Конец обработчика события /onHashchange/

		onClickChat = function(event){
			/*toggleChat(stateMap.is_chat_retracted);
			return false;*/

			/*if(toggleChat(stateMap.is_chat_retracted)){
				$.uriAnchor.setAnchor({
					chat: (stateMap.is_chat_retracted ? 'open' : 'closed')
				});
				return false;
			}*/

			changeAnchorPart({
				chat: (stateMap.is_chat_retracted ? 'open' : 'closed')
			});
			return false;
		};
		//----------------- КОНЕЦ ОБРАБОТЧИКОВ СОБЫТИЙ -----------------

		//------------------- НАЧАЛО ОТКРЫТЫХ МЕТОДОВ ------------------
		// Начало открытого метода /initModule/
		initModule = function($container){
			// загрузить HTML и кэшировать коллекции jQuery
			stateMap.$container = $container;
			$container.html(configMap.main_html);
			setJqueryMap();

			/*// тестировать переключение
			setTimeout(function(){toggleChat(true);}, 3000);
			setTimeout(function(){toggleChat(false);}, 8000);*/

			// инициализировать окно чата и привязать обработчик щелчка
			stateMap.is_chat_retracted = true;
			jqueryMap.$chat
				.attr('title', configMap.chat_retracted_title)
				.click(onClickChat);

			// настраиваем uriAnchor на использование нашей схемы
			$.uriAnchor.configModule({
				schema_map: configMap.anchor_schema_map
			});

			// Обрабатываем события изменения якоря в URI.
			// Это делается /после/ того, как все функциональные модули
			// сконфигурированы и инициализированы, иначе они будут не готовы
			// возбудить событие, которое используется, чтобы гарантировать
			// учет якоря при загрузке.
			//
			$(window)
				.bind('hashchange', onHashchange)
				.trigger('hashchange');
		};
		// Конец открытого метода /initModule/

		return {initModule: initModule};
		//----------------- КОНЕЦ ОТКРЫТЫХ МЕТОДОВ -----------------
}());