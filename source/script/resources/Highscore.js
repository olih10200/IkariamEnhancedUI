// Member information in highscore view.
	(function() {
		/**
		 * Storage for the member information functions.
		 * 
		 * @type	{object}
		 */
		var _go_memberInformation = new function() {
			/**
			 * Storage for the member data.
			 * 
			 * @type	{object}
			 */
			var _lo_data		= null;
			
			/**
			 * Key for the storage of the member information.
			 * 
			 * @type	{string}
			 */
			var _ls_dataKey	= '';
			
			/**
			 * Key for the storage of the last reset date.
			 * 
			 * @type	{string}
			 */
			var _ls_timeKey	= '';
			
			/**
			 * Show the data.
			 */
			var _lf_clickShow = function() {
				IC.myGM.setValue('memberInfo_infoLinkClicked', true);
				
				IC.myGM.$('#tab_highscore input[name="searchUser"]').value	= '';
				IC.myGM.$('#searchOnlyFriends').checked						= false;
				IC.myGM.$('#searchOnlyAllies').checked						= true;
				
				IC.myGM.$('#tab_highscore input[type="submit"]').click();
			};
			
			/**
			 * Reset the stored data.
			 */
			var _lf_clickReset = function() {
				IC.myGM.setValue(_ls_dataKey, _lo_data);
				IC.myGM.setValue(_ls_timeKey, (new Date).getTime());
				
				_lf_clickShow();
			};
			
			/**
			 * Add the button to show the data.
			 */
			var _lf_addShowButton = function() {
				var le_button = IC.myGM.addButton(IC.myGM.$('#tab_highscore .centerButton'), IC.Language.$('highscore.memberInformation.show'), _lf_clickShow, true);
				le_button.id = IC.myGM.prefix + 'showInfo';
			};
			
			/**
			 * Add the button to resset the stored data.
			 */
			var _lf_addResetButton = function() {
				var le_button = IC.myGM.addButton(IC.myGM.$('#tab_highscore .content p'), IC.Language.$('highscore.memberInformation.reset'), _lf_clickReset, true);
				le_button.id = IC.myGM.prefix + 'resetInfo';
			};
			
			/**
			 * Get the own data and show the differences to the last stored data.
			 * 
			 * @param	{object}	io_oldMemberInfo
			 *   The last stored data.
			 * 
			 * @return	{object}
			 *   The own data.
			 */
			var _lf_getOwnDataShowDifference = function(io_oldMemberInfo) {
				var le_ownRow = IC.myGM.$('table.highscore tr.own');
				var ro_ownData = {
					'place': IC.Ikariam.getInt(IC.myGM.$('.place', le_ownRow).innerHTML),
					'score': IC.Ikariam.getInt(IC.myGM.$('.score', le_ownRow).innerHTML)
				};
				
				var ls_placeDifference = '-';
				var ls_scoreDifference = '-';
				if(!!io_oldMemberInfo === true && !!io_oldMemberInfo['own'] === true) {
					ls_placeDifference = IC.Ikariam.formatToIkaNumber(io_oldMemberInfo['own']['place'] - ro_ownData['place'], true, true);
					ls_scoreDifference = IC.Ikariam.formatToIkaNumber(ro_ownData['score'] - io_oldMemberInfo['own']['score'], true, true);
				}
				
				IC.myGM.addElement('span', IC.myGM.$('.place', le_ownRow), { 'innerHTML': ls_placeDifference });
				IC.myGM.addElement('span', IC.myGM.$('.score', le_ownRow), { 'innerHTML': ls_scoreDifference });
				
				return ro_ownData;
			};
			
			/**
			 * Get the data and show the differences to the last stored data.
			 * 
			 * @return	{object}
			 *   The member data.
			 */
			var _lf_getDataShowDifference = function() {
				var ro_memberInfo		= {};
				var lo_oldMemberInfo	= IC.myGM.getValue(_ls_dataKey, null);
				var la_allyMemberRows	= IC.myGM.$$('table.highscore tr.ownally');
				
				la_allyMemberRows.forEach(function(ie_allyMemberRow) {
					var ls_actionLink	= IC.myGM.$('.action a', ie_allyMemberRow).href;
					var ls_memberId		= ls_actionLink.match(/receiverId=([0-9]*)/i)[1];
					
					ro_memberInfo[ls_memberId] = {
						'place': IC.Ikariam.getInt(IC.myGM.$('.place', ie_allyMemberRow).innerHTML),
						'score': IC.Ikariam.getInt(IC.myGM.$('.score', ie_allyMemberRow).innerHTML)
					};
					
					var ls_placeDifference = '-';
					var ls_scoreDifference = '-';
					if(!!lo_oldMemberInfo === true && !!lo_oldMemberInfo[ls_memberId] === true) {
						ls_placeDifference = IC.Ikariam.formatToIkaNumber(lo_oldMemberInfo[ls_memberId]['place'] - ro_memberInfo[ls_memberId]['place'], true, true);
						ls_scoreDifference = IC.Ikariam.formatToIkaNumber(ro_memberInfo[ls_memberId]['score'] - lo_oldMemberInfo[ls_memberId]['score'], true, true);
					}
					
					IC.myGM.addElement('span', IC.myGM.$('.place', ie_allyMemberRow), { 'innerHTML': ls_placeDifference });
					IC.myGM.addElement('span', IC.myGM.$('.score', ie_allyMemberRow), { 'innerHTML': ls_scoreDifference });
				});
				
				ro_memberInfo['own'] = _lf_getOwnDataShowDifference(lo_oldMemberInfo);
				
				return ro_memberInfo;
			};
			
			/**
			 * Add the span with the time of the last reset.
			 */
			var _lf_addLastResetTime = function() {
				var li_lastResetTime	= IC.myGM.getValue(_ls_timeKey, 0);
				var li_differenceInSec	= ((new Date()).getTime() - li_lastResetTime) / 1000;
				var ls_lastReset		= IC.Language.$('highscore.memberInformation.noReset');
				
				if(li_lastResetTime > 0) {
					var li_days	= Math.floor(li_differenceInSec / 86400);
					var li_hours	= Math.floor(li_differenceInSec / 3600);
					var li_minutes	= Math.floor(li_differenceInSec / 60);
					
					ls_lastReset = li_days + 'd ' + li_hours + 'h ' + li_minutes + 'min';
				}
				
				IC.myGM.addElement('span', IC.myGM.$('#tab_highscore .content p'), {
					'classes':		['bold', 'brown'],
					'innerHTML':	IC.Language.$('highscore.memberInformation.lastReset', [ls_lastReset])
				});
			};
			
			/**
			 * Prepare the highscore popup to show the data and show the data if requested.
			 */
			var _lf_doPreparePopup = function() {
				_ls_dataKey = IC.Ikariam.getServerCode + '_memberInfo_data_' + IC.myGM.getSelectValue('js_highscoreType', true, true);
				_ls_timeKey = IC.Ikariam.getServerCode + '_memberInfo_time_' + IC.myGM.getSelectValue('js_highscoreType', true, true);
				
				_lf_addShowButton();
				
				if(IC.myGM.getValue('memberInfo_infoLinkClicked', false) === true) {
					IC.myGM.deleteValue('memberInfo_infoLinkClicked');
					
					_lo_data = _lf_getDataShowDifference();
					_lf_addResetButton();
					_lf_addLastResetTime();
				}
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showMemberInformation
			 *   If the user selected the checkbox to show the member information.
			 */
			this.updateSettings = function(ib_showMemberInformation) {
				if(ib_showMemberInformation === true) {
					IC.RefreshHandler.add('highscore', 'memberInformation', _lf_doPreparePopup);
					IC.myGM.addStyle(
						'#' + IC.myGM.prefix + "resetInfo	{ float: right; margin-top: -6px; margin-right: 6px; } \
						 .highscore .score span				{ float: right; text-align: right; width: 70px; } \
						 .highscore .place span				{ float: right; text-align: right; width: 30px; } \
						 .highscore th:nth-child(4)			{ width: 30% !important; } \
						 .highscore th:nth-child(5)			{ width: 10% !important; } \
						 #tab_highscore	.centerButton		{ margin: 10px 0px; }",
						'memberInformation', true
					);
					return;
				}
				
				IC.RefreshHandler.remove('highscore', 'memberInformation');
				IC.myGM.removeStyle('memberInformation');
			};
		};
		
		// Show the member information.
		IC.Options.addCheckbox('showMemberInformation', 'diverseOptions', 1, false, IC.Language.$('highscore.options.showMemberInformation'), { changeCallback: _go_memberInformation.updateSettings });
	})();