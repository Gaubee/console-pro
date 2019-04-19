import chalk from "chalk";
// export const chalk = require("chalk");
export const color_flag_reg = /((\u001b\[\d+m)+)([\s\S]+?)((\u001b\[\d+m)+)/; //不以^开头，前面可能有空格

const COLOR_STYLES: {
  [key: string]: {
    open: string;
    close: string;
  };
} = {
  reset: { open: "\u001b[0m", close: "\u001b[0m" },
  bold: { open: "\u001b[1m", close: "\u001b[22m" },
  dim: { open: "\u001b[2m", close: "\u001b[22m" },
  italic: { open: "\u001b[3m", close: "\u001b[23m" },
  underline: { open: "\u001b[4m", close: "\u001b[24m" },
  inverse: { open: "\u001b[7m", close: "\u001b[27m" },
  hidden: { open: "\u001b[8m", close: "\u001b[28m" },
  strikethrough: { open: "\u001b[9m", close: "\u001b[29m" },
  black: { open: "\u001b[30m", close: "\u001b[39m" },
  red: { open: "\u001b[31m", close: "\u001b[39m" },
  green: { open: "\u001b[32m", close: "\u001b[39m" },
  yellow: { open: "\u001b[33m", close: "\u001b[39m" },
  blue: { open: "\u001b[34m", close: "\u001b[39m" },
  magenta: { open: "\u001b[35m", close: "\u001b[39m" },
  cyan: { open: "\u001b[36m", close: "\u001b[39m" },
  white: { open: "\u001b[37m", close: "\u001b[39m" },
  gray: { open: "\u001b[90m", close: "\u001b[39m" },
  grey: { open: "\u001b[90m", close: "\u001b[39m" },
  bgBlack: { open: "\u001b[40m", close: "\u001b[49m" },
  bgRed: { open: "\u001b[41m", close: "\u001b[49m" },
  bgGreen: { open: "\u001b[42m", close: "\u001b[49m" },
  bgYellow: { open: "\u001b[43m", close: "\u001b[49m" },
  bgBlue: { open: "\u001b[44m", close: "\u001b[49m" },
  bgMagenta: { open: "\u001b[45m", close: "\u001b[49m" },
  bgCyan: { open: "\u001b[46m", close: "\u001b[49m" },
  bgWhite: { open: "\u001b[47m", close: "\u001b[49m" },
  blackBG: { open: "\u001b[40m", close: "\u001b[49m" },
  redBG: { open: "\u001b[41m", close: "\u001b[49m" },
  greenBG: { open: "\u001b[42m", close: "\u001b[49m" },
  yellowBG: { open: "\u001b[43m", close: "\u001b[49m" },
  blueBG: { open: "\u001b[44m", close: "\u001b[49m" },
  magentaBG: { open: "\u001b[45m", close: "\u001b[49m" },
  cyanBG: { open: "\u001b[46m", close: "\u001b[49m" },
  whiteBG: { open: "\u001b[47m", close: "\u001b[49m" }
};
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
      "white"
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
      "cyan"
      // "gray"
    ]
  };
  const res: string[] = [];
  for (const bgKey in bg_text_map) {
    const bgColor = COLOR_STYLES[bgKey];
    (bg_text_map as any)[bgKey].forEach((textKey: string) => {
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
export function colorsHead(
  str: string,
  to_color: string,
  colorList = TEXT_COLOR
) {
  return str.replace(/\[(.)+\]/, function(head) {
    if (!(to_color && COLOR_STYLES.hasOwnProperty(to_color))) {
      var _head = head.replace(/\s/g, "");
      to_color =
        colorList[
          ((toCharCodeNumber(_head) % colorList.length) + _head.length) %
            colorList.length
        ];
    }
    const color_style = COLOR_STYLES[to_color];
    return color_style.open + head + color_style.close; //+COLOR_STYLES.reset.open+COLOR_STYLES.reset.close;
  });
}

function toCharCodeNumber(str: string) {
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
export const COLOR_ENUM: { [key: string]: symbol } = {};
export const COLOR_MAP = new Map();
Object.keys(COLOR_STYLES).filter(key => {
  const sym = (COLOR_ENUM[key] = Symbol(key));
  const colorStyle = COLOR_STYLES[key];
  COLOR_MAP.set(sym, colorStyle);
  if (key.startsWith("bg") || key.endsWith("BG")) {
    text_colors.forEach(textKeys => {
      const [textKey, subKey] = textKeys;
      const bgKeyWithText = key + "With" + subKey;
      var sym = (COLOR_ENUM[bgKeyWithText] = Symbol(bgKeyWithText));
      const textColorStyle = COLOR_STYLES[textKey];
      COLOR_MAP.set(sym, {
        open: colorStyle.open + textColorStyle.open,
        close: colorStyle.close + textColorStyle.close
      });
    });
  }
});
