/*
 * SpriteMate 1.1
 *
 * Mattias Johansson
 * Copyright 2016, Licensed GPL & MIT
 */

var MOS = MOS || {};
MOS.SpriteMate = function(data) {

    var that = this,
        defaultCode;

    that.target = data.target;
    that.delay = data.delay || 0;
    that.timeScale = data.timeScale || 1;
    that.poster = data.poster || '';
    that.speed = data.speed || 2;
    that.repeat = data.repeat || true;
    that.yoyo = data.yoyo || true;
    that.onReady = data.onReady || function() {};

    defaultCode = '<img style="width: 100%; height: auto; visibility: hidden;" class="sizeHelper" src="{{imgPath}}">' +
        '   <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-repeat: no-repeat; display: inline-block; overflow: hidden; background-size: 100%;" class="spriteInner">' +
        '	<img style="width: 100%;">' +
        '	</div>' +
        '</div>';

    that.tmpl = data.tmpl || defaultCode;
    that.spriteTarget = null;

    //if (that.repeat) {
        that.timeline = new TimelineMax({
            repeat: (that.repeat) ? - 1 : 0,
            yoyo: that.yoyo,
            onReverseComplete: function(tl) {

                console.log('onReverseComplete');

                if (that.bounce) {
                    //tl.reverse(1);
                } else {
                    //tl.reverse(0);
                }

            },
            onComplete: function(tl) {},
            onReverseCompleteParams: ['{self}']
        });
    // } else {
    //     that.timeline = new TimelineMax();
    // }

    that.data = data;
    that.sprite = {
        width: 0,
        height: 0
    };
    that.sprites = [];
    that.seqs = [];
    that.firstRun = true;
    //seqPath

    if (that.data.seqPath) {

        var rangeInfo = that.getRangeInfo(that.data.seqPath);
        //console.log(rangeInfo);

        var code = that.tmpl.split('{{imgPath}}').join(that.poster);
        that.target.html(code);
        that.spriteTarget = that.target.find('.spriteInner img');

        that.spriteTarget.attr('src', that.poster);
        that.target.find('.sizeHelper').attr('src', that.poster);

        $.getJSON(that.data.seqPath).done(function(response, status, XHR) {

            that.seqs = response.frames;

            var len = that.seqs.length,
                i,
                timePoint,
                add;

            add = function(index, timePoint) {

                timePoint += that.delay;

                that.timeline.add(function() {

                    var url = that.seqs[index];
                    if (url) {
                        that.spriteTarget.attr('src', url);
                    }

                }, timePoint);
            };

            if (that.firstRun) {
                that.spriteTarget.attr('src', that.seqs[0]);
                that.target.find('.sizeHelper').attr('src', that.seqs[0]);
                that.firstRun = false;
            }

            for (i = 0; i < len; i += 1) {
                timePoint = (i / (30 * 1));
                add(i, timePoint * that.speed);
            }

            that.timeline.stop();
            that.onReady();


        }).fail(function(XHR, status, error) {
        	console.log('Can\'t load JSON file.');
        });


    } else {

        that.zPad = that.getBetween(that.data.spritePath, '{', '}', 0);
        for (var i = that.data.from; i < that.data.to + 1; i += 1) {
            that.sprites.push({
    			path: that.data.spritePath.split('{' + that.zPad + '}').join(that.pad(i, that.zPad))
    		});
        }

        if (that.sprites.push.length > 0) {

            var code = that.tmpl.split('{{imgPath}}').join(that.sprites[0].path);
            that.target.html(code);
            that.spriteTarget = that.target.find('.spriteInner img');

            that.preloadImages(
                that.sprites,
                function(progress) {

                    if (that.firstRun) {
                        that.spriteTarget.attr('src', escape(that.sprites[0].path));
                        that.firstRun = false;
                    }

                },
                function() {

                    var len = that.sprites.length,
                        i,
                        timePoint,
                        add;

                    add = function(index, timePoint) {
    					timePoint += that.delay;

    					that.timeline.add(function() {
    						var url = that.sprites[index].dataURL || that.sprites[index].path;
    						that.spriteTarget.attr('src', url);
    					}, timePoint);
                    };

                    for (i = 0; i < len; i += 1) {
                        timePoint = (i / (30 * 1));
                        add(i, timePoint * that.speed);
                    }

                    that.timeline.stop();
                    that.onReady();
                }
            );

        }

    }


};

MOS.SpriteMate.prototype = {};

MOS.SpriteMate.prototype.play = function() {
    this.timeline.play();
};

MOS.SpriteMate.prototype.stop = function() {
    this.timeline.stop();
};

MOS.SpriteMate.prototype.progress = function(n) {

    this.timeline.stop();
    this.timeline.progress(n);

};

MOS.SpriteMate.prototype.pad = function(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
};

MOS.SpriteMate.prototype.getRangeInfo = function (str) {

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
		};
	}

	return rv;

};

MOS.SpriteMate.prototype.getBetween = function(str, start, end, index) {

    var arr = str.split(start),
        arr2, len = arr.length,
        i, curr, rv = [];

    for (i = 0; i < len; i += 1) {
        curr = arr[i];
        arr2 = curr.split(end);
        if (arr2.length === 2) {
            rv.push(arr2[0]);
        }
    }

    if (typeof(index) !== 'undefined' && rv[index]) return rv[index];
    else return rv;

};

MOS.SpriteMate.prototype.preloadImages = function(arrImages, oneLoaded, allLoaded) {

    var that = this;

    var uniqueImgpaths = [],
        count,
        loaded = 0,
        timers = [],
        progress = 0;

    count = arrImages.length;

    if (count === 0 && typeof allLoaded === 'function') {
        allLoaded();
    }

    var onLoaded = function(timedOut) {
        var $img = $(this);

        if (!that.sprite.width) {
            that.sprite.width = this.width;
            that.sprite.height = this.height;
        }

		var index = $img.data('index');
			imgObj = that.sprites[index];

		imgObj.index = index;

		var img = new Image();
		outputFormat = 'image/jpg';
	    img.crossOrigin = 'Anonymous';
		var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = $img[0].height;
        canvas.width = $img[0].width;
        ctx.drawImage($img[0], 0, 0);
		imgObj.dataURL = canvas.toDataURL(outputFormat);
        canvas = null;

        if (timedOut === true) {
            if (console.error) {
                console.error('PRELOAD TIMEOUT! Not found: ' + $img.attr('src'));
            }
        }

        clearTimeout($img.data('timeout'));
        loaded += 1;
        if (typeof oneLoaded === 'function') {
            progress = loaded / count;
            oneLoaded(progress);
        }
        if (loaded === count && typeof allLoaded === 'function') {
            allLoaded();
        }
    };

    var $imgTmp;
    $(arrImages).each(function(index) {

        $imgTmp = $('<img>');
        //Add a timer so we can timeout the wait for the loaeder if it takes to long or is missing.
        (function($img) {
            var tmOut = setTimeout(function() {
                onLoaded.apply($img, [true]);
            }, 5000);
            $img.data('timeout', tmOut);
        })($imgTmp);

		$imgTmp.data('index', index);
        $imgTmp.load(onLoaded);
        $imgTmp.attr('src', this.path);

    });

};
