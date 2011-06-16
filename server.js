var connect = require('connect');
var browserify = require('dnode/node_modules/browserify');
//var browserify = require('browserify');
var dnode = require('dnode');
var	jsmin = require('jsmin');

var server = connect.createServer();

server.use(connect.static(__dirname));

server.use(browserify({
    require:	['dnode', {jquery: 'jquery-browserify'}],
    mount:		'/browserify.js',
    filter:		jsmin.jsmin,
	base:		__dirname + '/js',
    entry:		__dirname + '/entry.js'
}));

dnode(function (client) {
    this.cat = function (cb) {
        cb('meow');
    };
}).listen(server);

server.listen(6857);
console.log('http://localhost:6857/');
