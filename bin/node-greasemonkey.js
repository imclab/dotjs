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

exports.matchRule	= function(rule, url){
	// convert the rule into a js regexp
	var pattern	= "^"+rule;
	// - replace "." by "\."
	pattern	= pattern.replace(/\./g, '\\.')
	// - replace "*" by "\*"
	pattern	= pattern.replace(/\*/g, '.*')
	// return true if the url matches the pattern, false otherwise	
	return url.match(pattern) !== null;
}

/**
 * @return {Boolean} true if the url matches, false otherwise
*/
exports.matchUrl	= function(gmScript, url){
	// if a exclude rule matches, return false
	if( gmScript.meta.exclude ){
		for(var i = 0; i < gmScript.meta.exclude.length; i++){
			var rule	= gmScript.meta.exclude[i];
			if( exports.matchRule(rule, url) ){
				return false;
			}
		}
	}
	// if a include rule matches, return true
	if( gmScript.meta.include ){
		for(var i = 0; i < gmScript.meta.include.length; i++){
			var rule	= gmScript.meta.include[i];
			if( exports.matchRule(rule, url) ){
				return true;
			}
		}
	}else{
		// if there are no include rule, return true
		return true;
	}
	// if this point is reached, return false
	return false;
}
