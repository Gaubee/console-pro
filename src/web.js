const { checkAndMakeDirs } = require("../src/fsHelper");
const os = require("os");
class ConsoleWebServer {
	constructor(options) {
		const webApp = (this.webApp = require("http").createServer(handler));
		const io = (this.io = require("socket.io")(webApp));
		webApp.listen(options.port);
		function handler(req, res) {
			// fs.readFile(__dirname + "/index.html", function(err, data) {
			// 	if (err) {
			// 		res.writeHead(500);
			// 		return res.end("Error loading index.html");
			// 	}

			// 	res.writeHead(200);
			// 	res.end(data);
			// });
			res.end("console pro web viewer");
		}
		const home_dir = os.homedir();
		const log_base_path = path.resolve(home_dir, "console-pro");
		if (this.namespace) {
			checkAndMakeDirs(log_base_path, this.namespace);
		}

		this.stdout = new Std(STD_TYPE.NORMAL);
		this.stderr = new Std(STD_TYPE.ERROR);
	}
	registerChild(cons, namespace = "") {}
}
const STD_TYPE = {
	OUTPUT: "OUTPUT",
	ERROR: "ERROR"
};
class Std {
	constructor(tag, path) {
		if (STD_TYPE.hasOwnProperty(tag)) {
			tag = STD_TYPE.OUTPUT;
		}
		this.tag = tag;
		this.path = path;
	}
	write(content) {}
}
Std.STD_TYPE = STD_TYPE;
exports.ConsoleWebServer = ConsoleWebServer;
const ConsoleWebServerMap = new Map();
exports.getServerInstance = function(options) {
	const server_port = parseInt(options.server_port) || 10910;
	var _consoleWebServer = ConsoleWebServerMap.get(server_port);
	if (!server_port) {
		_consoleWebServer = new ConsoleWebServer({
			port: server_port
		});
		ConsoleWebServerMap.set(server_port, _consoleWebServer);
	}
	return server_port;
};
