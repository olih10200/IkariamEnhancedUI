// Zoom function.
	(function() {
		/**
		 * Storage for the zoom functions.
		 * 
		 * @type	{object}
		 */
		var _go_zoomView = new function() {
			/**
			 * Storage for the minimum zoom factor.
			 * 
			 * @type	{int}
			 */
			var _li_minZoom	= 55;
			
			/**
			 * Storage for the maximum zoom factor.
			 * 
			 * @type	{int}
			 */
			var _li_maxZoom	= 150;
			
			/**
			 * Storage for the zoom step size.
			 * 
			 * @type	{int}
			 */
			var _li_zoomStep	= 5;
			
			/**
			 * Storage for the actual mousewheel callback.
			 * 
			 * @type	{function}
			 */
			var _lf_mousewheelCallbackStorage = IC.ika.getController().mouseScrollHandle;
			
			/**
			 * Getter for the minimum zoom factor.
			 * 
			 * @return	{int}
			 *   The minimum zoom factor.
			 */
			this.__defineGetter__('minZoom', function() { return _li_minZoom; });
			
			/**
			 * Getter for the maximum zoom factor.
			 * 
			 * @return	{int}
			 *   The maximum zoom factor.
			 */
			this.__defineGetter__('maxZoom', function() { return _li_maxZoom; });
			
			/**
			 * Getter for the zoom step size.
			 * 
			 * @return	{int}
			 *   The zoom step size.
			 */
			this.__defineGetter__('zoomStep', function() { return _li_zoomStep; });
			
			/**
			 * Initialize the zoom bounds (min and max zoom).
			 */
			var _lf_initBounds = function() {
				var li_minZoom = Math.round(IC.ika.worldview_scale_min * 100);
				if(li_minZoom % 5 != 0)
					li_minZoom = li_minZoom + (5 - (li_minZoom % 5));

				_li_minZoom = li_minZoom;
				
				IC.ika.worldview_scale_min = _li_minZoom / 100;
				IC.ika.worldview_scale_max = _li_maxZoom / 100;
			};
			
			/**
			 * Zoom the world view, as there is no function provided by Ikariam.
			 * 
			 * @param	{decimal}	in_zoomFactor
			 *   The zoom factor as decimal number (1 =^= 100%)
			 */
			var _lf_zoomWorldView = function(in_zoomFactor) {
				var li_translateXY		= (100 - 100 / in_zoomFactor) / 2;
				var ls_heightWidth		= (100 / in_zoomFactor) + '% !important';
				var ls_transformString	= 'scale(' + in_zoomFactor + ') translate(' + li_translateXY + '%, ' + li_translateXY + '%)';
				
				IC.myGM.addStyle(
					'#scrollcover	{ transform: ' + ls_transformString + '; -webkit-transform: ' + ls_transformString + '; height: ' + ls_heightWidth + '; width: ' + ls_heightWidth + '; }',
					'zoomWorld', true
				);
		
				var le_map = IC.myGM.$('#map1');
				
				le_map.style.top	= '0px';
				le_map.style.left	= '0px';
			};
			
			/**
			 * Rescale the badges and symbols.
			 * 
			 * @param	{decimal}	in_zoomFactorNumber
			 *   The zoom factor as decimal number (1 =^= 100%)
			 */
			var _lf_scaleChildren = function(in_zoomFactorNumber) {
				var ls_transformString	= 'transform: scale(' + 1 / in_zoomFactorNumber + ');  -webkit-transform: scale(' + 1 / in_zoomFactorNumber + ');';
				var ls_style			= '';
				
				if(IC.Ikariam.view == 'world') {
					var ls_ownerState = '';
					
					if(in_zoomFactorNumber < 1)
						ls_ownerState = ', .ownerState';
					
					ls_style =	'.islandTile .wonder, .islandTile .tradegood, .islandTile .cities, .islandTile .piracyInRange' + ls_ownerState + '	{ ' + ls_transformString + ' } \
						 		 .islandTile .cities																	{ bottom: 10px !important; }';
				}
				
				if(IC.Ikariam.view == 'island') {
					var ls_movePiracy = 'transform: translate(0px, -' + (1 - in_zoomFactorNumber) * 20 + 'px) scale(' + 1 / in_zoomFactorNumber + ');';
					ls_style =	'.cityLocation .scroll_img, .cityLocationScroll .scroll_img	{ ' + ls_transformString + ' } \
								 .piracyRaid												{ ' + ls_movePiracy + ' }';
				}
				
				if(IC.Ikariam.view == 'town')
					ls_style = '.timetofinish	{ ' + ls_transformString + ' }';
				
				IC.myGM.addStyle(ls_style, 'scaleChildren', true);
			};
			
			/**
			 * Update the zoom in and zoom out button and the percentage in the middle.
			 * 
			 * @param	{int}	ii_zoomFactor
			 *   The zoom factor as percentage.
			 */
			var _lf_updateZoomButtons = function(ii_zoomFactor) {
				var le_zoomFactorDiv	= IC.myGM.$('#' + IC.myGM.prefix + 'zoomFactor');
				var le_zoomIn			= IC.myGM.$('#' + IC.myGM.prefix + 'zoomIn');
				var le_zoomOut			= IC.myGM.$('#' + IC.myGM.prefix + 'zoomOut');
		
				if(!!le_zoomFactorDiv) {
					le_zoomFactorDiv.innerHTML = ii_zoomFactor + '%';
				}
				
				if(!!le_zoomIn) {
					le_zoomIn.style.visibility = '';
					
					if(ii_zoomFactor >= _li_maxZoom)
						le_zoomIn.style.visibility = 'hidden';
				}
				
				if(!!le_zoomOut) {
					le_zoomOut.style.visibility = '';
					
					if(ii_zoomFactor <= _li_minZoom)
						le_zoomOut.style.visibility = 'hidden';
				}
			};
			
			/**
			 * Calculate the zoom factor as decimal number and execute the zoom function. If it is requestet, call also the rescale function for child elements.
			 * 
			 * @param	{int}	ii_zoomFactor
			 *   The zoom factor as percentage.
			 */
			var _lf_zoomView = function(ii_zoomFactor) {
				var ln_zoomFactorNumber = ii_zoomFactor / 100.0;
	
				var li_scale = 0;
				
				if(IC.Ikariam.view == 'island')
					li_scale = IC.ika.worldview_scale_island;
					
				if(IC.Ikariam.view == 'town')
					li_scale = IC.ika.worldview_scale_city;
				
				if(IC.Ikariam.view == 'world') {
					_lf_zoomWorldView(ln_zoomFactorNumber);
				} else {
					var li_stepNumber = Math.round((ln_zoomFactorNumber - li_scale) / .05);
		
					var le_worldview	= IC.myGM.$('#worldview');
					var li_posX			= le_worldview.offsetLeft + le_worldview.offsetWidth / 2;
					var li_posY			= le_worldview.offsetTop + le_worldview.offsetHeight / 2;
					
					IC.ika.controller.scaleWorldMap(li_stepNumber, li_posX, li_posY);
				}
				
				if(IC.Options.getOption('zoom', IC.Ikariam.view + 'ScaleChildren') === true)
					_lf_scaleChildren(ln_zoomFactorNumber);
			};
			
			/**
			 * Ensure that the requested zoom factor is in the bounds and update the view.
			 * 
			 * @param	{int}	ii_zoomFactor
			 *   The zoom factor as percentage.
			 */
			var _lf_zoom = function(ii_zoomFactor) {
				if(ii_zoomFactor > _li_maxZoom)
					ii_zoomFactor = _li_maxZoom;
				
				if(ii_zoomFactor < _li_minZoom)
					ii_zoomFactor = _li_minZoom;
				
				IC.Options.setOption('zoom', IC.Ikariam.view + 'Factor', ii_zoomFactor);
				
				_lf_updateZoomButtons(ii_zoomFactor);
				_lf_zoomView(ii_zoomFactor);
			};
			
			/**
			 * Zoom one step in.
			 */
			var _lf_zoomIn = function() {
				var li_factor = IC.Ikariam.getInt(IC.Options.getOption('zoom', IC.Ikariam.view + 'Factor', 100)) + _li_zoomStep;
	
				_lf_zoom(li_factor);
			};
			
			/**
			 * Zoom one step out.
			 */
			var _lf_zoomOut = function() {
				var li_factor = IC.Options.getOption('zoom', IC.Ikariam.view + 'Factor', 100) - _li_zoomStep;
	
				_lf_zoom(li_factor);
			};
			
			/**
			 * Add the zoom buttons.
			 */
			var _lf_addZoomButtons = function() {
				var le_zoomWrapper	= IC.myGM.addElement('div', ge_toolbar, { 'id': 'zoomWrapper' });
				IC.myGM.addElement('div', le_zoomWrapper, {
					'id':		'zoomIn',
					'class':	'maximizeImg',
					'title':	IC.Language.$('zoom.zoomIn'),
					'click':	_lf_zoomIn
				});
				IC.myGM.addElement('div', le_zoomWrapper, {
					'id':		'zoomFactor',
					'title':	IC.Language.$('zoom.factor')
				});
				IC.myGM.addElement('div', le_zoomWrapper, {
					'id':		'zoomOut',
					'class':	'minimizeImg',
					'title':	IC.Language.$('zoom.zoomOut'),
					'click':	_lf_zoomOut
				});
				
				IC.myGM.addStyle(
					'#' + IC.myGM.prefix + 'zoomWrapper			{ width: 72px; margin: 0px -5px !important; transform: scale(0.75); scale(0.75); -webkit-transform: scale(0.75); } \
					 #' + IC.myGM.prefix + 'zoomWrapper > div	{ display: inline-block; position: relative; } \
					 #' + IC.myGM.prefix + 'zoomFactor			{ top: -4px; width: 35px; text-align: center; }',
					'zoomButtons'
				);
			};
			
			/**
			 * Set the zoom to 100% if in world view or if it was bigger than 100% and remove the zoom buttons and all styles for the zoom.
			 */
			var _lf_resetZoom = function() {
				if((IC.Ikariam.view == 'island' && IC.ika.worldview_scale_island > 1) || (IC.Ikariam.view == 'town' && IC.ika.worldview_scale_city > 1) || IC.Ikariam.view == 'world')
					_lf_zoomView(100);
					
				IC.ika.worldview_scale_max = 1;
				
				IC.myGM.removeElement(IC.myGM.$('#' + IC.myGM.prefix + 'zoomWrapper'));
				
				IC.myGM.removeStyle('zoomButtons');
				IC.myGM.removeStyle('zoomWorld');
				IC.myGM.removeStyle('scaleChildren');
			};
			
			/**
			 * Check, if the key are pressed which are required to zoom with the mouse.
			 * 
			 * @param	{object}	io_event
			 *   The "event object" with information about the mouse scroll and pressed keys.
			 * 
			 * @return	{boolean}
			 *   If the correct keys were pressed.
			 */
			var _lf_keysOK = function(io_event) {
				var lb_ctrlOK = !!io_event.ctrlKey;
				if(IC.Options.getOption('zoom', 'ctrlAsAccessKey') === false)
					lb_ctrlOK = true;
				
				var lb_altOK = !!io_event.altKey;
				if(IC.Options.getOption('zoom', 'altAsAccessKey') === false)
					lb_altOK = true;
				
				var lb_shiftOK = !!io_event.shiftKey;
				if(IC.Options.getOption('zoom', 'shiftAsAccessKey') === false)
					lb_shiftOK = true;
				
				return lb_ctrlOK && lb_altOK && lb_shiftOK;
			};
			
			/**
			 * Calculate the delta the mousewheel was turned.
			 * 
			 * @param	{object}	io_event
			 *   The "event object" with information about the mouse scroll and pressed keys.
			 * 
			 * @return	{int}
			 *   The delta the mousewheel was moved.
			 */
			var _lf_calculateDelta = function(io_event) {
				var ri_stepNumber = 0;

				// Get the number of steps to scroll.
				if(io_event.wheelDelta)
					ri_stepNumber = io_event.wheelDelta / 120;

				if (io_event.detail)
					ri_stepNumber = -io_event.detail / 3;

				if (io_event.wheelDeltaY !== undefined)
					ri_stepNumber = io_event.wheelDeltaY / 120;
				
				// If the number is between -1 and 0, set it to -1.
				if(ri_stepNumber < 0)
					ri_stepNumber = ri_stepNumber > -1 ? -1 : Math.round(ri_stepNumber);

				// If the number is between 0 and 1, set it to 1.
				else
					ri_stepNumber = ri_stepNumber < 1 ? 1 : Math.round(ri_stepNumber);
					
				return ri_stepNumber;
			};
			
			/**
			 * Handler for mousescroll to zoom.
			 * 
			 * @param	{object}	io_event
			 *   The "event object" with information about the mouse scroll and pressed keys.
			 * 
			 * @return	false
			 *   If the prevent default method is not available to prevent the default action.
			 */
			var _lf_mouseScroll = function(io_event) {
				if(_lf_keysOK(io_event) === true) {
					// If the scrolling is horizontally return.
					if(io_event.axis !== undefined && io_event.axis === io_event.HORIZONTAL_AXIS)
						return;
					
					var li_factor = IC.Ikariam.getInt(IC.Options.getOption('zoom', IC.Ikariam.view + 'Factor')) + _li_zoomStep * _lf_calculateDelta(io_event);
					
					_lf_zoom(li_factor);
					
					// Prevent the default event.
					if(io_event.preventDefault)
						io_event.preventDefault();
					else
						return false;
				}
			};
		
			/**
			 * Change the mousewheel listener to a new callback.
			 * 
			 * @param	{function}	if_newCallback
			 *   The new callback for the mousewheel listener.
			 */
			var _lf_changeMouseWheelListener = function(if_newCallback) {
				if(_lf_mousewheelCallbackStorage == if_newCallback)
					return;
				
				var ls_scrollDivId = '#worldmap';
				
				if(IC.Ikariam.view == 'world')
					ls_scrollDivId	= '#map1';
				
				if(_lf_mousewheelCallbackStorage == IC.ika.getController().mouseScrollHandle) {
					// Remove the ikariam mouse wheel listener and add the own. (with the use of Ikariam-jQuery)
					IC.win.$(ls_scrollDivId).unbind('mousewheel');
					
					var scrollDiv = IC.myGM.$(ls_scrollDivId);
					scrollDiv.addEventListener('DOMMouseScroll', if_newCallback, false);
					scrollDiv.addEventListener('mousewheel', if_newCallback, false);
				} else {
					var scrollDiv = IC.myGM.$(ls_scrollDivId);
					scrollDiv.removeEventListener('DOMMouseScroll', _lf_mousewheelCallbackStorage, false);
					scrollDiv.removeEventListener('mousewheel', _lf_mousewheelCallbackStorage, false);
					
					IC.win.$(ls_scrollDivId).on('mousewheel', if_newCallback);
				}
				
				_lf_mousewheelCallbackStorage = if_newCallback;
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_zoomView
			 *   If the user selected the checkbox to zoom.
			 */
			this.updateSettings = function(ib_zoomView) {
				_lf_initBounds();
				_go_zoomOptions.renewFactorSelects();
				
				if(ib_zoomView === true) {
					_lf_addZoomButtons();
					_lf_changeMouseWheelListener(_lf_mouseScroll);
					_lf_zoom(IC.Options.getOption('zoom', IC.Ikariam.view + 'Factor'));
					return;
				}
				
				_lf_resetZoom();
				_lf_changeMouseWheelListener(IC.ika.getController().mouseScrollHandle);
			};
		};
		
		/**
		 * Storage for the option creation functions.
		 * 
		 * @type	{object}
		 */
		var _go_zoomOptions = new function() {
			/**
			 * If the zoom wrapper is already created.
			 */
			var _lb_zoomWrapperCreated	= false;
			
			/**
			 * Add the select fields for the zoom factors.
			 */
			var _lf_addFactorSelects = function(ib_replace) {
				var la_options = [];
				
				for(var i = _go_zoomView.minZoom; i <= _go_zoomView.maxZoom; i = i + _go_zoomView.zoomStep) {
					la_options.push({ value: i, label: i + '%' });
				}
				
				IC.Ikariam.viewNames.forEach(function(is_view, ii_index) {
					IC.Options.addSelect(is_view + 'Factor', 'zoom', 'factors', 100, IC.Language.$('zoom.options.factor.' + is_view), la_options, { replace: !!ib_replace });
				});
			};
			
			/**
			 * Add the checkboxes fields for rescaling the badges and icons.
			 */
			var _lf_addScaleChildrenCheckboxes = function() {
				IC.Options.addHTML('scaleChildrenDescription', 'zoom', 'scale', { html: '<p>' + IC.Language.$('zoom.options.scaleChildren.label') + '</p>' });
				
				IC.Ikariam.viewNames.forEach(function(is_view) {
					IC.Options.addCheckbox(is_view + 'ScaleChildren', 'zoom', 'scale', true, IC.Language.$('zoom.options.scaleChildren.' + is_view), {});
				});
			};
			
			/**
			 * Add the checkboxes for the access keys.
			 */
			var _lf_addAccessKeyCheckboxes = function() {
				IC.Options.addHTML('accessKeyDescription', 'zoom', 'accessKeys', { html: '<p>' + IC.Language.$('zoom.options.accessKeyLabel') + '</p>' });
				
				var la_accessKeys = ['ctrl', 'alt', 'shift'];
				la_accessKeys.forEach(function(is_accessKey) {
					var lb_defaultEnabled = (is_accessKey == 'ctrl');
					IC.Options.addCheckbox(is_accessKey + 'AsAccessKey', 'zoom', 'accessKeys', lb_defaultEnabled, IC.Language.$('general.' + is_accessKey), {});
				});
			};
			
			/**
			 * Create the zoom options wrapper and add the option elements.
			 */
			this.create = function() {
				_lf_addFactorSelects();
				_lf_addScaleChildrenCheckboxes();
				_lf_addAccessKeyCheckboxes();
				
				_lb_zoomWrapperCreated = true;
			};
			
			/**
			 * Recreate the select fields for the zoom factor (and keep the old zoom factor).
			 */
			this.renewFactorSelects = function() {
				if(_lb_zoomWrapperCreated === false)
					return;
				
				_lf_addFactorSelects(true);
			};
		};
		
		IC.Options.addWrapper('zoom', IC.Language.$('zoom.options.wrapperTitle'));
		
		// Show missing resources in upgrade / building view.
		IC.Options.addCheckbox('view', 'zoom', 'general', true, IC.Language.$('zoom.options.zoomView'), { changeCallback: _go_zoomView.updateSettings });
		
		// Add the zoom function settings.
		_go_zoomOptions.create();
	})();