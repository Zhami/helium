var dnode = require('dnode');
var $ = require('jquery');

module.exports.connect = function () {
	dnode.connect(function (remote, conn) {
		remote.cat(function (says) {
	    	$('#says').text(says);
		});
	});
}
