// should i publish this as a npm module ?
// why not
// should be an full object
// - .match url

exports.readdir	= function(dirname){
	var baseNames	= []
	try {
		baseNames	= require('fs').readdirSync(dirname);
	}catch(e){}
	baseNames	= baseNames.filter(function(value){
		return value.match(/\.user\.js$/);
	});
	return baseNames;
}

exports.parsedir	= function(dirname){
	var baseNames	= exports.readdir(dirname);
	var results	= [];
	baseNames.forEach(function(baseName){
		var filename	= dirname+"/"+baseName;
		results.push({
			filename	: filename,
			meta		: exports.parseFile(filename)
		})
	})
	return results;
}

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
	var gmMeta	= {}
	matches.forEach(function(str){
		// FIXIT here there is a bug. it doesnt take the whole value if it contains space
		var matches	= str.match(/^\/\/ @(\S+)\s+(.+)$/)
		var key		= matches[1];
		var val		= matches[2];
		if( typeof gmMeta[key] === "undefined" ) gmMeta[key]	= [];
		gmMeta[key].push(val);
	})
	return gmMeta;	
}

/**
 * @return {Boolean} true if the url matches, false otherwise
*/
exports.matchUrl	= function(gmMeta, url){
}
