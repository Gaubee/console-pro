function escapeRegExp(string) {
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
exports.replaceAll = function replaceAll(string, find, replace) {
	return string.replace(new RegExp(escapeRegExp(find), "g"), replace);
};
