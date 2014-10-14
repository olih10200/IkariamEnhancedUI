// ==UserScript==
// @name			Enhanced UI
// @description		Enhancements for the user interface of Ikariam.
// @namespace		Tobbe
// @author			Tobbe
// @version			2.01
//
// @include			http://s*.*.ikariam.com/*
// @include			http://m*.*.ikariam.com/*
// 
// @exclude			http://support.*.ikariam.*/*
// 
// @history			2.01	Feature: Support for mobile interface.
// @history			2.01	Bugfix: Fixed bug with scrollbar in finances view. (desktop)
// 
// @history			2.00	Feature: Ready for 0.5.0, but also supports 0.4.5 furthermore.
// @history			2.00	Feature: Implemented support for different languages.
// @history			2.00	Feature: Enhanced script updater.
// @history			2.00	Feature: Rename the script to "Enhanced UI".
// @history			2.00	Feature: Change the namespace to "Tobbe".
// @history			2.00	Because of the change of namespace and name you have to delete the old script manually!
//
// @history			1.07	Bugfix: Problem with negative numbers and 0.4.2.4 fixed.
//
// @history			1.06	Feature: Own script updater.
// @history			1.06	Bugfix: Remove everything what refered to other scripts.
//
// @history			1.05	Feature: New script updater.
//
// @history			1.04	Bugfix: Remove the script updater (Because of the problem with Greasemonkey scripts).
//
// @history			1.03	Feature: New style of update panel.
// @history			1.03	Bugfix: Bug with ',' as seperator fixed.
//
// @history			1.02	Feature: Income in 24h added.
// @history			1.02	Feature: Cleaned up code.
//
// @history			1.01	Feature: Update check implemented.
//
// @history			1.00	Initial release
// ==/UserScript==

/******************************************************************************************************************
*** The update function which is used in the script was developed by PhasmaExMachina and adapted by me (Tobbe). ***
******************************************************************************************************************/

/**
 * Information about the Script.
 */
const scriptInfo = {
	version:	2.01,
	id:			74221,
	name:		'Enhanced UI',
	author:		'Tobbe',
	debug:		false,
};

/***********************************************
*** Start of the "debugging settings block". ***
***********************************************/

// For more information about commands that are available for the Firebug console see http://getfirebug.com/wiki/index.php/Console_API.
if(scriptInfo.debug && unsafeWindow.console) {
	var con_tmp = unsafeWindow.console;
} else { // If debugging is not allowed or the Firebug console is closed set all functions to "null".
	var con_tmp = {
		log:			function () { return false; },
		info:			function () { return false; },
		warn:			function () { return false; },
		error:			function () { return false; },
		debug:			function () { return false; },
		assert:			function () { return false; },
		clear:			function () { return false; },
		dir:			function () { return false; },
		dirxml:			function () { return false; },
		trace:			function () { return false; },
		group:			function () { return false; },
		groupCollapsed: function () { return false; },
		groupEnd:		function () { return false; },
		time:			function () { return false; },
		timeEnd:		function () { return false; },
		profile:		function () { return false; },
		profileEnd:		function () { return false; },
		count:			function () { return false; },
		exception:		function () { return false; },
		table:			function () { return false; }
	};
}

/**
 * Debugging console.
 */
const con = con_tmp;

/*********************************************
*** End of the "debugging settings block". ***
*********************************************/


/**
 * General functions
 */
General = {
	/**
	 * Gets an element by the id and returns it.
	 * 
	 * @param	id - the id of the element
	 * @return	the element
	 */
	$: function(id) {
		return document.getElementById(id);
	},
	
	/**
	 * Gets elements by their class name and returns them.
	 * 
	 * @param	className - the class name of the elements
	 * @return	the elements
	 */
	$$: function(className) {
		return document.getElementsByClassName(className);
	},
	
	/**
	 * Formats a number to that format that is used in Ikariam.
	 *
	 * @param	num	- the number to format
	 * @return	the formated number
	 */
	formatToIkaNumber: function(num) {
		var txt = num + '';
		
		txt = txt.replace(/(\d)(?=(\d{3})+\b)/g,'$1' + lText.settings.kiloSep);
		
		if(num < 0) {
			txt = '<span class="red bold negative">' + txt + '</span>';
		}
		
		return txt;
	},
	
	/**
	 * Adds cells to a table row.
	 * 
	 * @param	cellText		- array of the text of the cells
	 * @param	cellClassName	- array of the classes of the cells
	 * @param	row				- table row where the cells have to be added
	 */
	createTableRow: function(cellText, cellClassName, row) {
		for(var i = 0; i < cellText.length; i++) {
			var cell = General.addElement('td', '', row, null);
			
			cell.innerHTML = cellText[i];
			cell.className = cellClassName[i];
		}
	},
	
	/**
	 * Creates a new element and adds it to a parent.
	 * 
	 * @param	type	- the type of the new element
	 * @param	id		- the last part of the id of the element (the first part will be "script" + the id script-id)
	 * @param	parent	- the parent of the new element
	 * @param	nextSib - the next sibling of the element (if null the element will be added at the end)
	 * @return	the new element
	 */
	addElement: function(type, id, parent, nextSib) {
		var newElement = document.createElement(type);
		
		if(id) {
			newElement.id = 'script' + scriptInfo.id + id;
		}
		
		if(nextSib) {
			parent.insertBefore(newElement, nextSib);
		} else {
			parent.appendChild(newElement);
		}
		
		return newElement;
	},
};

/**
 * Functions for enhanced view
 */
EnhancedView = {
	/**
	 * "Constructor"
	 */
	start: function() {
		// Is it mobile or desktop?
		if(!General.$('js_GlobalMenu_gold')) {
			EnhancedView.showIncomeOnTopMobile();
		} else {
			EnhancedView.addListener();
		}
	},
	
	/**
	 * Adds the event listener to the elements.
	 */
	addListener: function() {
		var finances = General.$('js_GlobalMenu_gold');
		finances.addEventListener('click', function() { setTimeout(EnhancedView.showIncomeOnTop, 1000); }, true);
	},

	/**
	 * Shows the actual income also on top of the site. (desktop)
	 */
	showIncomeOnTop: function() {
		if(!General.$('finances')) {
			setTimeout(EnhancedView.showIncomeOnTop, 10);
		}
		
		var income = EnhancedView.getIncome();
		
		var balance = General.$$('table01')[0];
		
		incomeRow = balance.insertRow(1);
		incomeRow24h = balance.insertRow(2);
		
		incomeRow.className = 'result alt';
		incomeRow24h.className = 'result';

		General.createTableRow(new Array(lText.income.perHour, '', '', General.formatToIkaNumber(income)), new Array('sigma', 'value res', 'value res', 'value res'), incomeRow);
		General.createTableRow(new Array(lText.income.perDay, '', '', General.formatToIkaNumber(income * 24)), new Array('sigma', 'value res', 'value res', 'value res'), incomeRow24h);
		
		// Adjust the size of the Scrollbar.
		unsafeWindow.ikariam.controller.adjustSizes();
	},
	
	/**
	 * Gets the actual income from the Ikariam-page and returns it.
	 * 
	 * @return	the actual income
	 */
	getIncome: function() {
		var incomeCell = General.$$('hidden');
		incomeCell = incomeCell[incomeCell.length - 1];
		
		while(incomeCell.firstChild.firstChild) {
			incomeCell = incomeCell.firstChild;
		}
		
		var txt = incomeCell.innerHTML;
		
		return Number(txt.replace(lText.settings.kiloSep, ''));
	},

	/**
	 * Shows the actual income also on top of the site. (mobile)
	 */
	showIncomeOnTopMobile: function() {
		var income = EnhancedView.getIncome();
		
		var balance = General.$('balance');
		
		incomeRow = balance.insertRow(1);
		incomeRow24h = balance.insertRow(2);
		
		incomeRow.className = 'result alt';
		incomeRow24h.className = 'result';

		General.createTableRow(new Array(lText.income.perHour, '', '', General.formatToIkaNumber(income)), new Array('sigma', 'value res', 'value res', 'value res'), incomeRow);
		General.createTableRow(new Array(lText.income.perDay, '', '', General.formatToIkaNumber(income * 24)), new Array('sigma', 'value res', 'value res', 'value res'), incomeRow24h);
	},
};

/**
 * Updater
 */
Updater = {
	/**
	 * "Constructor"
	 */
	start: function() {
		Updater.checkForUpdates();
	},

	/**
	 * Checks for updates for the Script.
	 */
	checkForUpdates: function() {
		GM_xmlhttpRequest ({
			method: 'GET',
			url: 'http://userscripts.org/scripts/source/' + scriptInfo.id + '.meta.js',
			headers: {'User-agent': 'Mozilla/5.0', 'Accept': 'text/html'},
			onload: function(response) {
				var metadata = Updater.formatMetadata(response.responseText);
				
				if(scriptInfo.version < metadata.version) {
					Updater.showUpdateInfo(metadata);
				}
			}
		});
	},
	
	/**
	 * Shows the update-information-panel.
	 * 
	 * @param	metadata	- array with formated metadata
	 */
	showUpdateInfo: function(metadata) {
		var updateHistory = Updater.extractUpdateHistory(metadata);
		
		Updater.setUpdateStyles();
		
		var updateBackground		= General.addElement('div', 'updateBackground', document.body, null);
		var updatePanelContainer	= General.addElement('div', 'updatePanelContainer', document.body, null);
		var updatePanel				= General.addElement('div', 'updatePanel', updatePanelContainer, null);
	
		var updatePanelHeader		= General.addElement('div', 'updatePanelHeader', updatePanel, null);
		var updatePanelHeaderL		= General.addElement('div', 'updatePanelHeaderL', updatePanelHeader, null);
		var updatePanelHeaderR		= General.addElement('div', 'updatePanelHeaderR', updatePanelHeaderL, null);
		var updatePanelHeaderM		= General.addElement('p',	'updatePanelHeaderM', updatePanelHeaderR, null);
	
		var updatePanelBody			= General.addElement('div', 'updatePanelBody', updatePanel, null);
		var updatePanelBodyL		= General.addElement('div', 'updatePanelBodyL', updatePanelBody, null);
		var updatePanelBodyR		= General.addElement('div', 'updatePanelBodyR', updatePanelBodyL, null);
		var updatePanelBodyM		= General.addElement('div', 'updatePanelBodyM', updatePanelBodyR, null);
		var updatePanelBodyMTop		= General.addElement('p',	'updatePanelBodyMTop', updatePanelBodyM, null);
		var updatePanelBodyMBottom	= General.addElement('div', 'updatePanelBodyMBottom', updatePanelBodyM, null);
		
		var updatePanelFooter		= General.addElement('div', 'updatePanelFooter', updatePanel, null);
		var updatePanelFooterL		= General.addElement('div', 'updatePanelFooterL', updatePanelFooter, null);
		var updatePanelFooterR		= General.addElement('div', 'updatePanelFooterR', updatePanelFooterL, null);
		var updatePanelFooterM		= General.addElement('div', 'updatePanelFooterM', updatePanelFooterR, null);
		
		var updatePanelInstall		= General.addElement('input', 'updatePanelInstall', updatePanel, null);
		updatePanelInstall.type		= 'button';
		updatePanelInstall.value	= lText.update.install;
		
		var updatePanelCB			= General.addElement('input', 'updatePanelCB', updatePanel, null);
		updatePanelCB.type			= 'button';
		updatePanelCB.value			= lText.update.close;
		
		updatePanelHeaderM.innerHTML		= lText.update.header + '<span><a><img id="script' + scriptInfo.id + 'updatePanelClose" src="skin/layout/notes_close.gif"></a></span>';
		updatePanelBodyMTop.innerHTML		= lText.update.text1 + '<a href="http://userscripts.org/scripts/show/' + scriptInfo.id + '" target="_blank" >' + scriptInfo.name + '</a>' + lText.update.text2 + '.<br>' + lText.update.text3 + scriptInfo.version + lText.update.text4 + metadata.version + '.<br>&nbsp;&nbsp;<b><u>' + lText.update.hist + ':</u></b>';
		updatePanelBodyMBottom.innerHTML	= Updater.formatUpdateHistory(updateHistory);
		updatePanelFooterM.innerHTML		= scriptInfo.name + ' v' + scriptInfo.version;
	
		General.$('script' + scriptInfo.id + 'updatePanelClose').addEventListener('click', Updater.closeUpdatePanel, true);
		updatePanelInstall.addEventListener('click', Updater.installScript, true);
		updatePanelCB.addEventListener('click', Updater.closeUpdatePanel, true);
	},
	
	/**
	 * Sets the styles that are used for the update-panel.
	 */
	setUpdateStyles: function() {
		GM_addStyle(
				"#script" + scriptInfo.id + "updateBackground			{ z-index: 9000; position: fixed; visibility: visible; top: 0px; left: 0px; width: 100%; height: 100%; padding: 0; background-color: #000; opacity: .7; } \
				 #script" + scriptInfo.id + "updatePanelContainer		{ z-index: 9999; position: fixed; visibility: visible; top: 100px; left: 50%; width: 500px; height: 370px; margin-left: -250px; padding: 0; text-align: left; color: #542C0F; font: 12px Arial,Helvetica,sans-serif; } \
				 #script" + scriptInfo.id + "updatePanel				{ position: relative; top: 0px; left: 0px; background-color: transparent; border: 0 none; overflow: hidden; } \
				 #script" + scriptInfo.id + "updatePanelHeader			{ height: 39px; background: none repeat scroll 0 0 transparent; font-weight: bold; line-height: 2; white-space: nowrap; } \
				 #script" + scriptInfo.id + "updatePanelHeaderL			{ height: 39px; background-image: url('skin/layout/notes_top_left.gif'); background-position: left top; background-repeat: no-repeat; } \
				 #script" + scriptInfo.id + "updatePanelHeaderR			{ height: 39px; background-image: url('skin/layout/notes_top_right.gif'); background-position: right top; background-repeat: no-repeat; } \
				 #script" + scriptInfo.id + "updatePanelHeaderM			{ height: 39px; margin: 0 14px 0 38px; padding: 12px 0 0; background-image: url('skin/layout/notes_top.gif'); background-position: left top; background-repeat: repeat-x; color: #811709; line-height: 1.34em; } \
				 #script" + scriptInfo.id + "updatePanelHeaderM span	{ text-align: right; display: block; margin: -15px 0 0; } \
				 #script" + scriptInfo.id + "updatePanelBody			{ height: 311px; background: none repeat scroll 0 0 transparent; } \
				 #script" + scriptInfo.id + "updatePanelBodyL			{ height: 100%; background-image: url('skin/layout/notes_left.gif'); background-position: left top; background-repeat: repeat-y; } \
				 #script" + scriptInfo.id + "updatePanelBodyR			{ height: 100%; background-image: url('skin/layout/notes_right.gif'); background-position: right top; background-repeat: repeat-y; } \
				 #script" + scriptInfo.id + "updatePanelBodyM			{ height: 100%; background-color: #F7E7C5; background-image: none;  margin: 0 6px; padding: 0 10px; font-size: 14px; } \
				 #script" + scriptInfo.id + "updatePanelBodyMTop		{ height: 100px; line-height: 2; } \
				 #script" + scriptInfo.id + "updatePanelBodyMTop b		{ line-height: 3.5; font-size:110%; } \
				 #script" + scriptInfo.id + "updatePanelBodyM a			{ color: #811709; font-weight: bold; } \
				 #script" + scriptInfo.id + "updatePanelBodyMBottom		{ height: 170px; padding: 10px; background: url('skin/input/textfield.gif') repeat-x scroll 0 0 #FFF7E1; border: 1px dotted #C0C0C0; font: 14px Arial,Helvetica,sans-serif; color: #000000; border-collapse: separate; overflow-y:auto; } \
				 #script" + scriptInfo.id + "updatePanelBodyMBottom h2	{ font-weight: bold; } \
				 .script" + scriptInfo.id + "updateTable				{ border-collapse: separate; border-spacing: 2px; } \
				 .script" + scriptInfo.id + "updateDataType				{ width: 100px; padding: 5px 0px 5px 5px; border: 1px solid #D2A860; } \
				 .script" + scriptInfo.id + "updateDataInfo				{ width: 300px; padding: 5px 5px 5px 20px; border: 1px solid #D2A860; } \
				 .script" + scriptInfo.id + "updateDataInfo ul li		{ list-style: disc outside none; } \
				 #script" + scriptInfo.id + "updatePanelFooter			{ height: 20px; background: none repeat scroll 0 0 transparent; } \
				 #script" + scriptInfo.id + "updatePanelFooterL			{ height: 100%; background-image: url('skin/layout/notes_left.gif'); background-position: left top; background-repeat: repeat-y; border: 0 none; } \
				 #script" + scriptInfo.id + "updatePanelFooterR			{ height: 21px; background-image: url('skin/layout/notes_br.gif'); background-position: right bottom; background-repeat: no-repeat; } \
				 #script" + scriptInfo.id + "updatePanelFooterM			{ background-color: #F7E7C5; border-bottom: 3px solid #D2A860; border-left: 2px solid #D2A860; margin: 0 23px 0 3px; padding: 5px 0 0; font-size: 77%; } \
				 #script" + scriptInfo.id + "updatePanelClose			{ cursor: pointer } \
				 #script" + scriptInfo.id + "updatePanelInstall			{ background: url('skin/input/button.gif') repeat-x scroll 0 0 #ECCF8E; bottom: -4px; position: absolute; border-color: #C9A584 #5D4C2F #5D4C2F #C9A584; border-style: double; border-width: 3px; cursor: pointer; display: inline; font-weight: bold; margin: 10px auto; padding: 2px 10px; text-align: center; font-size: 12px; left: 50%; margin-left: -105px; width: 100px; } \
				 #script" + scriptInfo.id + "updatePanelInstall:hover	{ color: #FFFFFF; text-decoration: none; } \
				 #script" + scriptInfo.id + "updatePanelInstall:active	{ border-color: #5D4C2F #C9A584 #C9A584 #5D4C2F; border-style: double; border-width: 3px; padding: 3px 10px 1px; } \
				 #script" + scriptInfo.id + "updatePanelCB				{ background: url('skin/input/button.gif') repeat-x scroll 0 0 #ECCF8E; bottom: -4px; position: absolute; border-color: #C9A584 #5D4C2F #5D4C2F #C9A584; border-style: double; border-width: 3px; cursor: pointer; display: inline; font-weight: bold; margin: 10px auto; padding: 2px 10px; text-align: center; font-size: 12px; left: 50%; margin-left: 5px; width: 100px; } \
				 #script" + scriptInfo.id + "updatePanelCB:hover		{ color: #FFFFFF; text-decoration: none; } \
				 #script" + scriptInfo.id + "updatePanelCB:active		{ border-color: #5D4C2F #C9A584 #C9A584 #5D4C2F; border-style: double; border-width: 3px; padding: 3px 10px 1px; }"
		);
	},
	
	/**
	 * Formats the given metadata.
	 * 
	 * @param	metadata	- the metadata to format
	 * @return	the formated metadata as array
	 */
	formatMetadata: function(metadataIn) {
		var metadataOut = new Array();
		var innerMeta = metadataIn.match(/\/\/ ==UserScript==((.|\n|\r)*?)\/\/ ==\/UserScript==/)[0];
		
		if(innerMeta) {
			var tags = innerMeta.match(/\/\/ @(.*?)(\n|\r)/g);
			
			for(var i = 0; i < tags.length; i++) {
				var tmp = tags[i].match(/\/\/ @(.*?)\s+(.*)/);
				
				if(!metadataOut[tmp[1]]) {
					metadataOut[tmp[1]] = new Array(tmp[2]);
				} else {
					metadataOut[tmp[1]].push(tmp[2]);
				}
			}
		}
		
		return metadataOut;
	},
	
	/**
	 * Extracts the update-history from the metadata.
	 * 
	 * @param	metadata	- array with the formated metadata
	 * @return	the extracted update-history
	 */
	extractUpdateHistory: function(metadata) {
		var updateHistory = new Array();
		
		for(var i = 0; i < metadata['history'].length; i++) {
			var tmp = metadata['history'][i].match(/^(\S+)\s+(\S+)\s+(.*)$/);
			
			if(!updateHistory[tmp[1]]) {
				updateHistory[tmp[1]] = new Array();
			}
			
			if(tmp[2] == 'Feature:') {
				if(!updateHistory[tmp[1]]['feature']) {
					updateHistory[tmp[1]]['feature'] = new Array(tmp[3]);
				} else {
					updateHistory[tmp[1]]['feature'].push(tmp[3]);
				}
			} else if(tmp[2] == 'Bugfix:') {
				if(!updateHistory[tmp[1]]['bugfix']) {
					updateHistory[tmp[1]]['bugfix'] = new Array(tmp[3]);
				} else {
					updateHistory[tmp[1]]['bugfix'].push(tmp[3]);
				}
			} else {
				if(!updateHistory[tmp[1]]['other']) {
					updateHistory[tmp[1]]['other'] = new Array(tmp[2] + " " + tmp[3]);
				} else {
					updateHistory[tmp[1]]['other'].push(tmp[2] + " " + tmp[3]);
				}
			}
		}
		
		return updateHistory;
	},
	
	/**
	 * Formats the Update history.
	 * 
	 * @param	updateHistory - the update History
	 * @return	the formated update history
	 */
	formatUpdateHistory: function(updateHistory) {
		var types = { feature: lText.update.feature,	bugfix: lText.update.bugfix,	other: '' };
		var formatedUpdateHistory = '';
	
		for(var version in updateHistory) {
			formatedUpdateHistory += '<h2>v ' + version + '</h2><br><table class="script' + scriptInfo.id + 'updateTable"><tbody>';
	
			for(var type in updateHistory[version]) {
				formatedUpdateHistory += '<tr><td class="script' + scriptInfo.id + 'updateDataType">' + types[type] + '</td><td class="script' + scriptInfo.id + 'updateDataInfo"><ul>';
				
				for(var i = 0 ; i < updateHistory[version][type].length; i++) {
					formatedUpdateHistory += '<li>' + updateHistory[version][type][i] + '</li>';
				}
				
				formatedUpdateHistory += '</ul></td></tr>';
			}
			
			formatedUpdateHistory += '</tbody></table><br>';
		}
	
		return formatedUpdateHistory;
	},
	
	/**
	 * Opens the install dialog and closes the update panel.
	 */
	installScript: function() {
		Updater.closeUpdatePanel();
		top.location.href = 'http://userscripts.org/scripts/source/' + scriptInfo.id + '.user.js';
	},
	
	/**
	 * Removes everything of the updater from the website.
	 */
	closeUpdatePanel: function() {
		document.body.removeChild(General.$('script' + scriptInfo.id + 'updateBackground'));
		document.body.removeChild(General.$('script' + scriptInfo.id + 'updatePanelContainer'));
	},
};

/**
 * Functions for language.
 */
Language = {
	/**
	 * Returns country code.
	 * 
	 * @return	the country code.
	 */
	getLang: function() {
		var lang = top.location.host.split('.');
		
		return (lang ? lang[1] : false) || 'en';
	},
	
	/**
	 * Returns the name of the current language.
	 * 
	 * @return	The name of the language.
	 */
	getLanguageName: function() {
		var implemented = new Array('english', 'german');

		var languageName = {
			ae: 'arabic',		ar: 'spanish',		ba: 'bosnian',		bg: 'bulgarian',	br: 'portuguese',	by: 'russian',
			cl: 'spanish',		cn: 'chinese',		co: 'spanish',		cz: 'czech',		de: 'german',		dk: 'danish',
			ee: 'estonian',		en: 'english',		es: 'spanish',		fi: 'finish',		fr: 'french',		gr: 'greek',
			hk: 'chinese',		hr: 'bosnian',		hu: 'hungarian',	id: 'indonesian',	il: 'hebrew',		it: 'italian',
			kr: 'korean',		lt: 'lithuanian',	lv: 'latvian',		mx: 'spanish',		nl: 'dutch',		no: 'norwegian',
			pe: 'spanish',		ph: 'filipino',		pk: 'urdu',			pl: 'polish',		pt: 'portuguese',	ro: 'romanian',
			rs: 'serbian',		ru: 'russian',		se: 'swedish',		si: 'slovene',		sk: 'slovak',		tr: 'turkish',
			tw: 'chinese',		ua: 'ukranian',		us: 'english',		ve: 'spanish',		vn: 'vietnamese',	yu: 'bosnian'
		}[Language.getLang()];
		
		for(var i = 0; i < implemented.length; i++) {
			if(implemented[i] == languageName) {
				return languageName;
			}
		}

		return 'english';
	},
	
	/*
	 * Returns the text for the Script.
	 * 
	 * @return	The script text.
	 */
	getText: function() {
		var text = {
			'english': {
				settings: {
					kiloSep:	',',
					decSep:		'.',
					left2right:	true,
				},
				income: {
					perHour:	'Income per hour',
					perDay:		'Income per day',
				},
				update: {
					header:		'Update available',
					text1:		'There is an update for ',
					text2:		' available',
					text3:		'At the moment there is version ',
					text4:		' installed. The newest version is ',
					hist:		'Version History',
					feature:	'Feature(s)',
					bugfix:		'Bugfix(es)',
					install:	'Install',
					close:		'Close',
				},
			},
			'german': {
				settings: {
					kiloSep:	'.',
					decSep:		',',
					left2right:	true,
				},
				income: {
					perHour:	'Einkommen pro Stunde',
					perDay:		'Einkommen pro Tag',
				},
				update: {
					header:		'Aktualisierung verf&uuml;gbar',
					text1:		'Es ist ein Update f&uuml;r ',
					text2:		' verf&uuml;gbar',
					text3:		'Zur Zeit ist Version ',
					text4:		' installiert. Die neueste Version ist ',
					hist:		'Versionshistorie',
					feature:	'Neuerung(en)',
					bugfix:		'Bugfix(e)',
					install:	'Installieren',
					close:		'Schlie�en',
				},
			},
		}[Language.getLanguageName()];

		return text;
	},
};

lText = Language.getText();

/**
 * The main function of the script.
 */
function main() {
	// Call the function to check for updates.
	Updater.start();
	
	// Call the function to enhance the view.
	EnhancedView.start();
}

// Call the main-function of the script.
main();