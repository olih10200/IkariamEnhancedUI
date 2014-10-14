// ==UserScript==
// @name			Show Income On Top
// @description		Shows the actual income also on top of the site.
// @namespace		http://*.ikariam.*/*
// @author			TOBBE
// @version			1.04
//
// @include			http://*.ikariam.*/index.php?view=finances
//
// @exclude			http://board.ikariam.*/*
// @exclude			http://support.ikariam.*/*
// @exclude			http://support.*.ikariam.*/*
//
// @history			1.04	Fixed: Because of the Problem with Greasemonkey-Scripts I remove the Script-Updater. It has been written by the same guy who has written the infected Script.
// @history			1.03	Fixed: Bug with , as seperator
// @history			1.03	Added: New style of update-panel
// @history			1.02	Fixed: Cleaned up code
// @history			1.02	Added: Income in 24h
// @history			1.01	Added: Update check
// @history			1.00	Initial release
// ==/UserScript==

// Seperator ist an point or not
var point = true;

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
	var txt = hidden[hidden.length - 1].innerHTML;

	if(txt.search(",") != -1) {
		txt = txt.replace(",", "");
		point = false;
	} else {
		txt = txt.replace(".", "");
	}

	return Number(txt);
}

// Formats a number to that format that is used in Ikariam.
function formatToIkaNumber(num) {
	num += "";

	if(point) {
		num = num.replace(/(\d)(?=(\d{3})+\b)/g,"$1.");
	} else {
		num = num.replace(/(\d)(?=(\d{3})+\b)/g,"$1,");
	}

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