// ==UserScript==
// @name			Enhanced UI
// @description		Enhancements for the user interface of Ikariam.
// @namespace		Tobbe
// @author			Tobbe
// @version			4.00
//
// @include			http://s*.*.ikariam.*/*
// @include			http://m*.*.ikariam.*/*
// 
// @exclude			http://support.*.ikariam.*/*
// 
// @history			4.00	Feature: Options panel to enable/disable funtions and set settings. (mobile & desktop)
// @history			4.00	Feature: Update interval can be set. (mobile & desktop)
// @history			4.00	Feature: Manually check for updates. (mobile & desktop)
// @history			4.00	Feature: Zoom funtion without resizing the whole view. (desktop)
// @history			4.00	Feature: Move loading circle to another position. (desktop)
// @history			4.00	Feature: Show tooltip in Alliance / Military view on mouseover. (desktop)
// @history			4.00	Feature: Code better commented. More comments, so that it is easier to understand.
// @history			4.00	Bugfix: Changed *.gif to *.png.
// @history			4.00	Version numbers adjusted.
//
// @history			3.01	Feature: Support for mobile interface.
// @history			3.01	Bugfix: Fixed bug with scrollbar in finances view. (desktop)
// 
// @history			3.00	Feature: Ready for 0.5.0, but also supports 0.4.5 furthermore.
// @history			3.00	Feature: Implemented support for different languages.
// @history			3.00	Feature: Enhanced script updater.
// @history			3.00	Feature: Cleaned up code.
// @history			3.00	Feature: Rename the script to "Enhanced UI".
// @history			3.00	Feature: Change the namespace to "Tobbe".
// @history			3.00	Because of the change of namespace and name you have to delete the old script manually!
//
// @history			2.05	Bugfix: Problem with negative numbers and 0.4.2.4 fixed.
//
// @history			2.04	Feature: Own script updater.
// @history			2.04	Bugfix: Remove everything what refered to other scripts.
//
// @history			2.03	Feature: New script updater.
//
// @history			2.02	Remove the script updater (Because of the problem with Greasemonkey scripts).
//
// @history			2.01	Feature: New style of update panel.
// @history			2.01	Bugfix: Bug with ',' as seperator fixed.
//
// @history			2.00	Feature: Income in 24h added.
// @history			2.00	Feature: Cleaned up code.
//
// @history			1.01	Feature: Update check implemented.
//
// @history			1.00	Initial release.
// ==/UserScript==

/******************************************************************************************************************
*** The update function which is used in the script was developed by PhasmaExMachina and adapted by me (Tobbe). ***
******************************************************************************************************************/

/**
 * Information about the Script.
 */
const scriptInfo = {
	version:	'4.00',
	id:			74221,
	name:		'Ikariam Enhanced UI',
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
 * General functions.
 */
General = {
	/**
	 * Gets an element by the id and returns it.
	 * 
	 * @param	int		id
	 *   The id of the element.
	 * @return	element
	 *   The element.
	 */
	$: function(id) {
		return document.getElementById(id);
	},
	
	/**
	 * Gets elements by their class name and returns them.
	 * 
	 * @param	String	className
	 *   The class name of the elements.
	 * @return	element[]
	 *   The elements.
	 */
	$$: function(className) {
		return document.getElementsByClassName(className);
	},
	
	setStyles: function() {
		// Add the general used styles.
		GM_addStyle(
				 ".script" + scriptInfo.id + "selectOptions	{ z-Index: 65112 !important; position: absolute !important; top: 25px !important; left: 0px !important; } \
				 .hidden									{ visibility: hidden !important; }"
			);
	},
	
	/**
	 * Formats a number to that format that is used in Ikariam.
	 *
	 * @param	int		num
	 *   The number to format.
	 * @return	String
	 *   The formated number.
	 */
	formatToIkaNumber: function(num) {
		var txt = num + '';
		
		// Set a seperator every 3 digits from the end.
		txt = txt.replace(/(\d)(?=(\d{3})+\b)/g,'$1' + lText.settings.kiloSep);
		
		// If the number ist negative write it in red.
		if(num < 0) {
			txt = '<span class="red bold negative">' + txt + '</span>';
		}
		
		// Return the formated number.
		return txt;
	},
	
	/**
	 * Adds cells to a table row.
	 * 
	 * @param	String[]	cellText
	 *   Array with the text of the cells.
	 * @param	String[]	cellClassName
	 *   Array with the classes of the cells.
	 * @param	element		row
	 *   Table row where the cells should be added.
	 */
	createTableRow: function(cellText, cellClassName, row) {
		// Do this for every cell.
		for(var i = 0; i < cellText.length; i++) {
			// Add the cell.
			var cell = General.addElement('td', '', row, null);
			
			// Set the content of the cell.
			cell.innerHTML = cellText[i];

			// Set the class of the cell.
			cell.className = cellClassName[i];
		}
	},
	
	/**
	 * Creates a new element and adds it to a parent.
	 * 
	 * @param	String	type
	 *   The type of the new element.
	 * @param	int		id
	 *   The last part of the id of the element (The first part will be "script" + the script-id. If null, no id will be set.).
	 * @param	element	parent
	 *   The parent of the new element.
	 * @param	element	nextSib
	 *   The next sibling of the element (If null the element will be added at the end).
	 * @return	element
	 *   The new element.
	 */
	addElement: function(type, id, parent, nextSib) {
		// Create the new Element.
		var newElement = document.createElement(type);
		
		// If there is a id, set it.
		if(id) {
			newElement.id = 'script' + scriptInfo.id + id;
		}
		
		// If there is the next sibling defined, insert it before it.
		if(nextSib) {
			parent.insertBefore(newElement, nextSib);

		// Otherwise insert it at the end.
		} else {
			parent.appendChild(newElement);
		}
		
		// Return the new element.
		return newElement;
	},
	
	/**
	 * Creates a new checkbox with label and adds it to a parent.
	 * 
	 * @param	element	parent
	 *   The parent of the new checkbox.
	 * @param	String	id
	 *   The middle part of the id of the elements.
	 * @param	boolean	checked
	 *   If the checkbox is checked or not.
	 * @param	String	labelText
	 *   The text of the label.
	 */
	addCheckbox: function(parent, id, checked, labelText) {
		// Create the wrapper for the checkbox and the label.
		var cbWrapper		= General.addElement('div', null, parent, null);
		cbWrapper.classList.add('cbWrapper');

		// Create the checkbox and the label.
		var cbInvisible			= General.addElement('input', id + 'CbInvisible', cbWrapper, null);
		var cb					= General.addElement('div', id + 'Cb', cbWrapper, null);
		var cbLabel				= General.addElement('span', id + 'CbLabel', cbWrapper, null);
		
		// Set the checkbox settings.
		cbInvisible.type		= 'checkbox';
		cbInvisible.checked		= checked ? 'checked' : '';
		cbInvisible.classList.add('invisible');
		
		// Set the settings of the label.
		cbLabel.innerHTML		= labelText;
		
		// Set the settings of the picture of the checkbox the user sees.
		cb.classList.add('checkbox');
		cb.classList.add('floatleft');
		if(checked)	cb.classList.add('checked');

		// Add the action listener.
		cb.addEventListener('click', EventHandling.checkbox.toggle, false);
	},
	
	/**
	 * Creates a new select field with label and options and adds it to a parent.
	 * 
	 * @param	element	parent
	 *   The parent of the new checkbox.
	 * @param	String	id
	 *   The middle part of the id of the elements.
	 * @param	boolean	selected
	 *   The value of the selected option.
	 * @param	mixed[]	opts
	 *   An array with the names an values of the options.
	 */
	addSelect: function(parent, id, selected, opts, maxOptsShown) {
		// Create the wrapper for the select.
		var wrapper				= General.addElement('div', null, parent, null);
		wrapper.style.position	= 'relative';
		wrapper.classList.add('select_container');
		wrapper.classList.add('size175');

		// Create the hidden field to store the selection.
		var hiddenField		= General.addElement('input', id + 'SelectHiddenField', wrapper, null);
		hiddenField.type	= 'hidden';
		hiddenField.value	= selected;
		
		// Add the select header.
		var headerWrapper		= General.addElement('span', id + 'SelectHeader', wrapper, null);
		headerWrapper.classList.add('yui-button');
		var	header				= General.addElement('button', id + 'SelectHeaderButton', headerWrapper, null);
		header.type				= 'button';
		header.innerHTML		= opts['name'][opts['value'].indexOf(selected)];

		// Set the actions for the header.
		headerWrapper.addEventListener('mouseover', EventHandling.selectHeaderWrapper.mouseover, false);
		headerWrapper.addEventListener('mouseout', EventHandling.selectHeaderWrapper.mouseout, false);
		headerWrapper.addEventListener('click', EventHandling.selectHeaderWrapper.click, false);
		
		// Add the select options wrapper.
		var optionsWrapper	= General.addElement('div', id + 'SelectOptions', wrapper, null);
		optionsWrapper.classList.add('yuimenu');
		optionsWrapper.classList.add('hidden');
		optionsWrapper.classList.add('script' + scriptInfo.id + 'selectOptions');
		
		// Set the list wrapper to the optionsWrapper.
		var listWrapper = optionsWrapper;

		// Add the scroll funtion if necessary.
		if(opts['name'].length > maxOptsShown) {
			// Create arrow for scroll up.
			var scrollUp	= General.addElement('div', null, optionsWrapper, null);
			scrollUp.classList.add('topscrollbar');
			
			// Create scroll body.
			var scrollBody			= General.addElement('div', id + 'SelectScrollBody', optionsWrapper, null);
			scrollBody.style.height	= maxOptsShown * 24 + 'px';
			scrollBody.classList.add('yui-menu-body-scrolled');
			
			// Set the lsit wrapper to the scroll body.
			listWrapper		= scrollBody;
			
			// Create arrow for scroll down.
			var scrollDown	= General.addElement('div', null, optionsWrapper, null);
			scrollDown.classList.add('bottomscrollbar');
			
			// Add the Event listener.
			scrollUp.addEventListener('mouseover', EventHandling.selectOptionsScrollUp.mouseover, false);
			scrollDown.addEventListener('mouseover', EventHandling.selectOptionsScrollDown.mouseover, false);
			scrollUp.addEventListener('mouseout', EventHandling.selectOptionsScrollUp.mouseout, false);
			scrollDown.addEventListener('mouseout', EventHandling.selectOptionsScrollDown.mouseout, false);
		}

		// Add the options list.
		var optionsList	= General.addElement('ul', null, listWrapper, null);
		
		// Add a hidden field, where the first part of the name of the elements id is stored.
		var hiddenField		= General.addElement('input', null, optionsList, null);
		hiddenField.type	= 'hidden';
		hiddenField.value	= 'script' + scriptInfo.id + id;

		// Add the Options.
		for(var i = 0; i < opts['name'].length; i++) {
			// Create an option.
			var option	= General.addElement('li', null, optionsList, null);
			option.classList.add('yuimenuitem');

			// Set the value.
			var optionValue		= General.addElement('input', null, option, null);
			optionValue.type	= 'hidden';
			optionValue.value	= opts['value'][i];

			// Set the shown name.
			var optionName			= General.addElement('span', null, option, null);
			optionName.innerHTML	= opts['name'][i];
			
			// Set the actions for the option.
			option.addEventListener('mouseover', EventHandling.selectOption.mouseover, false);
			option.addEventListener('mouseout', EventHandling.selectOption.mouseout, false);
			option.addEventListener('click', EventHandling.selectOption.click, false);
		}
	},
	
	/**
	 * Scrolls an element vertically.
	 * 
	 * @param	element	elem
	 *   The element which should be scrolled.
	 * @param	boolean	up
	 *   If the element hould be scrolled upwards.
	 * @param	in		step
	 *   The step the element should be scrolled.
	 */
	scrollVertical: function(toScroll, up, step) {
		// Get the actual position of the scrollbar.
		var scrolled	= toScroll.scrollTop;
		
		// If scrolling upwards, subtract the step from the position.
		if(up) {
			scrollTo	= scrolled - step;

		// Otherwise add the step to the position.
		} else {
			scrollTo	= scrolled + step;
		}
		
		// Set the new position.
		toScroll.scrollTop	= scrollTo;
	},
	
	/**
	 * Returns if the user is logged in to the mobile version.
	 * 
	 * @return	boolean
	 *   The login-status to mobile.
	 */
	isMobileVersion: function() {
		return (top.location.href.search(/http:\/\/m/) > -1);
	},
	
	/**
	 * Shows a hint to the user (desktop).
	 * 
	 * @param	String	type
	 *   The type of the hint.
	 * @param	String	text
	 *   The hint text.
	 * @param	int		duration
	 *   The time in seconds the hint should be shown.
	 */
	showHint: function(type, text, duration) {
		// Set type specific vars.
		switch(type) {
			// Confirm action.
			case 'confirm':
				tipColorClass	= 'greenTip';
				tipSymbolClass	= 'confirmCheckmark';
			  break;
			
			case 'error':
				tipColorClass	= 'redTip';
				tipSymbolClass	= 'errorCross';
			  break;
			
			default:
				tipColorClass	= '';
				tipSymbolClass	= '';
			  break;
		}
		
		// Get the tooltip placeholder.
		var bubbleTip			= General.$$('bubble_tip')[0];
		
		// Move the tooltip to the correct position.
		var advisors			= General.$('advisors');
		bubbleTip.style.left	= advisors.offsetLeft - 134 + 'px';
		bubbleTip.style.top		= advisors.offsetTop + advisors.offsetHeight - 50 + 'px';
		
		// Create the wrapper of the tooltip.
		var feedbackTip	= General.addElement('div', null, bubbleTip, null);
		feedbackTip.classList.add('feedbackTip');
		feedbackTip.classList.add('bubbleTooltip');
		feedbackTip.classList.add(tipColorClass);
		feedbackTip.style.opacity	= 0.9;
		
		// Create the header of the tooltip.
		var top	= General.addElement('div', null, feedbackTip, null);
		top.classList.add('top');
		
		// Create the body of the tooltip.
		var repeat			= General.addElement('div', null, feedbackTip, null);
		repeat.innerHTML	= text;
		repeat.classList.add('repeat');
		
		// Create the bottom of the tooltip.
		var bottom	= General.addElement('div', null, feedbackTip, null);
		bottom.classList.add('bottom');
		
		// Set the symbol.
		var symbol	= General.addElement('span', null, feedbackTip, null);
		symbol.classList.add(tipSymbolClass);

		// Set time untill the hint will be removed.
		setTimeout(General.removeHint, duration * 1000);
	},
	
	/**
	 * Removes a hint.
	 */
	removeHint: function() {
		// Get the tooltip placeholder.
		var bubbleTip	= General.$$('bubble_tip')[0];
		// Get the child node to remove.
		var toDelete	= bubbleTip.firstChild;
		
		// Remove the child node.
		bubbleTip.removeChild(toDelete);
	}
};

/**
 * Functions for event handling.
 */
EventHandling = {
	/**
	 * Events for checkboxes.
	 */
	checkbox: {
		/**
		 * Switches the value of a checkbox.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		toggle: function(e) {
			// Get the element from the event.
			e = e || unsafeWindow.event;
			var target = e.target || e.srcElement;
			
			// Get the information which is needed.
			var callerId = this.id;
			var cb = General.$(callerId + 'Invisible');
			var checked = cb.checked;
			
			// Switch the value.
			this.classList.toggle('checked');
			cb.checked = !checked;
		},
	},
	
	/**
	 * Events for select header.
	 */
	selectHeaderWrapper: {
		/**
		 * Hovers the header of a select field.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		mouseover: function(e) {
			// Get the element from the event.
			e = e || unsafeWindow.event;
			var target = e.target || e.srcElement;
			
			// Add the hover classes.
			this.classList.add('yui-button-hover');
		},
		
		/**
		 * Removes the hover of the header of a select field.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		mouseout: function(e) {
			// Get the element from the event.
			e = e || unsafeWindow.event;
			var target = e.target || e.srcElement;
			
			// Remove the hover classes.
			this.classList.remove('yui-button-hover');
		},
		
		/**
		 * Shows/Removes the options div and toggles the button active classes.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		click: function(e) {
			// Get the element from the event.
			e = e || unsafeWindow.event;
			var target = e.target || e.srcElement;
			
			// Should the select field be activated?
			var activate	= !this.classList.contains('yui-button-active');
			
			// Close all other select fields.
			var selectOptionsShown = General.$$('yui-button-active');
			
			for(var i = 0; i < selectOptionsShown.length; i++) {
				selectOptionsShown[i].nextSibling.classList.add('hidden');
				selectOptionsShown[i].classList.remove('yui-button-active');
				
			}
			
			// If the select field should be activated do so.
			if(activate) {
				this.classList.add('yui-button-active');
				this.nextSibling.classList.remove('hidden');
			}
		},
	},
	
	/**
	 * Events for select option.
	 */
	selectOption: {
		/**
		 * Hovers an option of a select field.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		mouseover: function(e) {
			// Get the element from the event.
			e = e || unsafeWindow.event;
			var target = e.target || e.srcElement;
			
			// Add the hover class.
			this.classList.add('yuimenuitem-selected');
		},
		
		/**
		 * Removes the hover of an option of a select field.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		mouseout: function(e) {
			// Get the element from the event.
			e = e || unsafeWindow.event;
			var target = e.target || e.srcElement;
			
			// Remove the hover class.
			this.classList.remove('yuimenuitem-selected');
		},
		
		/**
		 * Sets the hidden value to be stored to the value of this field.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		click: function(e) {
			// Get the element from the event.
			e = e || unsafeWindow.event;
			var target = e.target || e.srcElement;
			
			// Get the first part of the elements id.
			var idStart			= this.parentNode.firstChild.value;

			// Set the value of the hidden field.
			var hiddenField		= General.$(idStart + 'SelectHiddenField');
			hiddenField.value	= this.firstChild.value;
			
			// Set the header.
			var headerBtn		= General.$(idStart + 'SelectHeaderButton');
			headerBtn.innerHTML	= this.lastChild.innerHTML;
			
			// Hide the option list and reset the header view.
			General.$(idStart + 'SelectOptions').classList.toggle('hidden');
			General.$(idStart + 'SelectHeader').classList.toggle('yui-button-active');
		},
	},
	
	/**
	 * Events for scrolling the option group of a select field upwards.
	 */
	selectOptionsScrollUp: {
		/**
		 * Storage for the interval.
		 */
		interval: null,
		
		/**
		 * Start the scrolling when entering the scroll up field with the mouse.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		mouseover: function(e) {
			// Get the element from the event.
			e = e || unsafeWindow.event;
			var target = e.target || e.srcElement;

			// Get the element to scroll.
			var scrollBody	= this.nextSibling;
			
			// Start the interval.
			EventHandling.selectOptionsScrollUp.interval = setInterval(function() { General.scrollVertical(scrollBody, true, 3); }, 20);
		},
		
		/**
		 * Stop the scrolling when leaving the scroll up field with the mouse.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		mouseout: function(e) {
			// Get the element from the event.
			e = e || unsafeWindow.event;
			var target = e.target || e.srcElement;
			
			// Clear the interval.
			clearInterval(EventHandling.selectOptionsScrollUp.interval);
		},
	},
	
	/**
	 * Events for scrolling the option group of a select field downwards.
	 */
	selectOptionsScrollDown: {
		/**
		 * Storage for the interval.
		 */
		interval: null,
		
		/**
		 * Start the scrolling when entering the scroll down field with the mouse.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		mouseover: function(e) {
			// Get the element from the event.
			e = e || unsafeWindow.event;
			var target = e.target || e.srcElement;
			
			// Get the element to scroll.
			var scrollBody	= this.previousSibling;
			
			// Start the interval.
			EventHandling.selectOptionsScrollDown.interval = setInterval(function() { General.scrollVertical(scrollBody, false, 3) }, 20);
		},
		
		/**
		 * Stop the scrolling when leaving the scroll up field with the mouse.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		mouseout: function(e) {
			// Get the element from the event.
			e = e || unsafeWindow.event;
			var target = e.target || e.srcElement;
			
			// Stop the interval.
			clearInterval(EventHandling.selectOptionsScrollDown.interval);
		},
	},
	
	/**
	 * Events for loading preview.
	 */
	loadingPreview: {
		/**
		 * Is called after an attribute of loadingPreview was modified.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		attrModified: function(e) {
			// Get the element from the event.
			e = e || unsafeWindow.event;
			var target = e.target || e.srcElement;

			// If the attribute was changed.
			if(e.attrChange == MutationEvent.MODIFICATION) {
				// If the style.display is set to none.
				if(e.attrName == 'style' && e.newValue == 'display: none;') {
					// Timeout to have access to GM_ funtions.
					setTimeout(EnhancedView.getPopup, 0);
				}
			}
		},
	},
};

/**
 * Functions for enhanced view.
 */
EnhancedView = {
	/**
	 * Inits the enhanced view.
	 * Decides if the version of ikariam is mobile or desktop.
	 */
	init: function() {
		// If the version is mobile.
		if(General.isMobileVersion()) {
			EnhancedView.initMobile();
		
		// Otherwise; the version is desktop.
		} else {
			EnhancedView.initDesktop();
		}
	},
	
	/**
	 * Inits the desktop version.
	 * Adds the event listener to the loadingPreview.
	 */
	initDesktop: function() {
		// Wait for a popup.
		General.$('loadingPreview').addEventListener('DOMAttrModified', EventHandling.loadingPreview.attrModified, false);
		
		// Init parts which are not shown in popups.
		EnhancedView.initDesktopStatic();
	},
	
	/**
	 * Inits the modifications on the website which are not shown in popups.
	 */
	initDesktopStatic: function() {
		// Move loading circle.
		if(GM_getValue('module_lcMoveActive', true))	View.moveLoadingCircle();
		
		// Zoom function.
		if(GM_getValue('module_zoomActive', true))		ZoomFunction.init();
	},
	
	/**
	 * Inits the mobile version.
	 */
	initMobile: function() {
		// Get the param string.
		var params = top.location.search;

		// If the view is finances and show income on top is enabled.
		if(params.search(/view=finances/) > -1 && GM_getValue('module_incomeActive', true)) {
			IncomeOnTop.mobile();
		}

		// If the view is game options.
		if(params.search(/view=options&page=game/) > -1) {
			OptionPanel.mobile();
		}
	},
	
	/**
	 * Calls the script module depending on the popup.
	 */
	getPopup: function() {
		// Options popup.
		if(General.$('options_c'))	OptionPanel.desktop();
		
		// Finance popup.
		if(General.$('finances_c') && GM_getValue('module_incomeActive', true))			IncomeOnTop.desktop();
		
		// Military view popup.
		if(General.$('militaryAdvisor_c') && GM_getValue('module_ttAutoActive', true))	Tooltips.autoshowInMilitaryView();
		
		// Diplomacy ally view popup.
		if(General.$('diplomacyAlly_c') && GM_getValue('module_ttAutoActive', true))	Tooltips.autoshowInAllianceView();
		
		// Diplomacy ally view popup.
		if(General.$('embassy_c') && GM_getValue('module_ttAutoActive', true))			Tooltips.autoshowInAllianceView();
	},
};

/**
 * Functions for the loading circle.
 */
View = {
	/**
	 * Move loading circle to breadcrumb.
	 */
	moveLoadingCircle: function() {
		// Add the styles.
		GM_addStyle(
				"#js_worldBread		{ margin-left: 16px !important; } \
				 #loadingPreview	{ -moz-transform: scale(0.5) !important; -webkit-transform: scale(0.5) !important; left: 35px !important; top: 141px !important; }"
			);
	},
};

/**
 * Functions for tooltips.
 */
Tooltips = {
	/**
	 * Show tooltips in alliance view automatically.
	 */
	autoshowInAllianceView: function() {
		// Enable toggling on mouseover / mouseout.
		Tooltips.autoshowGeneral('cityInfo');
	},
	
	/**
	 * Show tooltips in military advisor view automatically.
	 */
	autoshowInMilitaryView: function() {
		// Enable toggling on mouseover / mouseout.
		Tooltips.autoshowGeneral('spyMilitary');
	},
	
	/**
	 * Show tooltips with class name magnifierClass automatically.
	 * 
	 * @param	String	magnifierClass
	 *   The class of the tooltips to enable toggling.
	 */
	autoshowGeneral: function(magnifierClass) {
		// Get all magnifiers.
		var magnifier = General.$$(magnifierClass);
		
		// Set the mousover and mouseout for all magnifiers.
		for(var i = 0; i < magnifier.length; i++) {
			var magOnClick = magnifier[i].onclick;
			magnifier[i].onclick = 'return false;';
			magnifier[i].addEventListener('mouseover', magOnClick, false);
			magnifier[i].addEventListener('mouseout', magOnClick, false);
		}
	},
};

/**
 * Functions for show income on top.
 */
IncomeOnTop = {
	/**
	 * Shows the actual income also on top of the site. (desktop)
	 */
	desktop: function() {
		// Get the table for the summary.
		var summaryTable = General.$$('table01')[0];
		
		// Show the income on top.
		IncomeOnTop.show(summaryTable);
		
		// Adjust the size of the Scrollbar.
		unsafeWindow.ikariam.controller.adjustSizes();
	},
	
	/**
	 * Shows the actual income also on top of the site. (mobile)
	 */
	mobile: function() {
		// Get the table for the summary.
		var summaryTable = General.$('balance');
		
		// Show the income on top.
		IncomeOnTop.show(summaryTable);
	},
	
	/**
	 * Show the actual income on top of the site.
	 * 
	 * @param	element
	 *   The table for the summary.
	 */
	show: function(summaryTable) {
		// Get the actual income.
		var income = IncomeOnTop.getIncome();
		
		// Create the rows for the income per day and the income per day.
		incomeRow		= summaryTable.insertRow(1);
		incomeRow24h	= summaryTable.insertRow(2);
		
		// Set the classes of the table rows.
		incomeRow.className		= 'result alt';
		incomeRow24h.className	= 'result';
		
		// Create the content of the table rows.
		General.createTableRow(new Array(lText.income.perHour, '', '', General.formatToIkaNumber(income)), new Array('sigma', 'value res', 'value res', 'value res'), incomeRow);
		General.createTableRow(new Array(lText.income.perDay, '', '', General.formatToIkaNumber(income * 24)), new Array('sigma', 'value res', 'value res', 'value res'), incomeRow24h);
	},
	
	/**
	 * Gets the actual income from the Ikariam page and returns it.
	 * 
	 * @return	int
	 *   The actual income
	 */
	getIncome: function() {
		// Get the table cell with the actual income.
		var incomeCell = General.$$('hidden');
		incomeCell = incomeCell[incomeCell.length - 1];
		
		// If the content of the cell is not just the income move one element inwards.
		while(incomeCell.firstChild.firstChild) {
			incomeCell = incomeCell.firstChild;
		}
		
		// Get the actual income.
		var txt = incomeCell.innerHTML;
		
		// Remove the thousand seperators.
		return parseInt(txt.replace(lText.settings.kiloSep, ''));
	},
};
	
/**
 * Functions for option panel.
 */
OptionPanel = {
	/**
	 * Adds the tab for GM in the desktop version.
	 */
	desktop: function() {
		// If the tab already exists return.
		if(General.$('tabScriptOptions')) {
			return;
		}

		// Set the styles.
		OptionPanel.setStylesDesktop();

		// Add the GM tab link to the tab menu.
		var tabmenu					= General.$$('tabmenu')[0];
		jsTabGMOptions				= General.addElement('li', null, tabmenu, null);
		jsTabGMOptions.id			= 'js_tabScriptOptions';
		jsTabGMOptions.className	= 'tab';
		jsTabGMOptions.setAttribute('onclick', "switchTab('tabScriptOptions');");
		jsTabGMOptions.innerHTML	= '<b class="tabScriptOptions"> ' + lText.optionPanel.scripts + ' </b>';
		
		// Add the content wrapper for the GM tab to the tab menu.
		var mainContent				= General.$('tabGameOptions').parentNode;
		tabGMOptions				= General.addElement('div', null, mainContent, null);
		tabGMOptions.id				= 'tabScriptOptions';
		tabGMOptions.style.display	= 'none';
		OptionPanel.createTabContent(tabGMOptions);
	},
	
	/**
	 * Shows the options for GM in the mobile version.
	 */
	mobile: function() {
		// Get the mainview.
		var mainview = General.$('mainview');
		
		// Create the options wrapper.
		var wrapper = OptionPanel.createOptionsWrapper(mainview, scriptInfo.name);
		
		// Add the checkboxes for the enabling / disabling of modules.
		OptionPanel.createModuleContentMobile(wrapper);
		
		// Add the options for updates.
		OptionPanel.createUpdateContentMobile(wrapper);
		
		// Horizontal row.
		General.addElement('hr', null, wrapper, null);

		// Prepare placeholder for ave hint.
		General.addElement('p', 'saveHint', wrapper, null);
		
		// Add the button to save the settings.
		OptionPanel.addSaveButtonMobile(wrapper);
	},
	
	/**
	 * Sets the styles that are used for the update-panel.
	 */
	setStylesDesktop: function() {
		// Add all styles to the ikariam page.
		GM_addStyle(
				"#js_tabGameOptions, #js_tabAccountOptions, #js_tabFacebookOptions, #js_tabOpenIDOptions, #js_tabScriptOptions	{ width: 130px !important; margin-left: 5px !important; border-radius: 5px 5px 0px 0px } \
				 .cbWrapper			{ margin: 0 0 0 10px; }"
			);
	},
	
	/**
	 * Creates the content of the tab.
	 * 
	 * @param	element	tab
	 *   The tab where the content should be added.
	 */
	createTabContent: function(tab) {
		// Create the wrapper for the enabling / disabling of modules.
		var moduleContentWrapper	= OptionPanel.createOptionsWrapper(tab, lText.optionPanel.module);
		OptionPanel.createModuleContent(moduleContentWrapper);
		
		// Create the wrapper for the update settings.
		var updateContentWrapper	= OptionPanel.createOptionsWrapper(tab, lText.optionPanel.update);
		OptionPanel.createUpdateContent(updateContentWrapper);
		
		// Create the wrapper for the zoom settings.
		var zoomContentWrapper		= OptionPanel.createOptionsWrapper(tab, lText.optionPanel.zoom);
		OptionPanel.createZoomContent(zoomContentWrapper);

		var spacer			= General.addElement('p', null, tab, null);
		spacer.innerHTML	= '&nbsp;';
	},
	
	/**
	 * Create a wrapper for a section on the option panel.
	 * 
	 * @param	element	tab
	 *   The tab where the wrapper should be added.
	 * @param	String	headerText
	 *   The text of the header.
	 * 
	 * @return	element
	 *   The wrapper for the content of the options.
	 */
	createOptionsWrapper: function(tab, headerText) {
		// Create the wrapper.
		var optionsWrapper			= General.addElement('div', null, tab, null);
		optionsWrapper.className	= 'contentBox01h';
		
		// Create the header.
		var optionsHeader		= General.addElement('h3', null, optionsWrapper, null);
		optionsHeader.className	= 'header';
		optionsHeader.innerHTML	= headerText;
		
		// Create the content wrapper.
		var optionsWrapperContent		= General.addElement('div', null, optionsWrapper, null);
		optionsWrapperContent.className	= 'content';
		
		// Create the footer.
		var optionsFooter		= General.addElement('div', null, optionsWrapper, null);
		optionsFooter.className	= 'footer';
		
		// Return the content wrapper.
		return optionsWrapperContent;
	},
	
	/**
	 * Creates the content of the module part.
	 * 
	 * @param	element	contentWrapper
	 *   The wrapper where the content should be added.
	 */
	createModuleContent: function(contentWrapper) {
		// Create options table.
		var updateTable	= OptionPanel.addOptionsTable(contentWrapper);
		
		// Get the ids.
		var id		= new Array(
							'update',
							'incomeOnTop',
							'zoom',
							'loadingCircleMove',
							'tooltipsAuto');
		
		// Get the values.
		var value	= new Array(
							GM_getValue('module_updateActive', true),
							GM_getValue('module_incomeActive', true),
							GM_getValue('module_zoomActive', true),
							GM_getValue('module_lcMoveActive', true),
							GM_getValue('module_ttAutoActive', true));
		
		// Get the labels.
		var label	= new Array(
							lText.optionPanel.label.updateActive,
							lText.optionPanel.label.incomeOnTopActive,
							lText.optionPanel.label.zoomActive,
							lText.optionPanel.label.lcMoveActive,
							lText.optionPanel.label.tooltipsAutoActive);
		
		for(var i = 0; i < id.length; i++) {
			// Create table row.
			var tr	= OptionPanel.addOptionsTableRow(updateTable, true);

			// Create checkbox.
			General.addCheckbox(tr.firstChild, id[i], value[i], label[i]);
			
			// Add class for checkbox.
			tr.firstChild.classList.add('left');
		}

		// Add the button to save the settings.
		OptionPanel.addSaveButton(contentWrapper);
	},
	
	/**
	 * Creates the content of the module part of the mobile version.
	 * 
	 * @param	element	contentWrapper
	 *   The wrapper where the content should be added.
	 */
	createModuleContentMobile: function(contentWrapper) {
		// Create the header.
		var moduleHeader		= General.addElement('h3', null, contentWrapper, null);
		moduleHeader.innerHTML	= lText.optionPanel.module;
		
		// Get the ids.
		var id		= new Array(
							'update',
							'incomeOnTop');
		
		// Get the values.
		var value	= new Array(
							GM_getValue('module_updateActive', true),
							GM_getValue('module_incomeActive', true));
		
		// Get the labels.
		var label	= new Array(
							'&nbsp;&nbsp;' + lText.optionPanel.label.updateActive,
							'&nbsp;&nbsp;' + lText.optionPanel.label.incomeOnTopActive);
		
		// Create the checkboxes and labels.
		for(var i = 0; i < id.length; i++) {
			// Create the checkbox wrapper.
			var p				= General.addElement('p', null, contentWrapper, null);
			p.style.textAlign	= 'left';
			
			// Create the checkbox.
			var cb		= General.addElement('input', id[i] + 'Cb', p, null);
			cb.type		= 'checkbox';
			cb.checked	= value[i];
			
			// Create the checkbox label.
			var cbLabel			= General.addElement('label', id[i] + 'Label', p, null);
			cbLabel.innerHTML	= label[i];
			cbLabel.htmlFor		= 'script' + scriptInfo.id + id[i] + 'Cb';
		}
	},
	
	/**
	 * Creates the content of the update part.
	 * 
	 * @param	element	contentWrapper
	 *   The wrapper where the content should be added.
	 */
	createUpdateContent: function(contentWrapper) {
		// Create options table.
		var updateTable	= OptionPanel.addOptionsTable(contentWrapper);
		var tr1			= OptionPanel.addOptionsTableRow(updateTable, false);
		var tr2			= OptionPanel.addOptionsTableRow(updateTable, true);

		// Create label.
		var updateIntervalLabel			= General.addElement('span', null, tr1.firstChild, null);
		updateIntervalLabel.innerHTML	= lText.optionPanel.label.updateInterval;

		// Array for update interval values and names.
		var opts = new Array();
		opts['value']	= new Array(3600, 43200, 86400, 259200, 604800, 1209600, 2419200);
		var interval	= lText.optionPanel.updateIntervals;
		opts['name']	= new Array(interval.hour, interval.hour12, interval.day, interval.day3, interval.week, interval.week2, interval.week4);
		
		// Create the update interval select.
		General.addSelect(tr1.lastChild, 'updateInterval', GM_getValue('updater_updateInterval', 3600), opts, 4);
		
		// Prepare the table row.
		tr2.firstChild.classList.add('center');
		
		// Add the link for manual updates.
		var updateLink			= General.addElement('a', null, tr2.firstChild, null);
		updateLink.href			= '#';
		updateLink.innerHTML	= lText.optionPanel.label.manualUpdate1 + scriptInfo.name + lText.optionPanel.label.manualUpdate2;
		updateLink.addEventListener('click', Updater.doManualUpdate, false);

		// Add the button to save the settings.
		OptionPanel.addSaveButton(contentWrapper);
	},
	
	/**
	 * Creates the content of the update part for the mobile version.
	 * 
	 * @param	element	contentWrapper
	 *   The wrapper where the content should be added.
	 */
	createUpdateContentMobile: function(contentWrapper) {
		// Create the header.
		var updateHeader = General.addElement('h3', null, contentWrapper, null);
		updateHeader.innerHTML = lText.optionPanel.update;
		
		// Create the select wrapper.
		var p1				= General.addElement('p', null, contentWrapper, null);
		p1.style.textAlign	= 'center';

		// Create the select label.
		var selectLabel			= General.addElement('label', 'updateLabel', p1, null);
		selectLabel.innerHTML	= lText.optionPanel.label.updateInterval;
		selectLabel.htmlFor		= 'script' + scriptInfo.id + 'updateSelect';
		
		// Create the select field.
		var select	= General.addElement('select', 'updateSelect', p1, null);
		
		// Array for update interval values and names.
		var opts = new Array();
		opts['value']	= new Array(3600, 43200, 86400, 259200, 604800, 1209600, 2419200);
		var interval	= lText.optionPanel.updateIntervals;
		opts['name']	= new Array(interval.hour, interval.hour12, interval.day, interval.day3, interval.week, interval.week2, interval.week4);

		// Create the select options.
		for(var i = 0; i < opts['name'].length; i++) {
			// Create new option.
			var option	= General.addElement('option', null, select, null);
			option.value	= opts['value'][i];
			option.innerHTML	= opts['name'][i];

			// If the option is the actual option, select it.
			if(opts['value'][i] == GM_getValue('updater_updateInterval', 3600)) {
				option.selected	= true;
			}
		}
		
		// Create the update link wrapper.
		var p2				= General.addElement('p', null, contentWrapper, null);
		p2.style.textAlign	= 'center';

		// Add the link for manual updates.
		var updateLink			= General.addElement('a', null, p2, null);
		updateLink.href			= '#';
		updateLink.innerHTML	= lText.optionPanel.label.manualUpdate1 + scriptInfo.name + lText.optionPanel.label.manualUpdate2;
		updateLink.addEventListener('click', Updater.doManualUpdate, false);
	},
	
	/**
	 * Creates the content of the zoom part.
	 * 
	 * @param	element	contentWrapper
	 *   The wrapper where the content should be added.
	 */
	createZoomContent: function(contentWrapper) {
		// Create options table.
		var zoomTable1	= OptionPanel.addOptionsTable(contentWrapper);
		var tr1			= OptionPanel.addOptionsTableRow(zoomTable1, false);
		var tr2			= OptionPanel.addOptionsTableRow(zoomTable1, false);
		var tr3			= OptionPanel.addOptionsTableRow(zoomTable1, false);
		var zoomTable2	= OptionPanel.addOptionsTable(contentWrapper);
		var tr4			= OptionPanel.addOptionsTableRow(zoomTable2, true);
		
		// Array for zoom factor values and names.
		var opts = new Array();
		opts['value']	= new Array(50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150);
		opts['name']	= new Array('50%', '60%', '70%', '80%', '90%', '100%', '110%', '120%', '130%', '140%', '150%');
		
		// Create label for zoom world.
		var zoomWorldLabel			= General.addElement('span', null, tr1.firstChild, null);
		zoomWorldLabel.innerHTML	= lText.optionPanel.label.zoom.world;

		// Create the zoom world select.
		General.addSelect(tr1.lastChild, 'zoomWorld', GM_getValue('zoom_worldFactor', 100), opts, 4);

		// Create label for zoom island.
		var zoomIslandLabel			= General.addElement('span', null, tr2.firstChild, null);
		zoomIslandLabel.innerHTML	= lText.optionPanel.label.zoom.island;

		// Create the zoom island select.
		General.addSelect(tr2.lastChild, 'zoomIsland', GM_getValue('zoom_islandFactor', 100), opts, 4);

		// Create label for zoom town.
		var zoomTownLabel		= General.addElement('span', null, tr3.firstChild, null);
		zoomTownLabel.innerHTML	= lText.optionPanel.label.zoom.town;

		// Create the zoom town select.
		General.addSelect(tr3.lastChild, 'zoomTown', GM_getValue('zoom_townFactor', 100), opts, 4);
		
		// Add class for checkbox.
		tr4.firstChild.classList.add('left');

		// Create checkbox.
		General.addCheckbox(tr4.firstChild, 'scaleChildren', GM_getValue('zoom_scaleChildren', true), lText.optionPanel.label.scaleChildren);
		
		// Add the button to save the settings.
		OptionPanel.addSaveButton(contentWrapper);
	},
	
	/**
	 * Adds a new options table.
	 * 
	 * @param	element	wrapper
	 *   The wrapper where the table should be added.
	 * 
	 * @return	element
	 *   The body of the new table.
	 */
	addOptionsTable: function(wrapper) {
		// Create table and tablebody.
		var table	= General.addElement('table', 'moduleContent', wrapper, null);
		var tableBody	= General.addElement('tbody', null, table, null);

		// Add classes.
		table.classList.add('table01');
		
		// Return the table body.
		return tableBody;
	},
	
	/**
	 * Adds a new table row to a options table.
	 * 
	 * @param	element	optionsTableBody
	 *   The table body where the table should be added.
	 * @param	boolean	oneCell
	 *   Decides if there is one cell or there are two cells.
	 * 
	 * @return	element
	 *   The new table row.
	 */
	addOptionsTableRow: function(optionsTableBody, oneCell) {
		// Create the new table row.
		var tr	= General.addElement('tr', null, optionsTableBody, null);

		// Create first cell.
		var td1	= General.addElement('td', null, tr, null);

		// If just ond cell.
		if(oneCell) {
			// Set width of cell to width of two cells.
			td1.colSpan = 2;
			
		// Otherwise.
		} else {
			// Create second cell.
			var td2	= General.addElement('td', null, tr, null);
			
			// Add class.
			td2.classList.add('left');
		}

		// Return the table row.
		return tr;
	},
	
	/**
	 * Creates a commit Button and adds it to a parent.
	 * 
	 * @param	element	parent
	 *   The parent element.
	 * @return	element
	 *   The save button.
	 */
	addSaveButton: function(parent) {
		// Create the button wrapper.
		var buttonWrapper		= General.addElement('div', null, parent, null);
		buttonWrapper.className	= 'centerButton';
		
		// Create the button.
		var saveButton			= General.addElement('input', null, buttonWrapper, null);
		saveButton.type			= 'submit';
		saveButton.className	= 'button';
		saveButton.value		= lText.optionPanel.save;
		
		// Add a click action to the button.
		saveButton.addEventListener('click', OptionPanel.saveSettings, false);
		
		return saveButton;
	},
	
	/**
	 * Creates a commit Button and adds it to a parent (mobile).
	 * 
	 * @param	element	parent
	 *   The parent element.
	 */
	addSaveButtonMobile: function(parent) {
		// Create the save button.
		var saveButton	= OptionPanel.addSaveButton(parent);
		
		// Remove the old event listener.
		saveButton.removeEventListener('click', OptionPanel.saveSettings, false);
		
		// Add new event listener.
		saveButton.addEventListener('click', OptionPanel.saveSettingsMobile, false);
	},
	
	/**
	 * Save the settings.
	 */
	saveSettings: function() {
		// Save the module settings.
		GM_setValue('module_updateActive', General.$('script' + scriptInfo.id + 'updateCbInvisible').checked);
		GM_setValue('module_incomeActive', General.$('script' + scriptInfo.id + 'incomeOnTopCbInvisible').checked);
		GM_setValue('module_zoomActive', General.$('script' + scriptInfo.id + 'zoomCbInvisible').checked);
		GM_setValue('module_lcMoveActive', General.$('script' + scriptInfo.id + 'loadingCircleMoveCbInvisible').checked);
		GM_setValue('module_ttAutoActive', General.$('script' + scriptInfo.id + 'tooltipsAutoCbInvisible').checked);
		
		// Save the update settings.
		GM_setValue('updater_updateInterval', parseInt(General.$('script' + scriptInfo.id + 'updateIntervalSelectHiddenField').value));
		
		// Save the zoom function settings.
		GM_setValue('zoom_worldFactor', parseInt(General.$('script' + scriptInfo.id + 'zoomWorldSelectHiddenField').value));
		GM_setValue('zoom_islandFactor', parseInt(General.$('script' + scriptInfo.id + 'zoomIslandSelectHiddenField').value));
		GM_setValue('zoom_townFactor', parseInt(General.$('script' + scriptInfo.id + 'zoomTownSelectHiddenField').value));
		GM_setValue('zoom_scaleChildren', General.$('script' + scriptInfo.id + 'scaleChildrenCbInvisible').checked);

		// Show success hint.
		General.showHint('confirm', lText.general.successful, 5);
	},
	
	/**
	 * Save the settings (mobile).
	 */
	saveSettingsMobile: function() {
		// Save the module settings.
		GM_setValue('module_updateActive', General.$('script' + scriptInfo.id + 'updateCb').checked);
		GM_setValue('module_incomeActive', General.$('script' + scriptInfo.id + 'incomeOnTopCb').checked);
		
		// Save the update settings.
		var select = General.$('script' + scriptInfo.id + 'updateSelect');
		GM_setValue('updater_updateInterval', parseInt(select.options[select.selectedIndex].value));
		
		// Show success hint.
		General.$('script' + scriptInfo.id + 'saveHint').innerHTML	= lText.optionPanel.successful;

		// Delete the hint after 3 seconds.
		setTimeout(OptionPanel.deleteSaveHintMobile, 3000);
	},
	
	/**
	 * Delete the save hint.
	 */
	deleteSaveHintMobile: function() {
		General.$('script' + scriptInfo.id + 'saveHint').innerHTML	= '';
	},
};

/**
 * Functions for zooming mobile, desktop and town view.
 */
ZoomFunction = {
	/**
	 * Inits the zooming.
	 */
	init: function() {
		// Get the id of the body.
		var view = document.body.id;
		
		// Get the name of the view depending on the bodies id.
		switch(view) {
			case 'worldmap_iso':
				view = 'world';
			  break;
			
			case 'island':
				view = 'island';
			  break;
			
			case 'city':
				view = 'town';
			  break;
			
			default:
				return;
			  break;
		}
		
		// Get the zooming factor.
		var factor = GM_getValue('zoom_' + view + 'Factor', 100);
		
		// If the factor is 100% return.
		if(factor == 100) {
			return;
		}
		
		// Get the factor as normal number, not as percentage.
		factor /= 100.0;
		
		// Zoom.
		ZoomFunction.zoom(factor);

		// Center the view.
		setTimeout(function() { ZoomFunction.center(factor, view) }, 1000);

		// Scale child elements which should be scaled if enabled.
		if(GM_getValue('zoom_scaleChildren', true))	setTimeout(function() { ZoomFunction.scaleChildren(factor, view) }, 0);
	},
	
	/**
	 * Scales the children which should be scaled.
	 * 
	 * @param	float	factor
	 *   The factor which is used.
	 */
	zoom: function(factor) {
		// Get the factor the scrollcover must be moved.
		var translateXY	= (100 - 100 / factor) / 2;

		// Get the new height and width of the scrollcover.
		var heightWidth	= 100 / factor;
		
		// Add the new style.
		GM_addStyle(
				"#scrollcover { -moz-transform: scale(" + factor + ") translate(" + translateXY + "%, " + translateXY + "%) !important; -webkit-transform: scale(" + factor + ") translate(" + translateXY + "%, " + translateXY + "%) !important; height: " + heightWidth + "% !important; width: " + heightWidth + "% !important; }"
			);
	},
	
	center: function(factor, view) {
		// Get the worldmap.
		var worldmap	= General.$('worldmap');
		
		// If the view is world we need to refactor the first child of the worldmap.
		if(view == 'world') {
			worldmap = General.$('map1');;
		}
		
		// Decide what to do depending on the actual view.
		switch(view) {
			case 'world':
				// Set the new offset.
				newWmTop		= 0;
				newWmLeft		= 0;
			  break;
			
			case 'island':
				// Get the window height and width.
				var windowHeight	= unsafeWindow.innerHeight;
				var windowWidth		= unsafeWindow.innerWidth;
				
				// Get the position to center.
				var islandView	= General.$('cities');
				var posY		= islandView.offsetHeight / 2;
				var posX		= islandView.offsetWidth / 2 - islandView.offsetLeft;
				
				// Calculate the new offset.
				newWmTop		= windowHeight / (2 * factor) - posY;
				newWmLeft		= windowWidth / (4 * factor * factor) - posX;
				
				// If the new offset is out of range, set it to null.
				newWmTop		= newWmTop < 0 ? newWmTop : 0;
				newWmLeft		= newWmLeft < 0 ? newWmLeft : 0;
			  break;
			
			case 'town':
				// Get the window height and width.
				var windowHeight	= unsafeWindow.innerHeight;
				var windowWidth		= unsafeWindow.innerWidth;
				
				// Get the position to center.
				var townHall	= General.$('position0');
				var posY		= townHall.offsetTop;
				var posX		= townHall.offsetLeft;

				// Calculate the new offset.
				newWmTop		= windowHeight / (2 * factor) - posY;
				newWmLeft		= windowWidth / (4 * factor * factor) - posX;
				
				// If the new offset is out of range, set it to null.
				newWmTop		= newWmTop < 0 ? newWmTop : 0;
				newWmLeft		= newWmLeft < 0 ? newWmLeft : 0;
			  break;
			
			default:
				return;
			  break;
		}
		
		// Apply the new offset to the worldmap.
		worldmap.style.top	= newWmTop + 'px';
		worldmap.style.left	= newWmLeft + 'px';
	},
	
	/**
	 * Scales the children of the worldmap.
	 * 
	 * @param	float	factor
	 *   The factor which is used.
	 * @param	String	view
	 *   The name of the view.
	 */
	scaleChildren: function(factor, view) {
		// Which view is used?
		switch(view) {
			// Worldview.
			case 'world':
				GM_addStyle(".wonder, .tradegood, .cities, .ownerstate	{ -moz-transform: scale(" + 1 / factor + "); -webkit-transform: scale(" + 1 / factor + "); } \
							 .cities									{ bottom: 10px !important; }");
			  break;
			
			// Island view.
			case 'island':
				GM_addStyle(".scroll_img	{ -moz-transform: scale(" + 1 / factor + "); -webkit-transform: scale(" + 1 / factor + "); }");
			  break;
			
			// default do nothing.
			default:
				return;
			  break;
		}
	},
};

/**
 * Functions for updater.
 */
Updater = {
	/**
	 * Stores if the update was instructed by the user.
	 */
	manualUpdate: null,

	/**
	 * Inits the Updater.
	 */
	init: function() {
		// Get the difference between now and the last check.
		var lastCheck	= GM_getValue('updater_lastUpdateCheck', 0);
		var now			= new Date();
		var millis		= now.getTime();
		var diff		= millis - lastCheck;
		
		// If the module is active and the last update is enough time before, check for updates.
		if(GM_getValue('module_updateActive', true) && diff > GM_getValue('updater_updateInterval', 3600) * 1000) {
			// No manual Update.
			Updater.manualUpdate = false;

			// Check for Updates.
			Updater.checkForUpdates();
			
			// Set the time for the last update check to now.
			GM_setValue('updater_lastUpdateCheck', millis + '');
		}
	},
	
	/**
	 * Search manually for updates.
	 */
	doManualUpdate: function() {
		// No manual Update.
		Updater.manualUpdate = true;

		// Check for Updates.
		Updater.checkForUpdates();
		
		// Set the time for the last update check to now.
		var now			= new Date();
		var millis		= now.getTime();
		GM_setValue('updater_lastUpdateCheck', millis + '');
	},

	/**
	 * Checks for updates for the Script.
	 * 
	 * @return	boolean
	 *   If there is a newer version.
	 */
	checkForUpdates: function() {
		// Send a request to the userscripts.org server to get the metadata of the script to check if there is a new Update.
		GM_xmlhttpRequest ({
			method: 'GET',
			url: 'http://userscripts.org/scripts/source/' + scriptInfo.id + '.meta.js',
			headers: {'User-agent': 'Mozilla/5.0', 'Accept': 'text/html'},
			onload: function(response) {
				// Extract the metadata from the response.
				var metadata = Updater.formatMetadata(response.responseText);
				
				// If the installed script version is smaller than the metadata script version (= new update available).
				if(scriptInfo.version < metadata.version) {
					// Show updata dialogue.
					Updater.showUpdateInfo(metadata);

				// If there is no new update and it was a manual update show hint.
				} else if(Updater.manualUpdate)	{
					General.showHint('error', lText.update.noNewExist, 5);
				}
			}
		});
	},
	
	/**
	 * Shows the update information panel.
	 * 
	 * @param	mixed[]	metadata
	 *   Array with formated metadata
	 */
	showUpdateInfo: function(metadata) {
		// Get the update history.
		var updateHistory = Updater.extractUpdateHistory(metadata);
		
		// Set the Updater styles.
		Updater.setStyles();
		
		// Create the background and the container.
		var updateBackground		= General.addElement('div', 'updateBackground', document.body, null);
		var updatePanelContainer	= General.addElement('div', 'updatePanelContainer', document.body, null);
		var updatePanel				= General.addElement('div', 'updatePanel', updatePanelContainer, null);
		
		// Create the update panel header.
		var updatePanelHeader		= General.addElement('div', 'updatePanelHeader', updatePanel, null);
		var updatePanelHeaderL		= General.addElement('div', 'updatePanelHeaderL', updatePanelHeader, null);
		var updatePanelHeaderR		= General.addElement('div', 'updatePanelHeaderR', updatePanelHeaderL, null);
		var updatePanelHeaderM		= General.addElement('p',	'updatePanelHeaderM', updatePanelHeaderR, null);
		
		// Create the update panel body.
		var updatePanelBody			= General.addElement('div', 'updatePanelBody', updatePanel, null);
		var updatePanelBodyL		= General.addElement('div', 'updatePanelBodyL', updatePanelBody, null);
		var updatePanelBodyR		= General.addElement('div', 'updatePanelBodyR', updatePanelBodyL, null);
		var updatePanelBodyM		= General.addElement('div', 'updatePanelBodyM', updatePanelBodyR, null);
		var updatePanelBodyMTop		= General.addElement('p',	'updatePanelBodyMTop', updatePanelBodyM, null);
		var updatePanelBodyMBottom	= General.addElement('div', 'updatePanelBodyMBottom', updatePanelBodyM, null);
		
		// Create the update panel footer.
		var updatePanelFooter		= General.addElement('div', 'updatePanelFooter', updatePanel, null);
		var updatePanelFooterL		= General.addElement('div', 'updatePanelFooterL', updatePanelFooter, null);
		var updatePanelFooterR		= General.addElement('div', 'updatePanelFooterR', updatePanelFooterL, null);
		var updatePanelFooterM		= General.addElement('div', 'updatePanelFooterM', updatePanelFooterR, null);
		
		// Create the install button.
		var updatePanelInstall		= General.addElement('input', 'updatePanelInstall', updatePanel, null);
		updatePanelInstall.type		= 'button';
		updatePanelInstall.value	= lText.update.install;
		
		// Create the close button.
		var updatePanelCB			= General.addElement('input', 'updatePanelCB', updatePanel, null);
		updatePanelCB.type			= 'button';
		updatePanelCB.value			= lText.update.close;
		
		// Insert the texts into header, body and footer.
		updatePanelHeaderM.innerHTML		= lText.update.header + '<span><a><img id="script' + scriptInfo.id + 'updatePanelClose" src="skin/layout/notes_close.png"></a></span>';
		updatePanelBodyMTop.innerHTML		= lText.update.text1 + '<a href="http://userscripts.org/scripts/show/' + scriptInfo.id + '" target="_blank" >' + scriptInfo.name + '</a>' + lText.update.text2 + '.<br>' + lText.update.text3 + scriptInfo.version + lText.update.text4 + metadata.version + '.<br>&nbsp;&nbsp;<b><u>' + lText.update.hist + ':</u></b>';
		updatePanelBodyMBottom.innerHTML	= Updater.formatUpdateHistory(updateHistory);
		updatePanelFooterM.innerHTML		= scriptInfo.name + ' v' + scriptInfo.version;
		
		// Add event listener to the buttons to close / install.
		General.$('script' + scriptInfo.id + 'updatePanelClose').addEventListener('click', Updater.closeUpdatePanel, false);
		updatePanelInstall.addEventListener('click', Updater.installScript, false);
		updatePanelCB.addEventListener('click', Updater.closeUpdatePanel, false);
	},
	
	/**
	 * Sets the styles that are used for the update panel.
	 */
	setStyles: function() {
		// Add all update styles to the ikariam page.
		GM_addStyle(
				"#script" + scriptInfo.id + "updateBackground			{ z-index: 1000000000000; position: fixed; visibility: visible; top: 0px; left: 0px; width: 100%; height: 100%; padding: 0; background-color: #000; opacity: .7; } \
				 #script" + scriptInfo.id + "updatePanelContainer		{ z-index: 1000000000001; position: fixed; visibility: visible; top: 100px; left: 50%; width: 500px; height: 370px; margin-left: -250px; padding: 0; text-align: left; color: #542C0F; font: 12px Arial,Helvetica,sans-serif; } \
				 #script" + scriptInfo.id + "updatePanel				{ position: relative; top: 0px; left: 0px; background-color: transparent; border: 0 none; overflow: hidden; } \
				 #script" + scriptInfo.id + "updatePanelHeader			{ height: 39px; background: none repeat scroll 0 0 transparent; font-weight: bold; line-height: 2; white-space: nowrap; } \
				 #script" + scriptInfo.id + "updatePanelHeaderL			{ height: 39px; background-image: url('skin/layout/notes_top_left.png'); background-position: left top; background-repeat: no-repeat; } \
				 #script" + scriptInfo.id + "updatePanelHeaderR			{ height: 39px; background-image: url('skin/layout/notes_top_right.png'); background-position: right top; background-repeat: no-repeat; } \
				 #script" + scriptInfo.id + "updatePanelHeaderM			{ height: 39px; margin: 0 14px 0 38px; padding: 12px 0 0; background-image: url('skin/layout/notes_top.png'); background-position: left top; background-repeat: repeat-x; color: #811709; line-height: 1.34em; } \
				 #script" + scriptInfo.id + "updatePanelHeaderM span	{ text-align: right; display: block; margin: -15px 0 0; } \
				 #script" + scriptInfo.id + "updatePanelBody			{ height: 311px; background: none repeat scroll 0 0 transparent; } \
				 #script" + scriptInfo.id + "updatePanelBodyL			{ height: 100%; background-image: url('skin/layout/notes_left.png'); background-position: left top; background-repeat: repeat-y; } \
				 #script" + scriptInfo.id + "updatePanelBodyR			{ height: 100%; background-image: url('skin/layout/notes_right.png'); background-position: right top; background-repeat: repeat-y; } \
				 #script" + scriptInfo.id + "updatePanelBodyM			{ height: 100%; background-color: #F7E7C5; background-image: none;  margin: 0 6px; padding: 0 10px; font-size: 14px; } \
				 #script" + scriptInfo.id + "updatePanelBodyMTop		{ height: 100px; line-height: 2; } \
				 #script" + scriptInfo.id + "updatePanelBodyMTop b		{ line-height: 3.5; font-size:110%; } \
				 #script" + scriptInfo.id + "updatePanelBodyM a			{ color: #811709; font-weight: bold; } \
				 #script" + scriptInfo.id + "updatePanelBodyMBottom		{ height: 170px; padding: 10px; background: url('skin/input/textfield.png') repeat-x scroll 0 0 #FFF7E1; border: 1px dotted #C0C0C0; font: 14px Arial,Helvetica,sans-serif; color: #000000; border-collapse: separate; overflow-y:auto; } \
				 #script" + scriptInfo.id + "updatePanelBodyMBottom h2	{ font-weight: bold; } \
				 .script" + scriptInfo.id + "updateTable				{ border-collapse: separate; border-spacing: 2px; } \
				 .script" + scriptInfo.id + "updateDataType				{ width: 100px; padding: 5px 0px 5px 5px; border: 1px solid #D2A860; } \
				 .script" + scriptInfo.id + "updateDataInfo				{ width: 300px; padding: 5px 5px 5px 20px; border: 1px solid #D2A860; } \
				 .script" + scriptInfo.id + "updateDataInfo ul li		{ list-style: disc outside none; } \
				 #script" + scriptInfo.id + "updatePanelFooter			{ height: 20px; background: none repeat scroll 0 0 transparent; } \
				 #script" + scriptInfo.id + "updatePanelFooterL			{ height: 100%; background-image: url('skin/layout/notes_left.png'); background-position: left top; background-repeat: repeat-y; border: 0 none; } \
				 #script" + scriptInfo.id + "updatePanelFooterR			{ height: 21px; background-image: url('skin/layout/notes_br.png'); background-position: right bottom; background-repeat: no-repeat; } \
				 #script" + scriptInfo.id + "updatePanelFooterM			{ background-color: #F7E7C5; border-bottom: 3px solid #D2A860; border-left: 2px solid #D2A860; margin: 0 23px 0 3px; padding: 5px 0 0; font-size: 77%; } \
				 #script" + scriptInfo.id + "updatePanelClose			{ cursor: pointer } \
				 #script" + scriptInfo.id + "updatePanelInstall			{ background: url('skin/input/button.png') repeat-x scroll 0 0 #ECCF8E; bottom: -4px; position: absolute; border-color: #C9A584 #5D4C2F #5D4C2F #C9A584; border-style: double; border-width: 3px; cursor: pointer; display: inline; font-weight: bold; margin: 10px auto; padding: 2px 10px; text-align: center; font-size: 12px; left: 50%; margin-left: -105px; width: 100px; } \
				 #script" + scriptInfo.id + "updatePanelInstall:hover	{ color: #FFFFFF; text-decoration: none; } \
				 #script" + scriptInfo.id + "updatePanelInstall:active	{ border-color: #5D4C2F #C9A584 #C9A584 #5D4C2F; border-style: double; border-width: 3px; padding: 3px 10px 1px; } \
				 #script" + scriptInfo.id + "updatePanelCB				{ background: url('skin/input/button.png') repeat-x scroll 0 0 #ECCF8E; bottom: -4px; position: absolute; border-color: #C9A584 #5D4C2F #5D4C2F #C9A584; border-style: double; border-width: 3px; cursor: pointer; display: inline; font-weight: bold; margin: 10px auto; padding: 2px 10px; text-align: center; font-size: 12px; left: 50%; margin-left: 5px; width: 100px; } \
				 #script" + scriptInfo.id + "updatePanelCB:hover		{ color: #FFFFFF; text-decoration: none; } \
				 #script" + scriptInfo.id + "updatePanelCB:active		{ border-color: #5D4C2F #C9A584 #C9A584 #5D4C2F; border-style: double; border-width: 3px; padding: 3px 10px 1px; }"
			);
	},
	
	/**
	 * Formats the given metadata.
	 * 
	 * @param	String	metadata
	 *   The metadata to format.
	 * @return	String[]
	 *   The formated metadata as array.
	 */
	formatMetadata: function(metadataIn) {
		// Create an array for the formated metadata.
		var metadataOut = new Array();

		// Extract the tags from the metadata.
		var innerMeta = metadataIn.match(/\/\/ ==UserScript==((.|\n|\r)*?)\/\/ ==\/UserScript==/)[0];
		
		// If there are some tags.
		if(innerMeta) {
			// Extract all tags.
			var tags = innerMeta.match(/\/\/ @(.*?)(\n|\r)/g);
			
			// Loop over all tags.
			for(var i = 0; i < tags.length; i++) {
				// Extract the data from the tag.
				var tmp = tags[i].match(/\/\/ @(.*?)\s+(.*)/);
				
				// If there is no data with this tag create a new array to store all data with this tag.
				if(!metadataOut[tmp[1]]) {
					metadataOut[tmp[1]] = new Array(tmp[2]);

				// Otherwise add the data to the existing array.
				} else {
					metadataOut[tmp[1]].push(tmp[2]);
				}
			}
		}
		
		// Return the formated metadata.
		return metadataOut;
	},
	
	/**
	 * Extracts the update history from the metadata.
	 * 
	 * @param	String[]	metadata
	 *   Array with the formated metadata.
	 * @return	mixed[]
	 *   The extracted update history.
	 */
	extractUpdateHistory: function(metadata) {
		// Create variable to store the update history.
		var updateHistory = new Array();
		
		// Loop over all update history data.
		for(var i = 0; i < metadata['history'].length; i++) {
			// Get the information from the update history data.
			var tmp = metadata['history'][i].match(/^(\S+)\s+(\S+)\s+(.*)$/);
			
			// If there is no array for this version create one.
			if(!updateHistory[tmp[1]]) {
				updateHistory[tmp[1]] = new Array();
			}
			
			// If it is a feature store it to feature in this version.
			if(tmp[2] == 'Feature:') {
				if(!updateHistory[tmp[1]]['feature']) {
					updateHistory[tmp[1]]['feature'] = new Array(tmp[3]);
				} else {
					updateHistory[tmp[1]]['feature'].push(tmp[3]);
				}

			// If it is a bugfix store it to bugfix in this version.
			} else if(tmp[2] == 'Bugfix:') {
				if(!updateHistory[tmp[1]]['bugfix']) {
					updateHistory[tmp[1]]['bugfix'] = new Array(tmp[3]);
				} else {
					updateHistory[tmp[1]]['bugfix'].push(tmp[3]);
				}
			
			// Otherwise store it to other in this version.
			} else {
				if(!updateHistory[tmp[1]]['other']) {
					updateHistory[tmp[1]]['other'] = new Array(tmp[2] + " " + tmp[3]);
				} else {
					updateHistory[tmp[1]]['other'].push(tmp[2] + " " + tmp[3]);
				}
			}
		}
		
		// Return the update history.
		return updateHistory;
	},
	
	/**
	 * Formats the update history.
	 * 
	 * @param	mixed[]	updateHistory
	 *   The update history.
	 * @return	String
	 *   The formated update history.
	 */
	formatUpdateHistory: function(updateHistory) {
		// Get the labels for the types.
		var types = { feature: lText.update.feature,	bugfix: lText.update.bugfix,	other: '' };

		// Create a var for the formated update history.
		var formatedUpdateHistory = '';
		
		// Loop over all versions.
		for(var version in updateHistory) {
			// Create a headline for each version and start a table.
			formatedUpdateHistory += '<h2>v ' + version + '</h2><br><table class="script' + scriptInfo.id + 'updateTable"><tbody>';
			
			// Loop over all types.
			for(var type in updateHistory[version]) {
				// Create a table row for each type and start a list for the elements.
				formatedUpdateHistory += '<tr><td class="script' + scriptInfo.id + 'updateDataType">' + types[type] + '</td><td class="script' + scriptInfo.id + 'updateDataInfo"><ul>';
				
				// Loop over the elements and add them to the list.
				for(var i = 0 ; i < updateHistory[version][type].length; i++) {
					formatedUpdateHistory += '<li>' + updateHistory[version][type][i] + '</li>';
				}
				
				// End the list.
				formatedUpdateHistory += '</ul></td></tr>';
			}
			
			// End the table.
			formatedUpdateHistory += '</tbody></table><br>';
		}
		
		// Return the formated update history.
		return formatedUpdateHistory;
	},
	
	/**
	 * Opens the install dialogue and closes the update panel.
	 */
	installScript: function() {
		// Close the update panel.
		Updater.closeUpdatePanel();
		// Open the install dialogue
		top.location.href = 'http://userscripts.org/scripts/source/' + scriptInfo.id + '.user.js';
	},
	
	/**
	 * Removes everything of the updater from the website.
	 */
	closeUpdatePanel: function() {
		// Remove the update background.
		document.body.removeChild(General.$('script' + scriptInfo.id + 'updateBackground'));
		// Remove the update panel.
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
	 * @return	String
	 *   The country code.
	 */
	getLang: function() {
		// Split the host string.
		var lang = top.location.host.split('.');
		
		// Return the country code if it exists.
		return (lang ? lang[1] : false) || 'en';
	},
	
	/**
	 * Returns the name of the current language.
	 * 
	 * @return	String
	 *   The name of the language.
	 */
	getLanguageName: function() {
		// Languages which are already implemented.
		var implemented = new Array('english', 'german');
		
		// All languages.
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
		
		// Loof up if implemented contains the language.
		for(var i = 0; i < implemented.length; i++) {
			// If the language is implemented return the name of it.
			if(implemented[i] == languageName) {
				return languageName;
			}
		}
		
		// If the language is not implemented return english.
		return 'english';
	},
	
	/*
	 * Returns the text for the Script.
	 * 
	 * @return	mixed[]
	 *   The script text.
	 */
	getText: function() {
		var text = {
			// English text.
			'english': {
				settings: {
					kiloSep:	',',
					decSep:		'.',
					left2right:	true,
				},
				general: {
					successful:	'Your order has been carried out.',
					error:		'There was an error in your request.',
				},
				income: {
					perHour:	'Income per hour',
					perDay:		'Income per day',
				},
				optionPanel: {
					scripts:	'Scripts',
					update:		'Update',
					module:		'Modules',
					zoom:		'Zoom function',
					save:		'Save settings!',
					label: {
						updateActive:		'Search for updates automatically',
						incomeOnTopActive:	'Show income on top in bilance view',
						zoomActive:			'Activate zoom in world view, island view, town view',
						lcMoveActive:		'Move loading circle to position bar',
						tooltipsAutoActive:	'Show tooltips in alliance mebers view and military advisor automatically',
						updateInterval:		'Interval to search for updates:',
						manualUpdate1:		'Search for updates for "',
						manualUpdate2:		'"!',
						zoom: {
							world:	'Zoom world view:',
							island:	'Zoom island view:',
							town:	'Zoom town view:',
						},
						scaleChildren:		'Let banners and symbols in normal size when zooming world view or island view',
					},
					updateIntervals: {
						hour:	'1 hour',
						hour12:	'12 hours',
						day:	'1 day',
						day3:	'3 days',
						week:	'1 week',
						week2:	'2 weeks',
						week4:	'4 weeks',
					},
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
					noNewExist:	'There is no new version available!',
				},
			},
			// German text.
			'german': {
				settings: {
					kiloSep:	'.',
					decSep:		',',
					left2right:	true,
				},
				general: {
					successful:	'Dein Befehl wurde ausgeführt.',
					error:		'Es gab einen Fehler in deiner Anfrage!',
				},
				income: {
					perHour:	'Einkommen pro Stunde',
					perDay:		'Einkommen pro Tag',
				},
				optionPanel: {
					scripts:	'Scripte',
					update:		'Aktualisierungen',
					module:		'Module',
					zoom:		'Zoom Funktion',
					save:		'Einstellungen speichern!',
					label: {
						updateActive:		'Automatisch nach Updates suchen',
						incomeOnTopActive:	'Einkommen in der Bilanz auch oben anzeigen',
						zoomActive:			'Zoomen in Weltansicht, Inselansicht und Stadtansicht aktivieren',
						lcMoveActive:		'Ladekreis in Positionsleiste verschieben',
						tooltipsAutoActive:	'Tooltips in Allianzmitgliederliste und Milit&auml;rberater automatisch anzeigen',
						updateInterval:		'In folgenden Zeitabst&auml;nden nach Updates suchen:',
						manualUpdate1:		'Nach Updates f&uuml;r "',
						manualUpdate2:		'" suchen!',
						zoom: {
							world:	'Zoom in der Weltkarte:',
							island:	'Zoom in der Inselansicht:',
							town:	'Zoom in der Stadtansicht:',
						},
						scaleChildren:		'Beschriftungen und Hinweissymbole beim Zoomen in der Weltkarte und Inselansicht in Normalgr&ouml;&szlig;e belassen',
					},
					updateIntervals: {
						hour:	'1 Stunde',
						hour12:	'12 Stunden',
						day:	'1 Tag',
						day3:	'3 Tage',
						week:	'1 Woche',
						week2:	'2 Wochen',
						week4:	'4 Wochen',
					},
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
					close:		'Schließen',
					noNewExist:	'Keine neue Version verfügbar!',
				},
			},
		}[Language.getLanguageName()];
		
		// Return the text.
		return text;
	},
};

// Set the texts wich are shown on the page.
lText = Language.getText();

/**
 * The main function of the script.
 */
function main() {
	// Set the general styles for the script.
	General.setStyles();

	// Call the function to check for updates.
	Updater.init();
	
	// Call the function to enhance the view.
	EnhancedView.init();
}

// Call the main function of the script.
main();