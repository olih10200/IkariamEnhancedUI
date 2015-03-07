// ==UserScript==
// @name			@SCRIPT_NAME@
// @description		@SCRIPT_DESCRIPTION_DEFAULT@
// @namespace		@SCRIPT_NAMESPACE@
// @author			@SCRIPT_AUTHOR_NAME@
// @version			@SCRIPT_VERSION@
// @license			@SCRIPT_LICENSE@
//
// @name:de			@SCRIPT_NAME@
// @description:de	@SCRIPT_DESCRIPTION_DE@
//
// @updateURL		about:blank
// @downloadURL		about:blank
// 
// @include			http://s*.ikariam.gameforge.com/*
// 
// @exclude			http://support.*.ikariam.gameforge.com/*
// 
// @require			@REQUIRE_IKARIAM_CORE@
//
// @RESOURCE_LANGUAGE_INCLUDES@
// 
// @grant			unsafeWindow
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_deleteValue
// @grant			GM_listValues
// @grant			GM_getResourceText
// @grant			GM_xmlhttpRequest
// 
// @bug				Opera & Chrome	Zooming with the mouse is not possible with "Shift" as access key.
// @bug				Opera & Chrome	No updating of the missing resources is possible due to a missing modification listener.
// @bug				All				The selected island is not centered in world view.
// @bug				All				If you are zooming to more than 100%, the view is not centered correctly after a page reload.
// 
// @history			3.0.1	Release: 07.03.2015
// @history			3.0.1	Language: Updated Greek translation.
// @history			3.0.1	Bugfix:	Language key in message options.
// @history			3.0.1	Bugfix: Alliance member data stored at same place for all alliance members.
//
// @history			3.0		Release: 05.03.2015
// @history			3.0		Language: Russian translation added (incomplete).
// @history			3.0		Language: Italian translation added (incomplete).
// @history			3.0		Language: Greek translation added (incomplete).
// @history			3.0		Change: Implementation of Ikariam Core - rewrote the complete code.
// @history			3.0		Change: Cleared the update history to use the Ikariam Core labels.
// @history			3.0		Bugfix:	Diverse graphic errors.
// @history			3.0		Bugfix: Broken in Firefox and Chrome.
//
// @history			2.6		Release: 12.10.2014
// @history			2.6		Bugfix: Script options were broken.
// 
// @history			2.6		Release: 19.08.2014
// @history			2.5		Bugfix: Game language is recognized again.
// @history			2.5		Bugfix: Works now in Greasemonkey 2.0+
// @history			2.5		Change: Checks now for updates on Greasy Fork.
// @history			2.5		Removed code parts for mobile version.
// @history			2.5		Removed alliance page improvement, as fixed in Ikariam v0.5.13
// 
// @history			2.6		Release: 11.09.2013
// @history			2.4		Bugfix: New Ikariam domain -> script can now be used with this domain
// 
// @history			2.3		Release: 12.04.2013
// @history			2.3		Feature: Formatting troop lists for posting in forums / personal messages.
// @history			2.3		Feature: Filling level of warehouse as bar in town view.
// @history			2.3		Feature: Link to mines / town hall when clicking on resources / citizens.
// @history			2.3		Change: New versioning system.
// @history			2.3		Bugfix: Some characters in links were not decoded correctly.
// @history			2.3		Bugfix: Watching a foreign city causes a abortion of the script.
// @history			2.3		Bugfix: The city dropdown sometimes was zoomed in world view.
// @history			2.3		Bugfix: Removed obsolete CSS styles for Firefox.
// @history			2.3		Adjustments in the language files.
// @history			2.3		Violent Monkey brings Greasemonkey functions to Opera.
// 
// @history			2.2.1	Release: 11.10.2012
// @history			2.2.1	Feature: Smaller icons in direct military tooltip.
// @history			2.2.1	Bugfix: Problems with update check and version numbers >= 10.
// @history			2.2.1	Bugfix: Problems with another script.
// @history			2.2.1	Bugfix: Problems with a wrong style in island view.
// 
// @history			2.2		Release: 10.10.2012
// @history			2.2		Feature: Message signature can be set.
// @history			2.2		Feature: Button for faster sending of circular messages.
// @history			2.2		Feature: Make links in messages clickable.
// @history			2.2		Feature: Show town information of colonizing cities.
// @history			2.2		Feature: Information about cargo / fleets is displayed directly in military view.
// @history			2.2		Feature: Script options: Sections on the script tab can be folded.
// @history			2.2		Bugfix: Tooltips with mouseover were not clickable anymore.
// @history			2.2		Changes in code for better overview.
// 
// @history			2.1.1	Release: 01.10.2012
// @history			2.1.1	Feature: Different styles for income in town view.
// @history			2.1.1	Feature: Remaining resources after upgrade.
// @history			2.1.1	Feature: Improved style for external alliance pages.
// @history			2.1.1	Feature: Refresh the missing / remaining resources in construction view automatically.
// 
// @history			2.1		Release: 23.09.2012
// @history			2.1		Feature: Show the missing resources in construction view.
// @history			2.1		Feature: Show the hourly income directly in town view and add the daily production as popup.
// @history			2.1		Feature: Don't center town information in the town advisor.
// @history			2.1		Feature: Save the highscore data of alliance members and compare it with the actual value.
// @history			2.1		Bugfix: There was an error with a missing language package and seperators.
// @history			2.1		Bugfix: Some things in worldview were not resized correctly.
// @history			2.1		Prevent more than one script execution.
// @history			2.1		Prevent more than one script option panel (the script option panel now is usable for other scripts, too).
// 
// @history			2.0.1	Release: 27.08.2012
// @history			2.0.1	Bugfix: Zooming was broken.
// @history			2.0.1	Bugfix: Dropdown menus created by the script were broken.
// @history			2.0.1	Bugfix: Tooltips in in Alliance / Military view were not shown correctly.
// 
// @history			2.0		Release: 18.07.2012
// @history			2.0		Language: Latvian translation
// @history			2.0		Feature: Cross-browser compatibility.
// @history			2.0		Feature: Possibility to hide the update hint for a new script version.
// @history			2.0		Bugfix: Resizing the owner state in world view was broken.
// @history			2.0		Some changes in the code for easier copying of functions which should be used by more than one script.
// 
// @history			1.7		Release: 12.06.2012
// @history			1.7		Feature: Resizing banners when zooming is possible in city view, too.
// @history			1.7		Feature: The zoom buttons are available in world view, too.
// @history			1.7		Feature: Zooming with the mouse scroll is possible again (now with key, standard is ctrl).
// @history			1.7		Change: Changes in the option panel due to the new zooming function features.
// @history			1.7		Bugfix: If resizing is enabled, zooming with the buttons will resize the banners, too.
// @history			1.7		Bugfix: The chat will not cause to much executions of script functions.
// @history			1.7		The language texts are integrated as resources, so that there is shorter code.
// @history			1.7		Replace the GM_* functions by myGM.* to expand them easy and add new.
// 
// @history			1.6		Release: 05.06.2012
// @history			1.6		Feature: Possibility to hide only the bird swarm animation.
// @history			1.6		Feature: Easier upkeep reduction table.
// @history			1.6		Feature: Enhanced zoom function using the Ikariam zoom function.
// @history			1.6		Due to the use of Ikariam functions the code could be reduced.
// @history			1.6		Code enhancements for shorter code.
// 
// @history			1.5.1.1	Release: 25.05.2012
// @history			1.5.1.1	Bugfix: Not all occurrences of hidden were changed.
// 
// @history			1.5.1	Release: 24.05.2012
// @history			1.5.1	Bugfix: Name of a class (hidden) is used by GF.
// 
// @history			1.5		Release: 24.05.2012
// @history			1.5		Feature: Options panel to enable/disable funtions and set settings.
// @history			1.5		Feature: Update interval can be set.
// @history			1.5		Feature: Manually check for updates.
// @history			1.5		Feature: Zoom function without resizing the whole view.
// @history			1.5		Feature: Move loading circle to another position.
// @history			1.5		Feature: Show tooltip in alliance / military view on mouseover.
// @history			1.5		Change: Code better commented. More comments, so that it is easier to understand.
// @history			1.5		Bugfix: Changed *.gif to *.png.
// @history			1.5		Version numbers adjusted.
// 
// @history			1.4.1	Release: 01.05.2012
// @history			1.4.1	Feature: Support for mobile interface.
// @history			1.4.1	Bugfix: Fixed bug with scrollbar in finances view.
// 
// @history			1.4		Release: 20.04.2012
// @history			1.4		Feature: Ready for 0.5.0, but also supports 0.4.5 furthermore.
// @history			1.4		Feature: Implemented support for different languages.
// @history			1.4		Feature: Enhanced script updater.
// @history			1.4		Change: Cleaned up code.
// @history			1.4		Change: Rename the script to "Enhanced UI".
// @history			1.4		Change: Change the namespace to "Tobbe".
// @history			1.4		Because of the change of namespace and name you have to delete the old script manually!
// 
// @history			1.3.3	Release: 11.04.2011
// @history			1.3.3	Bugfix: Problem with negative numbers and 0.4.2.4 fixed.
// 
// @history			1.3.2	Release: 15.01.2011
// @history			1.3.2	Feature: Own script updater.
// @history			1.3.2	Change: Remove everything what refered to other scripts.
// 
// @history			1.3.1	Release: 15.01.2011
// @history			1.3.1	Change: New script updater.
// 
// @history			1.3		Release: 14.01.2011
// @history			1.3		Change: Remove the script updater (Because of the problem with Greasemonkey scripts).
// 
// @history			1.2.1	Release: 28.12.2010
// @history			1.2.1	Change: New style of update panel.
// @history			1.2.1	Bugfix: Bug with ',' as seperator fixed.
// 
// @history			1.2		Release: 09.10.2010
// @history			1.2		Feature: Income in 24h added.
// @history			1.2		Change: Cleaned up code.
// 
// @history			1.1		Release: 13.04.2010
// @history			1.1		Feature: Update check implemented.
// 
// @history			1.0		Release: 12.04.2010
// @history			1.0		Initial release.
// ==/UserScript==

/**
 * Instantiate a new set of enhancement functions.
 * {@link https://greasyfork.org/scripts/4369-enhanced-ui Script on Greasy Fork}
 * {@link https://github.com/tobias-engelmann/IkariamEnhancedUI Script on GitHub}
 * 
 * @version	2.6.0.0.167
 * @author	Tobbe	<contact@ikascripts.de>
 * 
 * @global
 * 
 * @class
 * @classdesc	Enhancements for the user interface of Ikariam.
 * 
 * @param	{IkariamCore}	$
 *   A instance of the Ikariam Core.
 */
function EnhancedUI(IC) {
	/**
	 * Script toolbar.
	 * 
	 * @type	{element}
	 */
	var ge_toolbar = IC.myGM.addElement('div', IC.myGM.$('#GF_toolbar'), { 'id': 'toolbar' }, true, IC.myGM.$('#GF_toolbar ul'));
	
	IC.myGM.addStyle(
		'#GF_toolbar > ul						{ width: auto !important; text-align: center !important; pointer-events: none; } \
		 #GF_toolbar > ul > *					{ pointer-events: auto; } \
		 #GF_toolbar #mmoNewsticker				{ display: inline-block !important; position: relative !important; } \
		 #GF_toolbar #mmoNewsticker > ul		{ width: auto !important; } \
		 #' + IC.myGM.prefix + 'toolbar			{ float: right; } \
		 #' + IC.myGM.prefix + 'toolbar > div	{ display: inline-block; position: relative; float: right; margin: 0px 5px; }',
		'scriptToolbar'
	);
	
	IC.Options.addWrapper('diverseOptions', IC.Language.$('diverse.options.wrapperTitle'));
	
	IC.con.groupCollapsed('IkariamEnhancedUI initalization ...');
	IC.con.timeStamp('IkariamEnhancedUI: toolbar and general styles created');
	
	@ENHANCE_VIEW@
	
	IC.con.timeStamp('IkariamEnhancedUI: view functions created');
	
	@ENHANCE_ISLAND@
	
	IC.con.timeStamp('IkariamEnhancedUI: island functions created');
	
	@ENHANCE_FINANCE@
	
	IC.con.timeStamp('IkariamEnhancedUI: finance functions created');
	
	@ENHANCE_MISSING_RESOURCES@
	
	IC.con.timeStamp('IkariamEnhancedUI: missing resource functions created');
	
	@ENHANCE_TOOLTIPS@
	
	IC.con.timeStamp('IkariamEnhancedUI: tooltip functions created');
	
	@ENHANCE_ZOOM@
	
	IC.con.timeStamp('IkariamEnhancedUI: zoom functions created');
	
	@ENHANCE_RESOURCE_INFORMATION@
	
	IC.con.timeStamp('IkariamEnhancedUI: resource information functions created');
	
	@ENHANCE_HIGHSCORE@
	
	IC.con.timeStamp('IkariamEnhancedUI: highscore functions created');
	
	@ENHANCE_MESSAGES@
	
	IC.con.timeStamp('IkariamEnhancedUI: message functions created');
	
	@ENHANCE_TROOP_INFORMATION@
	
	IC.con.timeStamp('IkariamEnhancedUI: troop information functions created');
	IC.con.groupEnd();
}

/**
 * Main function of the script.<br>
 * Inits the Ikariam Core and calls the script functions.<br>
 * Must be called with <pre>setTimeout(main, 0)</pre> for correct setting of some core variables.
 */
function main() {
	// Get the Ikariam core.
	var IC = new IkariamCore('@SCRIPT_VERSION@', @SCRIPT_ID@, '@SCRIPT_NAME@', '@SCRIPT_AUTHOR_NAME@', @SCRIPT_DEBUG@);
	
	if(IC.myGM.alreadyExecuted === true)
		return;
	
	IC.Language.setDefaultLanguage('en');
	
	IC.Language.addLanguageText('en', @SCRIPT_LANGUAGE_DEFAULT@);
	
	var la_language = @SCRIPT_TRANSLATIONS_ARRAY@;
	for(var i = 0; i < la_language.length; i++) {
		IC.Language.registerLanguageResource(la_language[i], la_language[i], '@RESOURCE_LANGUAGE_URL@/' + la_language[i] + '.json');
	}
	
	// Instantiate the ui script.
	new EnhancedUI(IC);
}

// Call the main function of the script.
setTimeout(main, 0);