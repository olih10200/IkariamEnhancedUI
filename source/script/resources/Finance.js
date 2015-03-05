// Functions for the finance popup.
	(function(){
		/**
		 * Some general functions for the finance view enhancements.
		 * 
		 * @type	{object}
		 */
		var _go_generalFunctions = new function() {
			/**
			 * Extract the current income in the finance popup.
			 * 
			 * @return	{int}
			 *   The current income.
			 */
			this.getIncome = function() {
				var le_incomeCell = IC.myGM.$$('.hidden')[IC.myGM.$$('.hidden').length - 1];
				
				while(le_incomeCell.firstChild.firstChild)
					le_incomeCell = le_incomeCell.firstChild;
				
				return IC.Ikariam.getInt(le_incomeCell.innerHTML);
			};
			
			/**
			 * Create a new table row.
			 * 
			 * @param	{element}	ie_parentTable
			 *   The table to add the row to.
			 * @param	{string[]}	ia_classes
			 *   The class(es) of the table row. Set to null if no class should be set.
			 * @param	{object[]}	ia_cells
			 *   The data for the table cells. Both properties of each cell are optional. If the cell object is empty, an empty cell is created.
			 *   Signature: <code>[{ className: ['class1', 'class2', ...], text: 'cellContent' }]</code>
			 * @param	{boolean}	ib_isTableHeadRow
			 *   If the cells should be table header cells (th).
			 * 
			 * @return	{element}
			 *   The created row.
			 */
			this.createTableRow = function(ie_parentTable, ia_classes, ia_cells, ib_isTableHeadRow) {
				var re_newRow	= IC.myGM.addElement('tr', ie_parentTable, { classes: ia_classes });
				var ls_cellType	= 'td';
				
				if(!!ib_isTableHeadRow)
					ls_cellType = 'th';
					
				for(var i = 0; i < ia_cells.length; i++) {
					var lo_options = {
						'classes':	ia_cells[i].className
					};
					
					if(!!ia_cells[i].text === true)
						lo_options['innerHTML'] = ia_cells[i].text;
						
					IC.myGM.addElement(ls_cellType, re_newRow, lo_options);
				}
				
				return re_newRow;
			};
		};
		
		/**
		 * Storage for the income on top functions.
		 * 
		 * @type	{object}
		 */
		var _go_incomeOnTop = new function() {
			/**
			 * Callback to show the income on top.
			 */
			var _lf_doShowIncomeOnTop = function() {
				var le_summaryTable	= IC.myGM.$('.table01');
				var li_income		= _go_generalFunctions.getIncome();
				
				var la_incomeCells = [
					{ className: ['sigma'], text: IC.Language.$('finance.income.perHour') },
					{ className: ['value', 'res'] },
					{ className: ['value', 'res'] },
					{ className: ['value', 'res'], text: IC.Ikariam.formatToIkaNumber(li_income) }
				];
				_go_generalFunctions.createTableRow(le_summaryTable, ['result', 'alt'], la_incomeCells);
				
				la_incomeCells[0].text = IC.Language.$('finance.income.perDay');
				la_incomeCells[3].text = IC.Ikariam.formatToIkaNumber(li_income * 24);
				_go_generalFunctions.createTableRow(le_summaryTable, ['result'], la_incomeCells);
				
				// Adjust the size of the Scrollbar.
				IC.ika.controller.adjustSizes();
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showIncomeOnTop
			 *   If the user selected the checkbox to show the income on top.
			 */
			this.updateSettings = function(ib_showIncomeOnTop) {
				if(ib_showIncomeOnTop === true) {
					IC.RefreshHandler.add('finances', 'showIncomeOnTop', _lf_doShowIncomeOnTop);
					return;
				}
				
				IC.RefreshHandler.remove('finances', 'showIncomeOnTop');
			};
		};
		
		/**
		 * Storage for the short upkeep reduction table functions.
		 * 
		 * @type	{object}
		 */
		var _go_shortUpkeepReductionTable = new function() {
			/**
			 * Extract the data from the old tables.
			 * 
			 * @param	{element[]}	ia_oldUpkeepReductionTables
			 *   The old upkeep tables to collapse.
			 *   
			 * @return	{object[]}
			 *   The data for the table rows.
			 *   Signature:
			 *   <code>[{
			 *     rows: [
			 *       { reason : 'reason', basicUpkeep: int, supplyUpkeep: int, result: int }
			 *     ]
			 *     priorToReduction: int
			 *     income: int
			 *   }]</code>
			 */
			var _lf_getData = function(ia_oldUpkeepReductionTables) {
				var ro_data = {
					rows:				[],
					priorToReduction:	IC.Ikariam.getInt(IC.myGM.$('td.hidden', ia_oldUpkeepReductionTables[2]).innerHTML),
					income:				_go_generalFunctions.getIncome()
				};
				
				// Get the data for the troops and ships redution rows.
				for(var i = 0; i < 3; i++) {
					var le_basicUpkeepCell	= IC.myGM.$$('.alt.bottomLine td.hidden, .result td.hidden', ia_oldUpkeepReductionTables[0])[i];
					var le_supplyUpkeepCell	= IC.myGM.$$('.alt.bottomLine td.hidden, .result td.hidden', ia_oldUpkeepReductionTables[1])[i];
					var li_basicUpkeep		= IC.Ikariam.getInt(le_basicUpkeepCell.innerHTML);
					var li_supplyUpkeep		= IC.Ikariam.getInt(le_supplyUpkeepCell.innerHTML);
					
					var lo_row = {
						reason:			IC.Language.$('finance.upkeep.reason.' + i),
						basicUpkeep:	li_basicUpkeep,
						supplyUpkeep:	li_supplyUpkeep,
						result:			li_basicUpkeep + li_supplyUpkeep
					};
					
					ro_data.rows.push(lo_row);
				}
				
				return ro_data;
			};
			
			/**
			 * Prepare the table rows for easy adding to the new table.
			 * 
			 * @param	{element[]}	ia_oldUpkeepReductionTables
			 *   The old upkeep tables to collapse.
			 *   
			 * @return	{object[]}
			 *   The data for the table rows.
			 *   Signature:
			 *   <code>[{
			 *     classes:		'class' || ['class1', 'class2', ...]
			 *     isHeadRow:	true || false
			 *     cells:	[
			 *       { className: 'class' || ['class1', 'class2', ...], text: 'cellContent' (optional) }
			 *     ]
			 *   }]</code>
			 */
			var _lf_prepareTableRows = function(ia_oldUpkeepReductionTables) {
				var lo_data = _lf_getData(ia_oldUpkeepReductionTables);
				var ra_tableRows = [];
				
				// Header
				ra_tableRows.push({
					classes:	[],
					isHeadRow:	true,
					cells:		[
						 { className: ['city'] },
						 { className: ['value', 'res'], text: IC.Language.$('finance.upkeep.basic') },
						 { className: ['value', 'res'], text: IC.Language.$('finance.upkeep.supply') },
						 { className: ['value', 'res'], text: IC.Language.$('finance.upkeep.result') }
					]
				});
				
				// Income without reduction
				ra_tableRows.push({
					classes:	['alt', 'bottomLine'],
					isHeadRow:	false,
					cells:		[
						{ className: ['city'], text: IC.Language.$('finance.income.start') },
						{ className: ['value', 'res'] },
						{ className: ['value', 'res'] },
						{ className: ['value', 'res'], text: IC.Ikariam.formatToIkaNumber(lo_data.priorToReduction) }
					]
				});
				
				// Income reduction
				lo_data.rows.forEach(function(io_row, ii_index) {
					var trClass = [];
					if(ii_index % 2 === 1)
						trClass = ['alt', 'bottomLine'];
					
					ra_tableRows.push({
						classes:	trClass,
						isHeadRow:	false,
						cells:		[
							{ className: ['city'],			text: io_row.reason },
							{ className: ['value', 'res'],	text: IC.Ikariam.formatToIkaNumber(-io_row.basicUpkeep) },
							{ className: ['value', 'res'],	text: IC.Ikariam.formatToIkaNumber(-io_row.supplyUpkeep) },
							{ className: ['hidden'],			text: IC.Ikariam.formatToIkaNumber(-io_row.result) }
						]
					});
				});
				
				// Result
				ra_tableRows.push({
					classes:	['result'],
					isHeadRow:	false,
					cells:		[
						{ className: ['sigma'], text: '<img alt="Summe" src="skin/layout/sigma.png">' },
						{ className: ['value', 'res'] },
						{ className: ['value', 'res'] },
						{ className: ['hidden'], text: IC.Ikariam.formatToIkaNumber(lo_data.income) }
					]
				});
				
				return ra_tableRows;
			};
			
			/**
			 * Create the new upkeep reduction table.
			 * 
			 * @param	{element[]}	ia_oldUpkeepReductionTables
			 *   The old upkeep tables.
			 */
			var _lf_createNewTable = function(ia_oldUpkeepReductionTables) {
				var le_shortTable	= IC.myGM.addElement('table', ia_oldUpkeepReductionTables[0].parentNode, { 
					'id':		'balance',
					'classes':	['table01', 'border', 'left']
				}, null, ia_oldUpkeepReductionTables[0]);
				
				var la_tableRows = _lf_prepareTableRows(ia_oldUpkeepReductionTables);
				
				la_tableRows.forEach(function(io_rowData) {
					_go_generalFunctions.createTableRow(le_shortTable, io_rowData.classes, io_rowData.cells, io_rowData.isHeadRow);
				});
				
				IC.myGM.addElement('hr', ia_oldUpkeepReductionTables[0].parentNode, {}, null, ia_oldUpkeepReductionTables[0]);
			};
			
			/**
			 * Toggle the status of an old upkeep table (collapsed / non-collapsed).
			 */
			var _lf_toggleUpkeepReductionTable = function() {
				IC.myGM.toggleShowHideButton(this);
				
				var la_rows = IC.myGM.$$('tr:not(:first-child)', this.parentNode.parentNode.parentNode);
				
				la_rows.forEach(function(ie_row) {
					ie_row.classList.toggle('invisible');
				});
				
				// Adjust the size of the Scrollbar.
				IC.ika.controller.adjustSizes();
			};
			
			/**
			 * Minimize the old upkeep tables and make them collapsable.
			 * 
			 * @param	{element[]}	ia_oldUpkeepReductionTables
			 *   The old upkeep tables to collapse.
			 */
			var _lf_minimizeOldTables = function(ia_oldUpkeepReductionTables) {
				for(var i = 0; i < ia_oldUpkeepReductionTables.length; i++) {
					var la_rows = IC.myGM.$$('tr', ia_oldUpkeepReductionTables[i]);
					
					la_rows.forEach(function(ie_row, ii_index) {
						if(ii_index !== 0)
							ie_row.classList.add('invisible');
					});
					
					var le_buttonParent	= IC.myGM.$('th', la_rows[0]);
					IC.myGM.addElement('div', le_buttonParent, {
						'class':	'maximizeImg',
						'style':	[['cssFloat', 'left']],
						'title':	IC.Language.$('general.expand'),
						'click':	_lf_toggleUpkeepReductionTable
					}, null, le_buttonParent.firstChild);
				}
			};
			
			/**
			 * Callback to show the short upkeep reduction table.
			 */
			var _lf_doShowShortTable = function() {
				var la_oldUpkeepReductionTables = IC.myGM.$$('.upkeepReductionTable');
				
				_lf_createNewTable(la_oldUpkeepReductionTables);
				_lf_minimizeOldTables(la_oldUpkeepReductionTables);
				
				// Adjust the size of the Scrollbar.
				IC.ika.controller.adjustSizes();
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showShortTable
			 *   If the user selected the checkbox to show the short upkeep reduction table.
			 */
			this.updateSettings = function(ib_showShortTable) {
				if(ib_showShortTable === true) {
					IC.RefreshHandler.add('finances', 'shortUpkeepReductionTable', function() { _lf_doShowShortTable(); });
					return;
				}
				
				IC.RefreshHandler.remove('finances', 'shortUpkeepReductionTable');
			};
		};
		
		// Show the income also on top in finance popup.
		IC.Options.addCheckbox('showIncomeOnTop', 'diverseOptions', 1, true, IC.Language.$('finance.options.showIncomeOnTop'), { changeCallback: _go_incomeOnTop.updateSettings });
		// Short overview upkeep reduction table in finance popup.
		IC.Options.addCheckbox('shortUpkeepReductionTable', 'diverseOptions', 1, true, IC.Language.$('finance.options.shortUpkeepReductionTable'), { changeCallback: _go_shortUpkeepReductionTable.updateSettings });
		// Add a divider line.
		IC.Options.addLine('diverseOptions', 1);
	})();