// Functions for tooltips.
	(function() {
		/**
		 * Storage for the autoshow tootips functions.
		 * 
		 * @type	{object}
		 */
		var _go_autoshowTooltips = new function() {
			/**
			 * General function for autowhow.
			 * 
			 * @param	{string}	onclickWrapperClass
			 *   The class of the wrapper which has the onclik attribute set.
			 */
			var _lf_autoshowTooltipsGeneral = function(onclickWrapperClass) {
				IC.myGM.$$('.' + onclickWrapperClass).forEach(function(onclickWrapper) {
					var onclickFunction		= onclickWrapper.onclick;
					onclickWrapper.onclick	= 'return false;';
					
					var newHandler = IC.myGM.$('.magnify_icon', onclickWrapper);
					if(!newHandler)
						newHandler = onclickWrapper;
					
					newHandler.addEventListener('mouseover', function(e) { IC.ika.controller.captureMousePosition(e); onclickFunction(e); }, true);
				});
				
				IC.myGM.$('.templateView .mainContent').addEventListener('click', function() { IC.win.$(document).trigger("closeExclusiveInfo"); }, true);
			};
			
			/**
			 * Autmatically show tooltips in alliance member lists.
			 */
			var _lf_doAutoshowTooltipsAlliance = function() {
				_lf_autoshowTooltipsGeneral('cityInfo');
			};
			
			/**
			 * Autmatically show tooltips in military advisor.
			 */
			var _lf_doAutoshowTooltipsMilitaryAdvisor = function() {
				if(IC.Options.getOption('moduleOptions', 'showDirectMilitaryTooltips') === true)
					return;
				
				_lf_autoshowTooltipsGeneral('spyMilitary');
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	autoshowTooltips
			 *   If the user selected the checkbox to autoshow tooltips.
			 */
			this.updateSettings = function(autoshowTooltips) {
				var alliancePopupIds = ['diplomacyAllyMemberlist', 'embassy'];
				
				if(autoshowTooltips === true) {
					IC.RefreshHandler.add('militaryAdvisor', 'autoshowTooltips', _lf_doAutoshowTooltipsMilitaryAdvisor);
					IC.RefreshHandler.add(alliancePopupIds, 'autoshowTooltips', _lf_doAutoshowTooltipsAlliance);
					return;
				}
				
				IC.RefreshHandler.remove('militaryAdvisor', 'autoshowTooltips');
				IC.RefreshHandler.remove(alliancePopupIds, 'autoshowTooltips');
			};
		};
		
		/**
		 * Storage for the direct military tooltip functions.
		 * 
		 * @type	{object}
		 */
		var _go_directMilitaryTooltips = new function() {
			/**
			 * Storage for the class ids and their corresponding translations. Each class is a property of the object with the translation stored in it.
			 * 
			 * @type	{object}
			 */
			var _lo_idTranslation = {};
			
			/**
			 * Fill the id translation object.
			 */
			var _lf_fillIdTranslation = function() {
				if(_lo_idTranslation.length === 0)
					return;
				
				var la_troops		= ['swordsman', 'phalanx', 'archer', 'marksman', 'mortar', 'slinger', 'catapult', 'ram', 'steamgiant', 'bombardier', 'cook', 'medic', 'gyrocopter', 'spearman', 'spartan'];
				var la_ships		= ['balliasta', 'catapult', 'flamethrower', 'mortar', 'ram', 'steamboat', 'rocketship', 'submarine', 'paddlespeedship', 'balloncarrier', 'tender', 'transport', 'premium_transport'];
				var la_resources	= IC.Ikariam.resourceNames;
				la_resources.push('gold');
				
				la_troops.forEach(function(is_troopName) {
					_lo_idTranslation[is_troopName] = IC.Language.$('diverse.name.unit.' + is_troopName);
				});
				
				la_ships.forEach(function(is_shipName) {
					_lo_idTranslation['ship_' + is_shipName] = IC.Language.$('diverse.name.ship.' + is_shipName.replace('premium_', ''));
				});
				
				la_resources.forEach(function(is_resourceName) {
					_lo_idTranslation[is_resourceName] = IC.Language.$('diverse.name.resource.' + is_resourceName);
				});
			};
			
			/**
			 * Hide the number of ships for the own peaceful missions (trade / transport).
			 */
			var _lf_hideShipNumberOwnPeacefulMissions = function() {
				var la_ownEventTableRows = IC.myGM.$$('#js_MilitaryMovementsFleetMovementsTable .military_event_table tr.own');
				
				la_ownEventTableRows.forEach(function(ie_tableRow) {
					var le_missionDiv		= IC.myGM.$('td:nth-child(1) div.mission_icon', ie_tableRow);
					var lb_peacefulMission	= le_missionDiv.classList.contains('transport') || le_missionDiv.classList.contains('trade');
					
					if(lb_peacefulMission === true) {
						IC.myGM.$('td:nth-child(4) div', ie_tableRow).classList.add('invisible');
					}
				});
			};
			
			/**
			 * Show the military tooltips directly.
			 */
			var _lf_doShowDirectMilitaryTooltips = function() {
				_lf_fillIdTranslation();
				
				_lf_hideShipNumberOwnPeacefulMissions();
				
				IC.myGM.$$('.spyMilitary').forEach(function(ie_movementWrapper) {
					ie_movementWrapper.onclick = 'return false;';
				});
				
				var le_movementsTable = IC.myGM.$('#js_MilitaryMovementsFleetMovementsTable');
				
				IC.myGM.forEach(_lo_idTranslation, function(is_classId, is_translation) {
					IC.myGM.$$('.icon40.' + is_classId, le_movementsTable).forEach(function(ie_detailIcon) {
						ie_detailIcon.title = is_translation;
					});
				});
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showDirectMilitaryTooltips
			 *   If the user selected the checkbox to show the military tooltips directly.
			 */
			this.updateSettings = function(ib_showDirectMilitaryTooltips) {
				if(ib_showDirectMilitaryTooltips === true) {
					IC.RefreshHandler.add('militaryAdvisor', 'showDirectMilitaryTooltips', _lf_doShowDirectMilitaryTooltips);
					IC.myGM.addStyle(
						'#js_MilitaryMovementsFleetMovementsTable .military_event_table .magnify_icon				{ background-image: none; cursor: default; width: 240px; } \
						 #js_MilitaryMovementsFleetMovementsTable .military_event_table .magnify_icon .infoTip		{ display: inline; position: relative; padding: 0px; border: none; } \
						 #js_MilitaryMovementsFleetMovementsTable .military_event_table .magnify_icon .infoTip h5	{ display: none; } \
						 #js_MilitaryMovementsFleetMovementsTable .military_event_table .icon40						{ background-size: 25px 25px; background-color: transparent; padding: 26px 3px 0px 3px; width: 30px; } \
						 #js_MilitaryMovementsFleetMovementsTable .military_event_table .icon40.resource_icon		{ background-size: 20px 16px; }',
						'showDirectMilitaryTooltips'
					);
					return;
				}
				
				IC.RefreshHandler.remove('militaryAdvisor', 'showDirectMilitaryTooltips');
				IC.myGM.removeStyle('showDirectMilitaryTooltips');
			};
		};
		
		// Show alliance / military tooltips directly.
		IC.Options.addCheckbox('autoshowTooltips', 'diverseOptions', 1, true, IC.Language.$('tooltips.options.autoshow'), { changeCallback: _go_autoshowTooltips.updateSettings });
		// Show military tooltips directly.
		IC.Options.addCheckbox('showDirectMilitaryTooltips', 'diverseOptions', 1, false, IC.Language.$('tooltips.options.showDirectInMilitaryAdvisor'), { changeCallback: _go_directMilitaryTooltips.updateSettings });
		// Add a divider line.
		IC.Options.addLine('diverseOptions', 1);
	})();