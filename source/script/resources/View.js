// General functions to enhance the view.
	(function() {
		IC.Options.addWrapper('enhancedView', IC.Language.$('view.options.wrapperTitle'));
		
		// Move the loading circle to the breadcrumb area.
		IC.Options.addCheckbox('moveLoadingCircle', 'enhancedView', 1, true, IC.Language.$('view.options.moveLoadingCircle'), {
			changeCallback: function(ib_newValue) {
				if(ib_newValue === true) {
					IC.myGM.addStyle(
						'#js_worldBread		{ margin-left: 16px !important; } \
						 #loadingPreview	{ transform: scale(0.5); -webkit-transform: scale(0.5); left: 35px !important; top: 141px !important; }',
						'enhancedView_moveLoadingCircle'
					);
					return;
				}
				
				IC.myGM.removeStyle('enhancedView_moveLoadingCircle');
			}
		});
		
		// Hide the flying bird swarm.
		IC.Options.addCheckbox('hideBirds', 'enhancedView', 1, true, IC.Language.$('view.options.hideBirds'), {
			changeCallback: function(ib_newValue) {
				if(ib_newValue === true) {
					IC.myGM.addStyle(
						'.bird_swarm	{ display: none; }',
						'enhancedView_hideBirds'
					);
					return;
				}
				
				IC.myGM.removeStyle('enhancedView_hideBirds');
			}
		});
		
		// Bind the town name and date to the top of the row in the town advisor.
		IC.Options.addCheckbox('noVerticalCenterInTownAdvisor', 'enhancedView', 1, true, IC.Language.$('view.options.noVerticalCenterInTownAdvisor'), {
			changeCallback: function(ib_newValue) {
				if(ib_newValue === true) {
					IC.myGM.addStyle(
						'#inboxCity td	{ vertical-align: top !important; }',
						'enhancedView_noVerticalCenterInTownAdvisor'
					);
					return;
				}
				
				IC.myGM.removeStyle('enhancedView_noVerticalCenterInTownAdvisor');
			}
		});
	})();