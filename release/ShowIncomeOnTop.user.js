// ==UserScript==
// @name			Show Income On Top
// @version			1.0.0
// @namespace		http://*.ikariam.*/*
// @description		Shows the actual income also on top of the site.
// @author			TOBBE
// @include			http://*.ikariam.*/index.php?view=finances
// @exclude			http://board.ikariam.*/*
// @exclude			http://support.ikariam.*/*
// @exclude			http://support.*.ikariam.*/*
// @history			1.0.0	First Version.
// ==/UserScript==

var hidden = document.getElementsByClassName('hidden');

var income = hidden[hidden.length - 1].innerHTML;

var balance = document.getElementById('balance');

incomeRow = balance.insertRow(1);

var cell1 = document.createElement("td");
var cell2 = document.createElement("td");
var cell3 = document.createElement("td");
var cell4 = document.createElement("td");

var cell1Text = document.createTextNode("+ / -");
var cell2Text = document.createTextNode("");
var cell3Text = document.createTextNode("");
var cell4Text = document.createTextNode(income);

cell1.appendChild(cell1Text);
cell1.appendChild(cell2Text);
cell1.appendChild(cell3Text);
cell4.appendChild(cell4Text);

cell1.className = "sigma";
cell2.className = "value res";
cell3.className = "value res";
cell4.className = "value res";

incomeRow.appendChild(cell1);
incomeRow.appendChild(cell2);
incomeRow.appendChild(cell3);
incomeRow.appendChild(cell4);