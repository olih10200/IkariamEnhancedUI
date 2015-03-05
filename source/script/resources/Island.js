// Functions for the island view.
	(function() {
		/**
		 * Storage for the colonizing city info functions.
		 * 
		 * @type	{object}
		 */
		var _go_colonizingCityInfo = new function() {
			/**
			 * Add the link to show the colonizing city information.
			 */
			var _lf_doShowColonizingCityInfo = function() {
				var la_colonizingCities = IC.myGM.$$('.level0');
			
				la_colonizingCities.forEach(function(le_colonizingCity) {
					var ls_locationId	= le_colonizingCity.id.replace(/\D/g, '');
					var ls_cityId		= IC.ika.getScreen().data.cities[ls_locationId].id;
					
					IC.myGM.$('#js_cityLocation' + ls_locationId + 'Link').href = '?view=cityDetails&destinationCityId=' + ls_cityId;
				});
			};
			
			/**
			 * Remove the link to show the colonizing city information.
			 */
			var _lf_doHideColonizingCityInfo = function() {
				var la_colonizingCityLinks = IC.myGM.$$('.level0 .link_img');
			
				la_colonizingCityLinks.forEach(function(le_colonizingCityLink) {
					le_colonizingCityLink.href = '';
				});
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showColonizingCityInfo
			 *   If the user selected the checkbox to show the colonizing city info.
			 */
			this.updateSettings = function(ib_showColonizingCityInfo) {
				if(IC.Ikariam.view !== 'island')
					return;
				
				if(ib_showColonizingCityInfo === true) {
					IC.RefreshHandler.add('*', 'showColonizingCityInfo', _lf_doShowColonizingCityInfo);
					_lf_doShowColonizingCityInfo();
					return;
				}
				
				IC.RefreshHandler.remove('*', 'showColonizingCityInfo');
				_lf_doHideColonizingCityInfo();
			};
		};
		
		// Retrieve information about colonies during colonization.
		IC.Options.addCheckbox('showColonizingCityInfo', 'diverseOptions', 1, true, IC.Language.$('island.options.showColonizingCityInfo'), { changeCallback: _go_colonizingCityInfo.updateSettings });
		// Add a divider line.
		IC.Options.addLine('diverseOptions', 1);
	})();