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
				var ls_signature = '';
				
				switch(IC.Options.getOption('messages', 'useMessageSignature')) {
					case IC.Options.SpecificityLevel.GLOBAL:
						ls_signature = IC.Options.getOption('messages', 'globalSignature');
					  break;
					
					case IC.Options.SpecificityLevel.SERVER:
						ls_signature = IC.Options.getOption('messages', 'serverSignature');
					  break;
					
					case IC.Options.SpecificityLevel.PLAYER:
						ls_signature = IC.Options.getOption('messages', 'playerSignature');
					  break;
				}
				
				if(ls_signature === '')
					return;
				
				var le_textarea = IC.myGM.$('#js_msgTextConfirm');
				
				var ls_text = le_textarea.value;
				
				if(IC.Options.getOption('messages', 'signaturePlacementTop'))
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
			this.updateSettings = function(is_useMessageSignature) {
				if(is_useMessageSignature === IC.Options.SpecificityLevel.GLOBAL
						|| is_useMessageSignature === IC.Options.SpecificityLevel.SERVER
						|| is_useMessageSignature === IC.Options.SpecificityLevel.PLAYER) {
					IC.RefreshHandler.add('sendIKMessage', 'addMessageSignature', _lf_addSignature);
					return;
				}
				
				IC.RefreshHandler.remove('sendIKMessage', 'addMessageSignature');
			};
		};
		
		IC.Options.addWrapper('messages', IC.Language.$('message.options.wrapperTitle'));
		
		// Replace urls.
		IC.Options.addCheckbox('replaceURL', 'messages', 1, true, IC.Language.$('message.options.replaceURL'), { changeCallback: _go_replaceURL.updateSettings });
		
		// Player specific signatures.
		var la_options = [
			{ value: 'none', label: IC.Language.$('message.options.signature.use.none') },
			{ value: IC.Options.SpecificityLevel.GLOBAL, label: IC.Language.$('message.options.signature.use.global') },
			{ value: IC.Options.SpecificityLevel.SERVER, label: IC.Language.$('message.options.signature.use.server') },
			{ value: IC.Options.SpecificityLevel.PLAYER, label: IC.Language.$('message.options.signature.use.player') }
		];
		IC.Options.addSelect('useMessageSignature', 'messages', 2, IC.Options.SpecificityLevel.GLOBAL, IC.Language.$('message.options.signature.use.description'), la_options, { changeCallback: _go_messageSignature.updateSettings, 'specificity': IC.Options.SpecificityLevel.PLAYER });
		
		// Place the signature on top.
		IC.Options.addCheckbox('signaturePlacementTop', 'messages', 2, true, IC.Language.$('message.options.signature.placementTop'), {});
		
		// Define a global signature.
		IC.Options.addTextArea('globalSignature', 'messages', 3, '', IC.Language.$('message.options.signature.global'), {});
		// Define a server specific signature.
		IC.Options.addTextArea('serverSignature', 'messages', 4, '', IC.Language.$('message.options.signature.server'), { 'specificity': IC.Options.SpecificityLevel.SERVER });
		// Define a server specific signature.
		IC.Options.addTextArea('playerSignature', 'messages', 4, '', IC.Language.$('message.options.signature.player'), { 'specificity': IC.Options.SpecificityLevel.PLAYER });
	})();