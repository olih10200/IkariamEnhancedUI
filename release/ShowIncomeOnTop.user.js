// ==UserScript==
// @name			Show Income On Top
// @description		Shows the actual income also on top of the site.
// @namespace		http://*.ikariam.*/*
// @author			TOBBE
// @version			1.06
//
// @include			http://*.ikariam.*/index.php?view=finances
//
// @exclude			http://board.ikariam.*/*
// @exclude			http://support.ikariam.*/*
// @exclude			http://support.*.ikariam.*/*
// 
// @history			1.06	Added: Own Script-Updater.
// @history			1.06	Fixed: Remove everything what refered to other Scripts.
// @history			1.05	Added: New Script-Updater - will be replaced by my own Updater in the next few days.
// @history			1.04	Fixed: Remove the Script-Updater (Because of the Problem with Greasemonkey-Scripts).
// @history			1.03	Fixed: Bug with , as seperator
// @history			1.03	Added: New style of update-panel
// @history			1.02	Fixed: Cleaned up code
// @history			1.02	Added: Income in 24h
// @history			1.01	Added: Update check
// @history			1.00	Initial release
// ==/UserScript==

// Version and Script-ID
var version = 1.06;
var scriptId = 74221;

// Check for Updates
checkForUpdates();

// Seperator ist an point or not
var point = true;

// Set the Style
setStyles();

// Start script
main();

// Main-function of the script.
function main() {
	var income = getIncome();
	
	var balance = document.getElementById('balance');
	
	incomeRow = balance.insertRow(1);
	incomeRow24h = balance.insertRow(2);
	
	createTableRow(new Array('+/-', '', '', formatToIkaNumber(income)), new Array('sigma', 'value res', 'value res', 'value res'), incomeRow);
	createTableRow(new Array('+/- in 24h', '', '', formatToIkaNumber(income * 24)), new Array('sigma', 'value res', 'value res', 'value res'), incomeRow24h);
}

// Returns the actual income.
function getIncome() {
	var hidden = document.getElementsByClassName('hidden');
	var txt = hidden[hidden.length - 1].innerHTML;

	if(txt.search(',') != -1) {
		txt = txt.replace(',', '');
		point = false;
	} else {
		txt = txt.replace('.', '');
	}

	return Number(txt);
}

// Formats a number to that format that is used in Ikariam.
function formatToIkaNumber(num) {
	num += '';

	if(point) {
		num = num.replace(/(\d)(?=(\d{3})+\b)/g,'$1.');
	} else {
		num = num.replace(/(\d)(?=(\d{3})+\b)/g,'$1,');
	}

	return num;
}

// Adds cells to an table row.
function createTableRow(cellText, cellClassName, row) {
	for(var i = 0; i < cellText.length; i++) {
		var cell = document.createElement('td');
		
		cell.innerHTML = cellText[i];
		cell.className = cellClassName[i];
		row.appendChild(cell);
	}
}

// Checks for Updates of the Script.
function checkForUpdates(){
	GM_xmlhttpRequest ({
		method: 'GET',
		url: 'http://userscripts.org/scripts/source/74221.meta.js',
		headers: {'User-agent': 'Mozilla/5.0', 'Accept': 'text/html'},
		onload: function (response) {
			var metadata = formatMetadata(response.responseText);

			if(version < metadata.version) {
				showUpdateInfo(metadata);
			}
		}
	});
}

// Formats the given Metadata.
function formatMetadata(metadataIn) {
	var metadataOut = new Array();
	var innerMeta = metadataIn.match(/\/\/ ==UserScript==((.|\n|\r)*?)\/\/ ==\/UserScript==/)[0];
	
	if(innerMeta) {
		var tags = innerMeta.match(/\/\/ @(.*?)(\n|\r)/g);
		
		for(var i = 0; i < tags.length; i++) {
			var tmp = tags[i].match(/\/\/ @(.*?)\s+(.*)/);
			
			if(!metadataOut[tmp[1]]) {
				metadataOut[tmp[1]] = new Array (tmp[2]);
				
			} else {
				metadataOut[tmp[1]].push(tmp[2]);
				
			}
		}
	}

	return metadataOut;
}

// Shows the Update information
function showUpdateInfo(metadata) {
	balance = document.getElementById('balance');
	
	updateRow = balance.insertRow(3);
	infoRow = balance.insertRow(4);
	
	var updateInfo = '<br><br>';
	
	for(var i = 0; i < metadata['history'].length; i++) {
		updateInfo += metadata['history'][i] + '<br><br>';
	}
	
	createTableRow(new Array('<u><a href="http://userscripts.org/scripts/show/74221">There is version ' + metadata.version + ' of Show Income On Top available.</a></u> You currently have version ' + version + ' installed.'), new Array('sigma'), updateRow);
	createTableRow(new Array(updateInfo), new Array('sigma'), infoRow);
}

// Sets the Styles that are used.
function setStyles() {
	// #ddb577 Dark
	// #fdf7dd Bright
	// #542c0f Font/Border
}