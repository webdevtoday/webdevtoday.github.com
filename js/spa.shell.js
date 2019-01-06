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
				+ '<div class="spa-shell-modal"></div>'
		},
		stateMap = {$container: null},
		jqueryMap = {},

		setJqueryMap, initModule;
		//--------- КОНЕЦ ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ --------

		//----------------- НАЧАЛО СЛУЖЕБНЫХ МЕТОДОВ -------------------
		//------------------ КОНЕЦ СЛУЖЕБНЫХ МЕТОДОВ -------------------

		// -------------------- НАЧАЛО МЕТОДОВ DOM ----------------------
		// Начало метода DOM /setJqueryMap/
		setJqueryMap = function(){
			var $container = stateMap.$container;
			jqueryMap = {$container: $container};
		};
		// Конец метода DOM /setJqueryMap/
		//--------------------- КОНЕЦ МЕТОДОВ DOM ----------------------

		//---------------- НАЧАЛО ОБРАБОТЧИКОВ СОБЫТИЙ -----------------
		//----------------- КОНЕЦ ОБРАБОТЧИКОВ СОБЫТИЙ -----------------

		//------------------- НАЧАЛО ОТКРЫТЫХ МЕТОДОВ ------------------
		// Начало открытого метода /initModule/
		initModule = function($container){
			stateMap.$container = $container;
			$container.html(configMap.main_html);
			setJqueryMap();
		};
		// Конец открытого метода /initModule/

		return {initModule: initModule};
		//----------------- КОНЕЦ ОТКРЫТЫХ МЕТОДОВ -----------------
}());