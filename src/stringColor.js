const colors = (exports.colors = require("colors"));
const color_flag_reg = (exports.color_flag_reg = /(\u001b\[\d+m)([\s\S]+?)(\u001b\[\d+m)/); //不以^开头，前面可能有空格

const TEXT_COLOR = ["yellow", "blue", "magenta", "cyan", "red", "green"];
function colorsHead(str, to_color) {
	return str.replace(/\[(.)+\]/, function(head) {
		if (!(to_color && colors[to_color])) {
			var _head = head.replace(/\s/g, "");
			to_color =
				TEXT_COLOR[
					(toCharCodeNumber(_head) % TEXT_COLOR.length +
						_head.length) %
						TEXT_COLOR.length
				];
		}
		return colors[to_color](head);
	});
}
exports.colorsHead = colorsHead;
function toCharCodeNumber(str) {
	var res = 0;
	for (var i = 0, len = str.length; i < len; i += 1) {
		res += str.charCodeAt(i);
	}
	return res;
}
// Color Symbol
const COLOR_ENUM = (exports.COLOR_ENUM = {});
const COLOR_MAP = (exports.COLOR_MAP = new Map());
Object.keys(colors.styles).filter(key => {
	var sym = (COLOR_ENUM[key] = Symbol(key));
	COLOR_MAP.set(sym, colors.styles[key]);
});
