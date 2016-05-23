var connect = require('connect'),
	browserify = require('dnode/node_modules/browserify'),
	//browserify = require('browserify'),
	dnode = require('dnode'),
	eyes = require('eyes'),
	fs = require('fs'),
	jsmin = require('jsmin')
	nodeEventEmitter = require('events').EventEmitter,
	path = require('path'),
	util = require('util');

console.log('In Helium, __dirname=' + __dirname);


//============================================

//------------------------------
Helium = function (config) {
//------------------------------

	nodeEventEmitter.call(this);	// make this a Node EventEmitter
	
	this.flag = {
		isDebug:	false,
		isDevel:	false,
		isPublic:	true
	};
	this.htmlDir = '';
	this.myName = 'Entropy';
	this.responder = undefined;
	this.webConfig = undefined;
	this.webServer = undefined;
	this.init(config);
	return this;
};

// inherit from node's events.EventEmmiter
util.inherits(Helium, nodeEventEmitter);

//------------------------------
respondWithText = function (res, text) {
//------------------------------
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end(text);
};

//------------------------------
supplyFileAtPath = function (res, filePath) {
//------------------------------
	fs.readFile(filePath, 'utf8', function (err, data) {
		if (err) {
			res.writeHead(200, {"Content-Type": "text/plain"});
			res.end('Oops. Could not serve you: ' + pathToFile);
		} else {
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(data);
		}
	});
};

//------------------------------
startResponder = function (server) {
//------------------------------
	dnode(function (client, conn) {
		eyes.inspect(client, 'client:');
		eyes.inspect(conn, 'conn:');
		this.cat = function (cb) {
			cb('meow');
		};
		this.name = function (name, cb) {
			console.log('responder: name invoked; name=' + name);
			eyes.inspect(client, 'client:');
			cb('hello ' + name);
		};
		conn.on('ready', function () {
			console.log('connection ready for id=' + this.id);
			this.remote.someoneSays('system', 'hello');
		});
	}).listen(server);
};

//------------------------------
installWebServer = function () {
//------------------------------
	var	f, opts, s, server, serverConfig, skinDir, webConfig;
		
	webConfig = this.webConfig;
	
	serverConfig = this.serverConfig;
		
	server = connect.createServer();
	this.webServer = server;
	
	skinDir = webConfig.skinDir;
	
	s = serverConfig.logFormat;
	if (s) {
		if (typeof s !== 'string') {
			s = '';		// if config value is true but not a string, then use default
		}
		server.use(connect.logger(s));
	}
	
	s =  __dirname + '/web';
	server.use(connect['static'](s));	
		// odd invocation to appease JSLint because 'static' is a reserved word
	
	s = webConfig.favicon;	
	if (s) {
		s = path.join(skinDir, '/', s);
console.log('installWebServer: favicon ' + s);
		server.use(connect.favicon(s));
	}


	server.use(connect.router(function (app) {
		app.get('/config', function(req, res, next) {
			s = 'webConfig: ' + JSON.stringify(webConfig);
			respondWithText(res, s);
		});

	}));
	
	
	server.use(browserify({
	    require:	['dnode', {jquery: 'jquery-browserify'}],
	    mount:		'/browserify.js',
	    filter:		jsmin.jsmin,
		base:		__dirname + '/client-js',
	    entry:		__dirname + '/entry.js'
	}));

		
	return true;
};


//------------------------------
processConfig = function (config) {
//------------------------------

	var	flags, s;
		
	flags = this.flags;
	
	if (config.debug) {
		flags.isDebug = true;
	}
	
	if (config.type === 'devel') {
		flags.isDevel = true;
		flags.isPublic = false;
	} else if (config.type === 'public') {
		flags.isDevel = false;
		flags.isPublic = true;
	}
	
	s = config.logDir;
	if (s) {
		this.logDir = s;
	}
		
	s = config.name;
	if (s) {
		this.myName = s;
	}
	
	s = config.webConfig;
	if (s) {
		this.webConfig = s;
	}
	
	s = config.serverConfig;
	if (s) {
		this.serverConfig = s;
	}

};

//------------------------------
startWebServer = function () {
//------------------------------
	var	port, serverConfig;
		
	serverConfig = this.serverConfig;
	port = serverConfig.port || 8000;
console.log('startWebServer: port ' + port);
	
	this.webServer.listen(port, function() {
console.log('startWebServer: server is listening on port ' + port);
		this.emit('isListening', {name: this.name, port: this.port});
	});
};


//------------------------------
Helium.prototype.init = function (config) {
//------------------------------
	var	rez;

	processConfig.call(this, config);
	
	if (installWebServer.call(this)) {
console.log('Helium [' + this.myName + ']: WebServer installed');
//		this.webServer.listen();
//		installResponder.call(this, this.webServer.getHttpServer());
		startResponder(this.webServer);
		startWebServer.call(this)
		
		rez = true;
	} else {
		rez = false;
	}
	return rez;
};

//------------------------------
Helium.prototype.name = function () {
//------------------------------
	return this.myName;
};

//============================================

function helium (config) {	
	return new Helium(config);	
}

module.exports = helium;
