var $ = require('jquery'),
	dnode = require('dnode');


module.exports.connect = function () {
	dnode({
		someoneSays: function (name, msg) {
			console.log('someoneSays: [' + name + ']: ' + msg);
	    	$('#says').text(msg);
			console.log('someoneSays: this=', this);
		}
	}).connect(function (remote, conn) {
		console.log('connected with id=' + conn.id);
		console.log('remote=' + JSON.stringify(remote));
//		remote.cat(function (says) {
//	    	$('#says').text(says);
//		});
		conn.on('ready', function () {
			console.log('connection ready...');
			remote.name(APP.name, function (says) {
		    	$('#says').text(says);
			});
		});
	});
}
