var fs = require('fs'),
    util = require('util'),
    mime = require('mime'),
    path = require('path'),
    VerEx = require('verbal-expressions');

function base64Img(src) {
    var data = fs.readFileSync(src).toString('base64');
    return util.format('data:%s;base64,%s', mime.lookup(src), data);
}

function getRangeInfo (str) {

	//https://github.com/VerbalExpressions/JSVerbalExpressions/wiki
	var hasBrackets = VerEx().then('[').anything().then(']'),
		result = str.match(hasBrackets),
		range,
		zeroPadding,
		startVal,
		endVal,
		rv = null;

	if (result) {
		range = result[0].substr(1, result[0].length - 2).split('-');
		rv = {
			pattern: str.split('[' + range[0] + '-' + range[1] + ']').join('[replaceMe]'),
			zeroPadding: range[0].length,
			startValString: range[0],
			endValString: range[1],
			startVal: parseInt(range[0]),
			endVal: parseInt(range[1]),
            dirname: path.dirname(str),
            ext: path.extname(str)
		};
	}

	return rv;

}

function padDigits(number, digits) {
	return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

function base64Img(src) {
    var data = fs.readFileSync(src).toString('base64');
    return util.format('data:%s;base64,%s', mime.lookup(src), data);
}

if(process.argv.length > 2) {

    var pathPattern = process.argv[2],
        rangeInfo = getRangeInfo(pathPattern),
        len,
        outputFile,
        framesImg = [],
        imgPath,
        b64;

    if (getRangeInfo) {

        len =  rangeInfo.endVal - rangeInfo.startVal;

        for (var i = 0; i < len + 1; i++) {
            imgPath = rangeInfo.pattern.split('[replaceMe]').join(padDigits(i, rangeInfo.zeroPadding));
            b64 = base64Img(imgPath);
            framesImg.push(b64);
        }

        outputFile = pathPattern.split(rangeInfo.ext).join('.seq');

        var json = {
            frames: framesImg
        };

        fs.writeFile(outputFile, JSON.stringify(json), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('Completed!');
            }
        });

    } else {
        console.error('Image path pattern unvalide, Use this form: seqs/mySequence_[00000-00002].png');
    }


} else {
    console.error('Not enough parameters supplied!');
}


/**

    Usage:
    node app.js seqs/keySeq/Volvo_Luxury_Keyfob_[00000-00015].png
    node app.js seqs/keySeq/Volvo_Luxury_Keyfob_[00000-00002].png

**/
