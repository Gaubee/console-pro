if (process.platform === "win32") {
	exports.infoSymbol = "〈i〉";
	exports.successSymbol = "〈√〉";
	exports.warnSymbol = "〈‼〉";
	exports.errorSymbol = "〈×〉";
} else {
	exports.infoSymbol = "ℹ";
	exports.successSymbol = "✔";
	exports.warnSymbol = "⚠";
	exports.errorSymbol = "✖";
}
