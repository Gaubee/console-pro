const fs = require("fs");
const path = require("path");
function checkAndMakeDir(dirpath) {
	if (!(fs.existsSync(dirpath) && fs.lstatSync(dirpath).isDirectory())) {
		fs.mkdirSync(dirpath);
	}
}
exports.checkAndMakeDir = checkAndMakeDir;
function checkAndMakeDirs(base_path, rest_path) {
	base_path = path.resolve(base_path);
	const full_path = path.resolve(base_path, rest_path);
	rest_path = full_path.substr(base_path.length);
	const path_parts = rest_path.split(path.sep);
	var cur_path = base_path;
	for (let path_part of path_parts) {
		cur_path += path.sep + path_part;
		checkAndMakeDir(cur_path);
	}
}
exports.checkAndMakeDirs = checkAndMakeDirs;
