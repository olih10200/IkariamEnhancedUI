// ==UserScript==
// @name			Show Income On Top
// @description		Shows the actual income also on top of the site.
// @namespace		http://*.ikariam.*/*
// @author			TOBBE
// @version			1.05
//
// @require			http://www.betawarriors.com/bin/gm/57756user.js
//
// @include			http://*.ikariam.*/index.php?view=finances
//
// @exclude			http://board.ikariam.*/*
// @exclude			http://support.ikariam.*/*
// @exclude			http://support.*.ikariam.*/*
// 
// @history			1.05	Added new Script Updater - will be replaced by my own Updater in the next few days.
// @history			1.04	Fixed: Due to the Problem with Greasemonkey-Scripts I remove the Script-Updater. It has been written by the same guy who probably has written the infected Script.
// @history			1.03	Fixed: Bug with , as seperator
// @history			1.03	Added: New style of update-panel
// @history			1.02	Fixed: Cleaned up code
// @history			1.02	Added: Income in 24h
// @history			1.01	Added: Update check
// @history			1.00	Initial release
// ==/UserScript==

// Version and Script-ID
var version = 1.05;
var scriptId = 74221;

// Seperator ist an point or not
var point = true;

// Set the Style
setStyles();

// Check for Updates
ScriptUpdater.check(scriptId, version);

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

function setStyles() {
	// #ddb577 Dark
	// #fdf7dd Bright
	// #542c0f Font/Border
	
	GM_addStyle(
			"#ScriptUpdater74221Mask { position:fixed !important; } \
			#ScriptUpdater74221Body { position:fixed !important; background-color:#fdf7dd !important; border:#542c0f !important; color:#542c0f !important; } \
			#ScriptUpdater74221Body h1 { background-color:#ddb577 !important; -moz-border-radius:5px !important;}"
	);
}