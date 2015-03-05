// Message enhancements.
	(function() {
		/**
		 * Storage for the url replacement functions.
		 * 
		 * @type	{object}
		 */
		var _go_replaceURL = new function() {
			/**
			 * Show a warning when a replaced link is clicked.
			 */
			var _lf_showNotification = function() {
				var ls_urlToOpen = this.innerHTML.IC.decodeHTML();
				
				var lo_notificationText = {
					header:		IC.Language.$('message.replacedUrl.notification.header'),
					body:		IC.Language.$('message.replacedUrl.notification.text', ['<span class="bold red">"' + ls_urlToOpen + '"</span>']),
					confirm:	IC.Language.$('general.yes'),
					abort:		IC.Language.$('general.no')
				};
				
				var lo_notificationCallback = {
					confirm:	function() { IC.win.open(ls_urlToOpen); },
					abort:		function() { /* Only set to show the abort button */ }
				};
				
				IC.myGM.notification(lo_notificationText, lo_notificationCallback);
			};
			
			/**
			 * Replace the links.
			 */
			var _lf_doReplace = function() {
				var la_messageBodys = IC.myGM.$$('.msgText');
				
				la_messageBodys.forEach(function(ie_messageBody) {
					var ls_text = ie_messageBody.innerHTML;
					ie_messageBody.innerHTML = ls_text.replace(/(?:^|\s)(http(s?)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,4}(\/[^<\s]*)?)/g, ' <span class="' + IC.myGM.prefix + 'replacedUrl" title="$1">$1</span> ');
				});
				
				var la_replacedURLs = IC.myGM.$$('.' + IC.myGM.prefix + 'replacedUrl');
				
				la_replacedURLs.forEach(function(ie_replacedURL) {
					ie_replacedURL.addEventListener('click', _lf_showNotification, true);
				});
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_replaceURL
			 *   If the user selected the checkbox to replace the url.
			 */
			this.updateSettings = function(ib_replaceURL) {
				var la_postboxes = ['diplomacyAdvisor', 'diplomacyAdvisorOutBox', 'diplomacyAdvisorArchive', 'diplomacyAdvisorArchiveOutBox'];
				if(ib_replaceURL === true) {
					IC.RefreshHandler.add(la_postboxes, 'replaceURL', _lf_doReplace);
					IC.myGM.addStyle(
						'.' + IC.myGM.prefix + 'replacedUrl			{ font-weight: bold; font-style: italic; } \
						 .' + IC.myGM.prefix + 'replacedUrl:hover	{ text-decoration: underline; cursor: pointer; }',
						'replaceURL', true
					);
					return;
				}
				
				IC.RefreshHandler.remove(la_postboxes, 'replaceURL');
				IC.myGM.removeStyle('replaceURL');
			};
		};
		
		/**
		 * Storage for the message signature functions.
		 * 
		 * @type	{object}
		 */
		var _go_messageSignature = new function() {
			/**
			 * Add the signature to a new message.
			 */
			var _lf_addSignature = function() {
				var ls_signature = IC.Options.getOption('messages', 'globalSignature');
				
				if(IC.Options.getOption('messages', 'useServerSignature') === true)
					ls_signature = IC.Options.getOption('messages', 'serverSignature');
				
				if(ls_signature === '')
					return;
				
				var le_textarea = IC.myGM.$('#js_msgTextConfirm');
				
				var ls_text = le_textarea.value;
				
				if(IC.Options.getOption('messages', 'placementTop'))
					ls_text = '\n\n' + ls_signature + ls_text;
				else
					ls_text = ls_text + '\n\n' + ls_signature;
				
				le_textarea.value = ls_text;
				
				le_textarea.setSelectionRange(0,0);
				le_textarea.focus();
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_addMessageSignature
			 *   If the user selected the checkbox to add signatures to messages.
			 */
			this.updateSettings = function(ib_addMessageSignature) {
				if(ib_addMessageSignature === true) {
					IC.RefreshHandler.add('sendIKMessage', 'addMessageSignature', _lf_addSignature);
					return;
				}
				
				IC.RefreshHandler.remove('sendIKMessage', 'addMessageSignature');
			};
		};
		
		/**
		 * Storage for the easy circular message link functions.
		 * 
		 * @type	{object}
		 */
		var _go_easyCircularMessageLink = new function() {
			/**
			 * Add the circular message link and style.
			 */
			var _lf_addLink = function() {
				if(IC.ika.getModel().hasAlly !== true)
					return;
				
				// Add the message link (workaround for ajaxHandlerCall).
				var ls_id		= IC.myGM.prefix + 'circularMessageLink';
				var ls_href		= '?view=sendIKMessage&msgType=51&allyId=' + IC.ika.getModel().avatarAllyId;
				var ls_title	= IC.Language.$('message.easyCircular.send');
				IC.myGM.addElement('div', ge_toolbar, {
					'id':			'circularMessageLinkWrapper',
					'innerHTML':	'<a id="' + ls_id + '" href="' + ls_href + '" title="' + ls_title + '" onclick="ajaxHandlerCall(this.href); return false;"></a>'
				});
				
				IC.myGM.addStyle(
					'#' + IC.myGM.prefix + 'circularMessageLink			{ height: 9px; width: 13px; margin: 0px !important; background: url("skin/interface/icon_send_message.png") repeat scroll 0 0 transparent; }\
					 #' + IC.myGM.prefix + 'circularMessageLink:hover	{ background-position: 0px -9px; }',
					'easyCircularMessage', true
				);
			};
			
			/**
			 * Remove the circular message link and style.
			 */
			var _lf_removeLink = function() {
				IC.myGM.removeElement(IC.myGM.$('#' + IC.myGM.prefix + 'circularMessageLinkWrapper'));
				IC.myGM.removeStyle('easyCircularMessage');
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_addEasyCircularMessageLink
			 *   If the user selected the checkbox to add signatures to messages.
			 */
			this.updateSettings = function(ib_addEasyCircularMessageLink) {
				if(ib_addEasyCircularMessageLink === true) {
					_lf_addLink();
					return;
				}
				
				_lf_removeLink();
			};
		};
		
		IC.Options.addWrapper('messages', IC.Language.$('messages.options.wrapperTitle'));
		
		// Replace urls.
		IC.Options.addCheckbox('replaceURL', 'messages', 1, true, IC.Language.$('message.options.replaceURL'), { changeCallback: _go_replaceURL.updateSettings });
		// Provide link for easy circular messages.
		IC.Options.addCheckbox('easyCircularMessage', 'messages', 1, true, IC.Language.$('message.options.easyCircularMessage'), { changeCallback: _go_easyCircularMessageLink.updateSettings });
		
		// Add a signature.
		IC.Options.addCheckbox('messageSignature', 'messages', 2, true, IC.Language.$('message.options.signature.use'), { changeCallback: _go_messageSignature.updateSettings });
		// Place the signature on top.
		IC.Options.addCheckbox('signaturePlacementTop', 'messages', 2, true, IC.Language.$('message.options.signature.placementTop'), {});
		
		// Define a global signature.
		IC.Options.addTextArea('globalSignature', 'messages', 3, '', IC.Language.$('message.options.signature.global'), {});
		
		// Use the server signature.
		IC.Options.addCheckbox('useServerSignature', 'messages', 4, false, IC.Language.$('message.options.signature.useServerSpecific'), { 'serverSpecific': true });
		// Define a server specific signature.
		IC.Options.addTextArea('serverSignature', 'messages', 4, '', IC.Language.$('message.options.signature.server'), { 'serverSpecific': true });
	})();