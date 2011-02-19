#!/usr/bin/env node

exports.parseFile	= function(filename){
	var data	= require('fs').readFileSync(filename).toString();
	return exports.parseData(data);
}

exports.parseData	= function(data){
	// FIXIT i dont like this unescaping
	var tmpStr	= data.replace(/\r/g, "\n").replace(/\n+/g, "\n");
	// FIXIT here the begining ==UserScript== and end ==/UserScript==
	// - should be tested... but i failed at multi line regexp
	var matches	= tmpStr.match(/^\/\/ @(\S+)\s+(.+)/gm)
	var gmOpts	= {}
	matches.forEach(function(str){
		// FIXIT here there is a bug. it doesnt take the whole value if it contains space
		var matches	= str.match(/^\/\/ @(\S+)\s+(.+)$/)
		var key		= matches[1];
		var val		= matches[2];
		if( typeof gmOpts[key] === "undefined" ) gmOpts[key]	= [];
		gmOpts[key].push(val);
	})
	return gmOpts;	
}
