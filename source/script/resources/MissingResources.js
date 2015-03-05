// Functions for missing resources.
	(function() {
		/**
		 * Storage for the missing ressources functions.
		 * 
		 * @type	{object}
		 */
		var _go_showMissingResources = new function() {
			/**
			 * Update the information in the missing resources wrappers.
			 * 
			 * @param	{boolean}	ib_isUpdateView
			 *   If the update is in the update view.
			 */
			var _lf_updateInformation = function(ib_isUpdateView) {
				var la_currentResources = [
					IC.ika.getModel().currentResources.resource,	// Wood.
					IC.ika.getModel().currentResources[1],			// Wine.
					IC.ika.getModel().currentResources[2],			// Marble.
					IC.ika.getModel().currentResources[3],			// Crystal.
					IC.ika.getModel().currentResources[4]			// Sulfur.
				];
				
				var lb_showPositiveNumbers	= IC.Options.getOption('missingResources', 'showPositive') === true && ib_isUpdateView === true;
				var lb_showMissingColoured	= IC.Options.getOption('missingResources', 'showColoured');
				
				var ls_resourcesPattern	= '%resources%';
				if(ib_isUpdateView !== true)
					ls_resourcesPattern = ' (' + ls_resourcesPattern + ')';
				
				for(var i = 0; i < IC.Ikariam.resourceNames.length; i++) {
					var la_missingWrappers = IC.myGM.$$('.' + IC.myGM.prefix + 'missingResources' + IC.Ikariam.resourceNames[i]);
					
					if(!!la_missingWrappers) {
						for(var k = 0; k < la_missingWrappers.length; k++) {
							
							var le_neededWrapper	= la_missingWrappers[k].previousSibling;
							var li_missing			= la_currentResources[i] - IC.Ikariam.getInt(le_neededWrapper.nodeValue);
							
							if(li_missing < 0 || lb_showPositiveNumbers === true) {
								var ls_formattedMissingValue	= IC.Ikariam.formatToIkaNumber(li_missing, lb_showMissingColoured, true);
								la_missingWrappers[k].innerHTML	= ls_resourcesPattern.replace(/\%resources\%/, ls_formattedMissingValue);
							} else {
								la_missingWrappers[k].innerHTML = '';
							}
						}
					}
				}
			};
			
			/**
			 * Add the missing resources wrappers.
			 * 
			 * @param	{boolean}	ib_isUpdateView
			 *   If the wrappers are added to the update view.
			 */
			var _lf_addMissingWrappers = function(ib_isUpdateView) {
				var ls_wrapperSelector = '#buildingGround .resources';
				if(ib_isUpdateView === true)
					ls_wrapperSelector = '#sidebar .resources';
				
				var la_wrappers = IC.myGM.$$(ls_wrapperSelector);
				
				for(var i = 0; i < la_wrappers.length; i++) {
					for(var k = 0; k < IC.Ikariam.resourceNames.length; k++) {
						var le_resourceNode = IC.myGM.$('.' + IC.Ikariam.resourceNames[k], la_wrappers[i]);
						
						if(!!le_resourceNode) {
							IC.myGM.addElement('span', le_resourceNode, { 'classes': ['missingResources', 'missingResources' + IC.Ikariam.resourceNames[k]] }, true);
						}
					}
				}
				
				_lf_updateInformation(ib_isUpdateView);
			};
			
			/**
			 * Update the missing resources in building ground popup.
			 */
			var _lf_doUpdateInBuildingView = function() {
				if(!IC.myGM.$('#buildingGround_c')) {
					IC.Observer.remove('missingResourcesBuilding');
					return;
				}

				_lf_updateInformation(false);
			};
			
			/**
			 * Update the missing resources in update view.
			 */
			var _lf_doUpdateInUpdateView = function() {
				if(!IC.myGM.$('#buildingUpgrade')) {
					IC.Observer.remove('missingResourcesUpdate');
					return;
				}

				_lf_updateInformation(true);
			};
			
			/**
			 * Show the missing resources in building ground popup.
			 */
			var _lf_doShowInBuildingGround = function() {
				_lf_addMissingWrappers(false);
				
				IC.Observer.add('missingResourcesBuilding', IC.myGM.$('#cityResources'), { childList: true, subtree: true }, _lf_doUpdateInBuildingView, _lf_doUpdateInBuildingView);
			};
			
			/**
			 * Show the missing resources in update view.
			 */
			var _lf_doShowInUpdateView = function() {
				if(!IC.myGM.$('#buildingUpgrade') || IC.myGM.$$('.' + IC.myGM.prefix + 'missingResources').length > 0)
					return;
				
				_lf_addMissingWrappers(true);
				
				IC.Observer.add('missingResourcesUpgrade', IC.myGM.$('#cityResources'), { childList: true, subtree: true }, _lf_doUpdateInUpdateView, _lf_doUpdateInUpdateView);
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showMissingResources
			 *   If the user selected the checkbox to show the missing resources info.
			 */
			this.updateSettings = function(ib_showMissingResources) {
				if(ib_showMissingResources === true) {
					IC.RefreshHandler.add('buildingGround', 'showMissingResources', _lf_doShowInBuildingGround);
					IC.RefreshHandler.add('%', 'showMissingResources', _lf_doShowInUpdateView);
					IC.myGM.addStyle(
						'#sidebar #buildingUpgrade ul.resources li			{ width: 120px; } \
						 #sidebar #buildingUpgrade ul.resources li.time		{ width: 60px !important; } \
						 #sidebar .' + IC.myGM.prefix + 'missingResources	{ float: right; }',
						'showMissingResources'
					);
					return;
				}
				
				IC.RefreshHandler.remove('buildingGround', 'showMissingResources');
				IC.RefreshHandler.remove('%', 'showMissingResources');
				IC.myGM.removeStyle('showMissingResources');
			};
		};
		
		IC.Options.addWrapper('missingResources', IC.Language.$('missingResources.options.wrapperTitle'));
		
		// Show missing resources in upgrade / building view.
		IC.Options.addCheckbox('show', 'missingResources', 1, true, IC.Language.$('missingResources.options.show'), { changeCallback: _go_showMissingResources.updateSettings });
		
		// Disable coloring of the missing resources.
		IC.Options.addCheckbox('showPositive', 'missingResources', 2, true, IC.Language.$('missingResources.options.showPositive'), {});
		// Show only missing ressources, not also remaining.
		IC.Options.addCheckbox('showColoured', 'missingResources', 2, true, IC.Language.$('missingResources.options.showColoured'), {});
	})();