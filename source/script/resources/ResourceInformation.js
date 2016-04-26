// Ressource information.
	(function() {
		/**
		 * Storage for the style functions for the capacity bar and the direct income.
		 * 
		 * @type	{object}
		 */
		var _go_styleFunctions = new function() {
			/**
			 * Get the style for the #js_GlobalMenu_ elements.
			 * 
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getGlobalMenuStyle = function(is_incomeStyle) {
				if(is_incomeStyle != 'alignLeft')
					return '#js_GlobalMenu_wood, #js_GlobalMenu_wine, #js_GlobalMenu_marble, #js_GlobalMenu_crystal, #js_GlobalMenu_sulfur { padding-right: 4px; } ';
				
				return '';
			};
			
			/**
			 * Gets the style for the separation of the resource values.
			 * 
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getSeparationStyle = function(is_incomeStyle) {
				if(is_incomeStyle == 'withSeparation')
					return '#resources_wood, #resources_wine, #resources_marble, #resources_glass { border-right: 1px dotted #542C0F; } ';
				
				return '';
			};
			
			/**
			 * Get styles which are independent of the activation of the cpacity bar or direct income.
			 * 
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getGeneralStyles = function(is_incomeStyle) {
				var ls_globalMenuStyle = _lf_getGlobalMenuStyle(is_incomeStyle);
				var ls_separationStyle	= _lf_getSeparationStyle(is_incomeStyle);
				
				return ls_globalMenuStyle + ls_separationStyle;
			};
			
			/**
			 * Get the style for the capacity bar "wrapper".
			 * 
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getCapacityBarStyle = function(is_capacityBarOrientation, is_incomeStyle) {
				var ls_height		= 'height: 4px; ';
				var ls_width		= 'width: 79px;';
				var ls_right		= 'right: 4px; ';
				var ls_marginLeft	= '';
				
				if(is_capacityBarOrientation == 'horizontal')
					ls_width = 'width: 50px; ';
				
				if(is_capacityBarOrientation == 'vertical') {
					ls_height	= 'height: 21px; ';
					ls_width	= 'width: 4px; ';
					ls_right	= '';
					
					if(is_incomeStyle == 'alignLeft')
						ls_marginLeft = 'margin-left: -7px; ';
				}
				
				return '.' + IC.myGM.prefix + 'capacityInformation { position: absolute; bottom: 4px; ' + ls_height + ls_width + ls_right + ls_marginLeft + '} ';
			};
			
			/**
			 * Get the style for the capacity bar with a border.
			 * 
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getCapacityBarWithBorderStyle = function(is_capacityBarOrientation) {
				var ls_height	= 'height: 3px; ';
				var ls_width	= 'width: 78px; ';
				var ls_right	= 'right: 3px; ';
				
				if(is_capacityBarOrientation == 'horizontal')
					ls_width	= 'width: 50px; ';
				
				if(is_capacityBarOrientation == 'vertical') {
					ls_height	= 'height: 20px; ';
					ls_width	= 'width: 3px; ';
					ls_right	= '';
				}
				
				return '.' + IC.myGM.prefix + 'capacityInformation.' + IC.myGM.prefix + 'border { border: 1px inset #906646; bottom: 3px; ' + ls_height + ls_width + ls_right + '} ';
			};
			
			/**
			 * Get the style for the capacity bar.
			 * 
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getCapacityStyle = function(is_capacityBarOrientation, is_incomeStyle) {
				var ls_prefix = IC.myGM.prefix;
				
				var ls_barStyle =	'.' + ls_prefix + 'bar							{ height: 100%; width: 100%; bottom: 0px; position: absolute; } \
									 .' + ls_prefix + 'bar.' + ls_prefix + 'red		{ background-color: #AA0000; } \
									 .' + ls_prefix + 'bar.' + ls_prefix + 'yellow	{ background-color: #FFD700; } \
									 .' + ls_prefix + 'bar.' + ls_prefix + 'green	{ background-color: #669900; }';
				
				var ls_capacityStyle		= _lf_getCapacityBarStyle(is_capacityBarOrientation, is_incomeStyle);
				var ls_capacityBorderStyle	= _lf_getCapacityBarWithBorderStyle(is_capacityBarOrientation);
				
				return ls_barStyle + ls_capacityStyle + ls_capacityBorderStyle;
			};
			
			/**
			 * Get the style for the direct hourly income in the town view.
			 * 
			 * @param	{boolean}	ib_capacityBarActive
			 *   If the capacity bar is shown.
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 *   
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getHourlyIncomeStyle = function(ib_capacityBarActive, is_capacityBarOrientation, is_incomeStyle) {
				var ls_display		= 'display: block; ';
				var ls_fontSize		= 'font-size: 11px; ';
				var ls_paddingRight	= 'padding-right: 4px; ';
				
				if(ib_capacityBarActive === true && is_capacityBarOrientation !== 'horizontalFull')
					ls_fontSize = 'font-size: 9px; ';
				
				if(is_incomeStyle == 'alignLeft')
					ls_paddingRight = '';
				
				return '.' + IC.myGM.prefix + 'hourlyIncomeResource { ' + ls_display + ls_fontSize + ls_paddingRight + '} ';
			};
			
			/**
			 * Get some resource styles which are only set if the capacity bar is active.
			 * 
			 * @param	{boolean}	ib_directIncomeActive
			 *   If the direct income is shown.
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getResourceStyleCapacityActive = function(ib_directIncomeActive, is_capacityBarOrientation, is_incomeStyle) {
				var ls_height		= '';
				var ls_top			= '';
				var ls_paddingLeft	= '';
				var ls_fontSize		= '';
				
				if(is_capacityBarOrientation == 'horizontalFull') {
					ls_height	= 'height: 32px !important; ';
					ls_top		= 'top: -2px !important; ';
				}
				
				if(is_capacityBarOrientation == 'vertical' && is_incomeStyle == 'alignLeft')
					ls_paddingLeft = 'padding-left: 38px !important; ';
				
				if(is_capacityBarOrientation == 'vertical' || (ib_directIncomeActive === true && is_capacityBarOrientation != 'horizontalFull'))
					ls_fontSize = 'font-size: 11px; ';
				
				return ls_height + ls_top + ls_paddingLeft + ls_fontSize;
			};
			
			/**
			 * Get the line height for the sored resources.
			 * 
			 * @param	{boolean}	ib_capacityBarActive
			 *   If the capacity bar is shown.
			 * @param	{boolean}	ib_directIncomeActive
			 *   If the direct income is shown.
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 *   
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getResourceStyleLineHeigth = function(ib_capacityBarActive, ib_directIncomeActive, is_capacityBarOrientation) {
				if(ib_directIncomeActive === true) {
					if(ib_capacityBarActive === true && is_capacityBarOrientation == 'horizontal')
						return 'line-height: 9px !important; ';
					
					return 'line-height: 11px !important; ';
				}
				
				if(is_capacityBarOrientation == 'horizontal')
					return 'line-height: 12px !important; ';
				
				if(is_capacityBarOrientation == 'vertical')
					return 'line-height: 24px !important; ';
				
				return '';
			};
			
			/**
			 * Get the style for the resource fields.
			 * 
			 * @param	{boolean}	ib_capacityBarActive
			 *   If the capacity bar is shown.
			 * @param	{boolean}	ib_directIncomeActive
			 *   If the direct income is shown.
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 *   
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getResourceStyle = function(ib_capacityBarActive, ib_directIncomeActive, is_capacityBarOrientation, is_incomeStyle) {
				var ls_align			= 'text-align: right; ';
				var ls_capacityActive	= '';
				var ls_lineHeight		= _lf_getResourceStyleLineHeigth(ib_capacityBarActive, ib_directIncomeActive, is_capacityBarOrientation);
				
				if(is_incomeStyle == 'alignLeft')
					ls_align = '';
				
				if(ib_capacityBarActive === true)
					ls_capacityActive = _lf_getResourceStyleCapacityActive(ib_directIncomeActive, is_capacityBarOrientation, is_incomeStyle);
				
				return '#resources_wood, #resources_wine, #resources_marble, #resources_glass, #resources_sulfur { ' + ls_align + ls_lineHeight + ls_capacityActive + ' } ';
			};
			
			/**
			 * Set the styles for the direct income and the capacity bar.
			 */
			this.setStyles = function() {
				var lb_capacityBarActive = IC.Options.getOption('resourceInformation', 'showCapacityBar');
				var lb_directIncomeActive = IC.Options.getOption('resourceInformation', 'showDirectIncome');
				
				// If not both of the checkboxes have been defined yet, do nothing!
				if(lb_capacityBarActive === null || lb_directIncomeActive === null)
					return;
				
				if(lb_capacityBarActive === false && lb_directIncomeActive === false) {
					IC.myGM.removeStyle('resourceInformation');
					return;
				}
				
				var ls_capacityBarOrientation	= IC.Options.getOption('resourceInformation', 'capacityBarOrientation');
				var ls_incomeStyle				= IC.Options.getOption('resourceInformation', 'incomeStyle');
				
				var ls_incomeStyleString = _lf_getGeneralStyles(ls_incomeStyle)
												+ _lf_getResourceStyle(lb_capacityBarActive, lb_directIncomeActive, ls_capacityBarOrientation, ls_incomeStyle);
				
				if(lb_capacityBarActive === true)
					ls_incomeStyleString += _lf_getCapacityStyle(ls_capacityBarOrientation, ls_incomeStyle);
				
				if(lb_directIncomeActive === true)
					ls_incomeStyleString += _lf_getHourlyIncomeStyle(lb_capacityBarActive, ls_capacityBarOrientation, ls_incomeStyle);
				
				IC.myGM.addStyle(ls_incomeStyleString, 'resourceInformation', true);
			};
		};
		
		/**
		 * Storage for the functions for the capacity bar.
		 * 
		 * @type	{object}
		 */
		var _go_capacityInformation = new function() {
			/**
			 * Update the capacity information bars.
			 */
			var _lf_updateFields = function() {
				if(IC.ika.model.isOwnCity === false)
					return;
				
				var la_capacityInformation = [];
				var la_resourceIdentifiers = ['resource', 1, 2, 3, 4];
				
				la_resourceIdentifiers.forEach(function(im_identifier, ii_index) {
					la_capacityInformation.push({
						warehouse:		IC.Ikariam.getInt(IC.ika.getModel().maxResources[im_identifier]),
						branchOffice:	IC.Ikariam.getInt(IC.ika.getModel().branchOfficeResources[im_identifier]),
						current:		IC.Ikariam.getInt(IC.ika.getModel().currentResources[im_identifier])
					});
				});
				
				var ls_prefix			= '#' + IC.myGM.prefix;
				var ls_styleToChange	= 'width';
				if(IC.Options.getOption('resourceInformation', 'capacityBarOrientation') == 'vertical')
					ls_styleToChange = 'height';
				
				la_capacityInformation.forEach(function(io_capacity, ii_index) {
					var ls_resource = IC.Ikariam.resourceNames[ii_index];
					
					var li_warehousePercentage	= 100;
					var li_resourcePercentage	= io_capacity.current / io_capacity.warehouse * 100;
					
					if(IC.Options.getOption('resourceInformation', 'capacityBarShowBranchOfficeResources') === true) {
						var li_maximumCapacity	= io_capacity.warehouse + io_capacity.branchOffice;
						li_warehousePercentage	= io_capacity.warehouse / li_maximumCapacity * 100;
						li_resourcePercentage	= io_capacity.current / li_maximumCapacity * 100;
					}
					
					IC.myGM.$(ls_prefix + 'maxCapacity' + ls_resource).style[ls_styleToChange]			= '100%';
					IC.myGM.$(ls_prefix + 'warehouseCapacity' + ls_resource).style[ls_styleToChange]	= li_warehousePercentage + '%';
					IC.myGM.$(ls_prefix + 'currentResource' + ls_resource).style[ls_styleToChange]		= li_resourcePercentage + '%';
				});
			};
			
			/**
			 * Add the capacity information bars.
			 */
			var _lf_addFields = function() {
				var la_classes	= ['capacityInformation'];
				if(IC.Options.getOption('resourceInformation', 'capacityBarHasBorder') === true)
					la_classes.push('border');
				
				IC.Ikariam.resourceNames.forEach(function(is_resource) {
					var le_wrapper = IC.myGM.addElement('div', IC.myGM.$('#resources_' + is_resource), { 'id': 'capacityInfo' + is_resource, 'classes': la_classes }, true);
					IC.myGM.addElement('div', le_wrapper, { 'id': 'maxCapacity' + is_resource, 'classes': ['bar', 'yellow'] }, true);
					IC.myGM.addElement('div', le_wrapper, { 'id': 'warehouseCapacity' + is_resource, 'classes': ['bar', 'green'] }, true);
					IC.myGM.addElement('div', le_wrapper, { 'id': 'currentResource' + is_resource, 'classes': ['bar', 'red'] }, true);
				});
				
				_lf_updateFields();
			};
			
			/**
			 * Remove the capacity information bars.
			 */
			var _lf_removeFields = function() {
				IC.myGM.removeElement(IC.myGM.$$('.' + IC.myGM.prefix + 'capacityInformation'));
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showCapacityBar
			 *   If the user selected the checkbox to show the capacity information.
			 */
			this.updateSettings = function(ib_showCapacityBar) {
				_go_styleFunctions.setStyles();
				
				if(ib_showCapacityBar === true) {
					_lf_addFields();
					IC.Observer.add('updateCapacityBar', IC.myGM.$('#cityResources'), { childList: true, subtree: true }, _lf_updateFields, _lf_updateFields);
					return;
				}
				
				IC.Observer.remove('updateCapacityBar');
				_lf_removeFields();
			};
		};
		
		/**
		 * Storage for the functions for the direct income.
		 * 
		 * @type	{object}
		 */
		var _go_directIncome = new function() {
			/**
			 * Storage for the tradegood of the last town selected.
			 * 
			 * @type	{int}
			 */
			var _li_lastTradegood = null;
			
			/**
			 * Delete the data of the tradegood of the last town selected.
			 * 
			 * @param	{string}	is_hourlyPrefix
			 *   The prefix for the hourly income wrapper selector.
			 * @param	{string}	is_dailyPrefix
			 *   The prefix for the daily income wrapper selector.
			 */
			var _lf_deleteLastTradegoodData = function(is_hourlyPrefix, is_dailyPrefix) {
				IC.myGM.$(is_hourlyPrefix + IC.Ikariam.resourceNames[_li_lastTradegood]).innerHTML	= '';
				IC.myGM.$(is_dailyPrefix + IC.Ikariam.resourceNames[_li_lastTradegood]).innerHTML	= '';
				
				if(_li_lastTradegood !== 1) {
					IC.myGM.$(is_hourlyPrefix + IC.Ikariam.resourceNames[_li_lastTradegood]).classList.add('invisible');
					IC.myGM.$(is_dailyPrefix + 'Wrapper' + IC.Ikariam.resourceNames[_li_lastTradegood]).classList.add('invisible');
				}
			};
			
			/**
			 * Update the direct icome fields.
			 * 
			 * @param	{boolean}	ib_firstRun
			 *   If this is the first run after adding the fields.
			 */
			var _lf_updateFields = function(ib_firstRun) {
				if(IC.ika.model.isOwnCity === false)
					return;
				
				var ls_hourlyPrefix	= '#' + IC.myGM.prefix + 'hourlyIncomeResource';
				var ls_dailyPrefix	= '#' + IC.myGM.prefix + 'dailyIncomeResource';
				
				if(_li_lastTradegood !== null)
					_lf_deleteLastTradegoodData(ls_hourlyPrefix, ls_dailyPrefix);
				
				var li_producedTradegood	= IC.Ikariam.getInt(IC.ika.getModel().producedTradegood);
				var li_tradegoodProduction	= IC.ika.getModel().tradegoodProduction * 3600 + 0.001;
				var li_woodProduction		= IC.ika.getModel().resourceProduction * 3600 + 0.001;
				var li_wineSpending			= IC.ika.getModel().wineSpendings;
				var li_producesWine			= IC.ika.getModel().cityProducesWine;
				var ls_tradegoodName		= IC.Ikariam.resourceNames[li_producedTradegood];
				
				IC.myGM.$(ls_hourlyPrefix + IC.Ikariam.resourceNames[0]).innerHTML	= IC.Ikariam.formatToIkaNumber(Math.floor(li_woodProduction), true, true);
				IC.myGM.$(ls_dailyPrefix + IC.Ikariam.resourceNames[0]).innerHTML	= IC.Ikariam.formatToIkaNumber(Math.floor(li_woodProduction * 24), false);
				
				IC.myGM.$(ls_hourlyPrefix + IC.Ikariam.resourceNames[1]).innerHTML			= IC.Ikariam.formatToIkaNumber(Math.floor(-1 * li_wineSpending), true, true);
				IC.myGM.$(ls_dailyPrefix + IC.Ikariam.resourceNames[1]).innerHTML			= IC.Ikariam.formatToIkaNumber(Math.floor(-1 * li_wineSpending * 24), false);
				IC.myGM.$(ls_dailyPrefix + 'Label' + IC.Ikariam.resourceNames[1]).innerHTML	= IC.Language.$('resourceInformation.dailyExpenses', [IC.Language.$('diverse.name.resource.' + IC.Ikariam.resourceNames[1])]);
				
				if(li_producesWine === true)
					li_tradegoodProduction = li_tradegoodProduction - li_wineSpending;
				
				if(li_tradegoodProduction >= 0)
					IC.myGM.$(ls_dailyPrefix + 'Label' + ls_tradegoodName).innerHTML	= IC.Language.$('resourceInformation.dailyProduction', [IC.Language.$('diverse.name.resource.' + ls_tradegoodName)]);
				else
					IC.myGM.$(ls_dailyPrefix + 'Label' + ls_tradegoodName).innerHTML	= IC.Language.$('resourceInformation.dailyExpenses', [IC.Language.$('diverse.name.resource.' + ls_tradegoodName)]);
				
				IC.myGM.$(ls_hourlyPrefix + ls_tradegoodName).innerHTML	= IC.Ikariam.formatToIkaNumber(Math.floor(li_tradegoodProduction), true, true);
				IC.myGM.$(ls_dailyPrefix + ls_tradegoodName).innerHTML	= IC.Ikariam.formatToIkaNumber(Math.floor(li_tradegoodProduction * 24), false);
				
				IC.myGM.$(ls_hourlyPrefix + ls_tradegoodName).classList.remove('invisible');
				IC.myGM.$(ls_dailyPrefix + 'Wrapper' + ls_tradegoodName).classList.remove('invisible');
				
				_li_lastTradegood = li_producedTradegood;
			};
			
			/**
			 * Add the direct income fields.
			 */
			var _lf_addFields = function() {
				if(!IC.myGM.$('js_GlobalMenu_production_container_wood') === true) {
					var le_woodProductionContainer	= IC.myGM.$('#js_GlobalMenu_resourceProduction').parentNode;
					le_woodProductionContainer.id	= 'js_GlobalMenu_production_container_wood';
					
				}
				
				IC.Ikariam.resourceNames.forEach(function(is_resource, ii_index) {
					var ls_resourceParent	= is_resource === 'glass' ? 'crystal' : is_resource;
					var la_hourlyClasses	= [IC.myGM.prefix + 'hourlyIncomeResource'];
					var la_dailyClasses		= ['altTooltip', IC.myGM.prefix + 'dailyIncomeResourceWrapper'];

					if(ii_index >= 2) {
						la_hourlyClasses.push('invisible');
						la_dailyClasses.push('invisible');
					}
					
					IC.myGM.addElement('span', IC.myGM.$('#resources_' + is_resource), { 'id': 'hourlyIncomeResource' + is_resource, 'classes': la_hourlyClasses });
					
					var le_dailyIncomeParent		= IC.myGM.$('#js_GlobalMenu_' + ls_resourceParent + '_tooltip tbody');
					var le_dailyIncomeInsertBefore	= IC.myGM.$('#js_GlobalMenu_production_container_' + ls_resourceParent + ' + tr');
					var le_dailyIncomeWrapper		= IC.myGM.addElement('tr', le_dailyIncomeParent, {
						'id':		'dailyIncomeResourceWrapper' + is_resource,
						'classes':	la_dailyClasses,
					}, null, le_dailyIncomeInsertBefore);
					
					IC.myGM.addElement('td', le_dailyIncomeWrapper, {
						'id':			'dailyIncomeResourceLabel' + is_resource,
						'class':		'smallFont',
						'innerHTML':	IC.Language.$('resourceInformation.dailyProduction', [IC.Language.$('diverse.name.resource.' + is_resource)])
					});
					
					IC.myGM.addElement('td', le_dailyIncomeWrapper, {
						'id':		'dailyIncomeResource' + is_resource,
						'class':	'rightText'
					});
				});
				
				_lf_updateFields(true);
			};
			
			/**
			 * Remove the direct income fields.
			 */
			var _lf_removeFields = function() {
				IC.myGM.removeElement(IC.myGM.$$('.' + IC.myGM.prefix + 'hourlyIncomeResource' + ', .' + IC.myGM.prefix + 'dailyIncomeResourceWrapper'));
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showDirectIncome
			 *   If the user selected the checkbox to show the income directly in town view.
			 */
			this.updateSettings = function(ib_showDirectIncome) {
				_go_styleFunctions.setStyles();
				
				if(ib_showDirectIncome === true) {
					_lf_addFields();
					IC.RefreshHandler.add('*', 'directIncome', _lf_updateFields);
					return;
				}
				
				IC.RefreshHandler.remove('*', 'directIncome');
				_lf_removeFields();
			};
		};
		
		/**
		 * Storage for the functions for the resource quicklinks enhancements.
		 * 
		 * @type	{object}
		 */
		var _go_resourceQuicklinkEnhancements = new function() {
			/**
			 * Open the town hall of the selected town.
			 */
			var _lf_openTownHall = function() {
				var ls_selectedCity	= IC.ika.getModel().relatedCityData.selectedCity;
				var ls_cityId		= IC.ika.getModel().relatedCityData[ls_selectedCity].id;
				
				if(IC.Ikariam.view == 'town') {
					IC.win.ajaxHandlerCall('?view=townHall&cityId=' + ls_cityId + '&position=0');
					
					return;
				}
				
				IC.win.ajaxHandlerCall('?view=city&dialog=townHall&cityId=' + ls_cityId + '&position=0');
			};
			
			/**
			 * Update the css to hover only the resources which are clickable.
			 */
			var _lf_updateCSS = function() {
				var ls_activeResource = IC.Ikariam.resourceNames[IC.ika.getModel().producedTradegood];
				
				IC.myGM.addStyle(
					'#resources_population:hover, #resources_wood:hover, #resources_' + ls_activeResource + ':hover	{ text-shadow: 2px 2px 2px #666; cursor: pointer; color: #333; }',
					'resourceQuicklinkEnhancements', true
				);
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_enhanceResourceQuicklinks
			 *   If the user selected the checkbox to enhance the resource quicklinks.
			 */
			this.updateSettings = function(ib_enhanceResourceQuicklinks) {
				if(ib_enhanceResourceQuicklinks === true) {
					IC.myGM.$('#resources_population').addEventListener('click', _lf_openTownHall, true);
					IC.RefreshHandler.add('*', 'resourceQuicklinkEnhancements', _lf_updateCSS);
					return;
				}
				
				IC.RefreshHandler.remove('*', 'resourceQuicklinkEnhancements');
				IC.myGM.$('#resources_population').removeEventListener('click', _lf_openTownHall, true);
				IC.myGM.removeStyle('resourceQuicklinkEnhancements');
			};
		};
		
		IC.Options.addWrapper('resourceInformation', IC.Language.$('resourceInformation.options.wrapperTitle'));
		
		// Option to show the income directly in town view.
		IC.Options.addCheckbox('showDirectIncome', 'resourceInformation', 1, true, IC.Language.$('resourceInformation.options.directIncome.show'), { changeCallback: _go_directIncome.updateSettings });
		// Option to enhance the resource quicklinks and add one to population.
		IC.Options.addCheckbox('resourceQuicklinkEnhancements', 'resourceInformation', 1, true, IC.Language.$('resourceInformation.options.resourceQuicklinkEnhancements'), { changeCallback: _go_resourceQuicklinkEnhancements.updateSettings });
		
		// Option to show the capacity information.
		IC.Options.addCheckbox('showCapacityBar', 'resourceInformation', 2, true, IC.Language.$('resourceInformation.options.capacityBar.show'), { changeCallback: _go_capacityInformation.updateSettings });
		// Option to show the capacity bar with border.
		IC.Options.addCheckbox('capacityBarHasBorder', 'resourceInformation', 2, true, IC.Language.$('resourceInformation.options.capacityBar.hasBorder'), {});
		// Option to show also branch office ressources.
		IC.Options.addCheckbox('capacityBarShowBranchOfficeResources', 'resourceInformation', 2, true, IC.Language.$('resourceInformation.options.capacityBar.showBranchOfficeResources'), {});
		
		// Style of the resources in warehouse / daily income.
		IC.Options.addSelect('incomeStyle', 'resourceInformation', 3, 'alignRight', IC.Language.$('resourceInformation.options.directIncome.style.label'), [
			{ value: 'alignRight',		label: IC.Language.$('resourceInformation.options.directIncome.style.alignRight') },
			{ value: 'alignLeft',		label: IC.Language.$('resourceInformation.options.directIncome.style.alignLeft') },
			{ value: 'withSeparation',	label: IC.Language.$('resourceInformation.options.directIncome.style.withSeparation') }
		], {});
		// Style of the capacity bar.
		IC.Options.addSelect('capacityBarOrientation', 'resourceInformation', 3, 'vertical', IC.Language.$('resourceInformation.options.capacityBar.orientation.label'), [
			{ value: 'vertical',		label: IC.Language.$('resourceInformation.options.capacityBar.orientation.vertical') },
			{ value: 'horizontal',		label: IC.Language.$('resourceInformation.options.capacityBar.orientation.horizontal') },
			{ value: 'horizontalFull',	label: IC.Language.$('resourceInformation.options.capacityBar.orientation.horizontalFull') }
		], {});
	})();