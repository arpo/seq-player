/**
 * LBI
 * @version 0.1
 * @author http://www.lbi.com/se/
 * @copyright LBI 2016
*/

var NIBS = window.NIBS || {};
NIBS.main = (function () {

	var c = (console) ? console : {log: function () {}}; c.l = c.log;

	///////////////////////////////////////////////////////////////////////
	// Private methods & properties
	///////////////////////////////////////////////////////////////////////

	var _anim1;

	function _init () {

		//var path = 'assets/img/plunge_290px/Plunge milling_{5}.png';
		//var path = 'assets/img/GC1130_290px/GC1130_{5}.png';
		//var path = 'assets/img/key_slot_290px/Key slot milling_{5}.png';

		// var path = 'assets/img/seq/volvo_key{4}.png';
		// _anim1 = new MOS.SpriteMate({
		// 	target: $('.animCont1'),
		// 	spritePath: path, //Here index will be inserted with 5 digits ex 00004
		// 	from: 1,
		// 	to: 21,
		// 	onReady: function () {
		// 		//this.stop();
		// 		//_anim1.progress(0.76);
		// 		_anim1.play();
		// 	}
		// });

		var path = '../seqs/keySeq/Volvo_Luxury_Keyfob_[00000-00015].seq';

		_anim1 = new MOS.SpriteMate({
			target: $('.animCont1'),
			seqPath: path,
			poster: '../seqs/keySeq/Volvo_Luxury_Keyfob_00000.jpg',
			onReady: function () {
				//this.stop();
				//_anim1.progress(0.76);
				_anim1.play();
			}
		});


	}

	function _setProgress(val) {
		_anim1.progress(val);
	}

	///////////////////////////////////////////////////////////////////////
	// Public methods & properties
	///////////////////////////////////////////////////////////////////////
	return {
		init: _init,
		setProgress: _setProgress
	};
}());
