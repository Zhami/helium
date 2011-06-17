var $ = require('jquery'),
	core = require('./core');

$(window).ready(function () {
	APP.name = prompt("What's your name?", "") || 'guest';  

	core.connect();
});


