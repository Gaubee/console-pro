const colors = (exports.colors = require("colors"));
const color_flag_reg = (exports.color_flag_reg = /((\u001b\[\d+m)+)([\s\S]+?)((\u001b\[\d+m)+)/); //不以^开头，前面可能有空格

const COLOR_STYLES = Object.assign({}, colors.styles);
const TEXT_COLOR_WITHOUT_BG = (exports.TEXT_COLOR_WITHOUT_BG = [
	"yellow",
	"blue",
	"magenta",
	"cyan",
	"red",
	"green"
]);
const TEXT_COLOR_WITH_BG = (exports.TEXT_COLOR_WITH_BG = (() => {
	const bg_text_map = {
		bgBlack: [
			"yellow",
			"blue",
			"magenta",
			"cyan",
			"red",
			"green",
			"white",
			"gray"
		],
		// bgRed: [
		// 	"black",
		// 	"green",
		// 	"yellow",
		// 	"blue",
		// 	"magenta",
		// 	"cyan",
		// 	"white",
		// 	"gray"
		// ],
		bgGreen: [
			"black",
			"red",
			// "yellow",
			"blue",
			"magenta",
			"cyan",
			"white"
			// "gray"
		],
		bgYellow: [
			"black",
			"red",
			// "green",
			"blue",
			"magenta",
			"cyan",
			// "white",
			"gray"
		],
		bgBlue: [
			"black",
			"red",
			"green",
			"yellow",
			// "magenta",
			// "cyan",
			"white",
			// "gray"
		],
		bgMagenta: [
			"black",
			"red",
			"green",
			"yellow",
			"blue",
			// "cyan",
			"white"
			// "gray"
		],
		bgCyan: [
			"black",
			"red",
			"green",
			"yellow",
			// "blue",
			// "magenta",
			"white"
			// "gray"
		],
		bgWhite: [
			"black",
			"red",
			"green",
			// "yellow",
			"blue",
			"magenta",
			"cyan",
			// "gray"
		]
	};
	const res = [];
	for (var bgKey in bg_text_map) {
		const bgColor = COLOR_STYLES[bgKey];
		bg_text_map[bgKey].forEach(textKey => {
			const textColor = COLOR_STYLES[textKey];
			const mixKey = bgKey + "-" + textKey;
			COLOR_STYLES[mixKey] = {
				open: bgColor.open + textColor.open,
				close: bgColor.close + textColor.close
			};
			res.push(mixKey);
		});
	}
	return res;
})());

const TEXT_COLOR = TEXT_COLOR_WITHOUT_BG.concat(TEXT_COLOR_WITH_BG);
// TEXT_COLOR.forEach(colorKey => {
// 	const color = COLOR_STYLES[colorKey];
// 	if (!color) {
// 		console.log("NONE!!", colorKey);
// 	} else {
// 		console.log(color.open + "colorKey" + color.close);
// 	}
// });
function colorsHead(str, to_color, colorList = TEXT_COLOR) {
	return str.replace(/\[(.)+\]/, function(head) {
		if (!(to_color && COLOR_STYLES.hasOwnProperty(color_style))) {
			var _head = head.replace(/\s/g, "");
			to_color =
				colorList[
					(toCharCodeNumber(_head) % colorList.length +
						_head.length) %
						colorList.length
				];
		}
		const color_style = COLOR_STYLES[to_color];
		return color_style.open + head + color_style.close; //+COLOR_STYLES.reset.open+COLOR_STYLES.reset.close;
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

const text_colors = [
	["black", "Black"],
	["red", "Red"],
	["green", "Green"],
	["yellow", "Yellow"],
	["blue", "Blue"],
	["magenta", "Magenta"],
	["cyan", "Cyan"],
	["white", "White"],
	["gray", "Gray"],
	["grey", "Grey"]
];
// Color Symbol
const COLOR_ENUM = (exports.COLOR_ENUM = {});
const COLOR_MAP = (exports.COLOR_MAP = new Map());
Object.keys(colors.styles).filter(key => {
	const sym = (COLOR_ENUM[key] = Symbol(key));
	const colorStyle = colors.styles[key];
	COLOR_MAP.set(sym, colorStyle);
	if (key.startsWith("bg") || key.endsWith("BG")) {
		text_colors.forEach(textKeys => {
			const [textKey, subKey] = textKeys;
			const bgKeyWithText = key + "With" + subKey;
			var sym = (COLOR_ENUM[bgKeyWithText] = Symbol(bgKeyWithText));
			const textColorStyle = colors.styles[textKey];
			COLOR_MAP.set(sym, {
				open: colorStyle.open + textColorStyle.open,
				close: colorStyle.close + textColorStyle.close
			});
		});
	}
});
