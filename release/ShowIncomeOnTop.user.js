// ==UserScript==
// @name			Show Income On Top
// @description		Shows the actual income also on top of the site.
// @namespace		http://*.ikariam.*/*
// @author			TOBBE
// @version			1.02
//
// @require			http://userscripts.org/scripts/source/57756.user.js
//
// @include			http://*.ikariam.*/index.php?view=finances
//
// @exclude			http://board.ikariam.*/*
// @exclude			http://support.ikariam.*/*
// @exclude			http://support.*.ikariam.*/*
//
// @history			1.02	Cleaned up code
// @history			1.02	Added Income in 24h
// @history			1.01	Added Update check
// @history			1.00	Initial release
// ==/UserScript==

// Update check
ScriptUpdater.check(74221, 1.02);

// Start script
main();

// Main-function of the script.
function main() {
	var income = getIncome();
	
	var balance = document.getElementById('balance');
	
	incomeRow = balance.insertRow(1);
	incomeRow24h = balance.insertRow(2);
	
	createTableRow(new Array("+/-", "", "", formatToIkaNumber(income)), new Array("sigma", "value res", "value res", "value res"), incomeRow);
	createTableRow(new Array("+/- in 24h", "", "", formatToIkaNumber(income * 24)), new Array("sigma", "value res", "value res", "value res"), incomeRow24h);
}

// Returns the actual income.
function getIncome() {
	var hidden = document.getElementsByClassName('hidden');
	
	return Number(hidden[hidden.length - 1].innerHTML.replace(".", ""));
}

// Formats a number to that format that is used in Ikariam.
function formatToIkaNumber(num) {
  num += "";
  num = num.replace(/(\d)(?=(\d{3})+\b)/g,"$1.");
  return num;
}

// Adds cells to an table row.
function createTableRow(cellText, cellClassName, row) {
	for(var i = 0; i < 4; i++) {
		var cell = document.createElement("td");
		var cell_Text = document.createTextNode(cellText[i]);
		
		cell.appendChild(cell_Text);
		cell.className = cellClassName[i];
		row.appendChild(cell);
	}
}