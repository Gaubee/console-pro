/* @flow */
const _console = global.console;
const _log = _console.log;
const gq_config = process.gq_config || {};
const util = require("util");
const {
	colors,
	color_flag_reg,
	colorsHead,
	colorsHeadWithBG,
	COLOR_ENUM,
	COLOR_MAP,
	TEXT_COLOR_WITHOUT_BG,
	TEXT_COLOR_WITH_BG
} = require("./stringColor");
const { replaceAll } = require("./replaceAll");
const { dateFormat } = require("./dateFormat");
const {
	infoSymbol,
	successSymbol,
	warnSymbol,
	errorSymbol
} = require("./specialSymbol");
const coloredInfoSymbol = colors.underline(colors.blue(infoSymbol));
const coloredSuccessSymbol = colors.underline(colors.green(successSymbol));
const coloredWarnSymbol = colors.underline(colors.yellow(warnSymbol));
const coloredErrorSymbol = colors.underline(colors.red(errorSymbol));

const TIMEEND_FIRST_ARGUMENT_TYPE_ERROR =
	".timeEnd's first arguments must a Symbol from .time";
const GROUPEND_FIRST_ARGUMENT_TYPE_ERROR =
	".groupEnd's first arguments must a Symbol from .group";
class Console {
	constructor(options = {}) {
		this.before = [];
		this.beforeSymbol = [];
		this.date_format = "hh:mm:ss MM-DD";
		this.timeMap = {};

		const config = (this.config = options);
		if (config.async_log) {
			this._console_log = args => {
				process.nextTick(() => {
					_console.log(...args);
				});
			};
			this._console_info = args => {
				process.nextTick(() => {
					_console.info(...args);
				});
			};
			this._console_debug = args => {
				process.nextTick(() => {
					_console.debug(...args);
				});
			};
			this._console_warn = args => {
				process.nextTick(() => {
					_console.warn(...args);
				});
			};
			this._console_error = args => {
				process.nextTick(() => {
					_console.error(...args);
				});
			};
			this._console_assert = args => {
				process.nextTick(() => {
					_console.assert(...args);
				});
			};
			this._console_trace = args => {
				process.nextTick(() => {
					_console.trace(...args);
				});
			};
		} else {
			this._console_log = args => _console.log(...args);
			this._console_info = args => _console.info(...args);
			this._console_debug = args => _console.debug(...args);
			this._console_warn = args => _console.warn(...args);
			this._console_error = args => _console.error(...args);
			this.assert = _console.assert;
			this.trace = _console.trace;
		}
	}
	getBeforeForNewLine() {
		if (this.config.auto_reduce_indent) {
			var reduce_indent_set = (this.__reduce_indent_set = []);
			var new_before = this.before.slice().map((char, i) => {
				if (char.startsWith("  ") && char.includes("│")) {
					//两个空格以上才进行缩进减少，多个空格合成一个
					return char
						.replace(/^\s+/, function(match_str) {
							reduce_indent_set[i] = match_str.length - 1;
							return "";
						})
						.replace(
							"│",
							"┌" + "─".repeat(reduce_indent_set[i]) + "┘"
						);
				} else {
					reduce_indent_set[i] = 0;
				}
				return char;
			});
			return new_before;
			// return this.before.filter(char => {
			// 	if (char === " ") {
			// 		reduce_indent += 1;
			// 		return reduce_indent == 1;
			// 	} else if (reduce_indent) {
			// 		if (char.indexOf("│") !== -1) {
			// 			char.replace("│", "─".repeat(reduce_indent) + "┘");
			// 		}
			// 		reduce_indent = 1;
			// 	}
			// 	return true;
			// });
		}
		return this.before;
	}
	coverBeforeForNewLine() {
		if (this.config.auto_reduce_indent) {
			var reduce_indent_set = this.__reduce_indent_set;
			this.__reduce_indent_set = null;
			var new_before = this.before.slice();
			for (var i = 0; i < new_before.length; i += 1) {
				var cur_char_reduce_indent = reduce_indent_set[i];
				if (cur_char_reduce_indent) {
					new_before[i] = new_before[i].replace(/┌─*┘/, "│");
					if (new_before[i + 1]) {
						new_before[i + 1] =
							" ".repeat(cur_char_reduce_indent + 1) +
							new_before[i + 1];
					}
				}
			}
			return new_before;
		}
		return this.before;
	}
	static replaceColorContent(str, replacer) {
		if (color_flag_reg.test(str)) {
			replacer = replacer.replace(color_flag_reg, "$3");
			return str
				.trim()
				.replace(
					color_flag_reg,
					"$1" + replaceAll(replacer, "$", "$$$$") + "$4"
				);
		}
		return replacer;
	}
	T(flag) {
		const _s = Date.now();
		console.flag(flag, "START!");
		return {
			end(p) {
				const res = Date.now() - _s;
				console.flag(flag, p || "", res, "ms");
				return res;
			}
		};
	}
	addBefore(arr) {
		arr = Array.prototype.slice.call(arr);
		var strs = util.format(...arr);
		var before_str = this.before.join("");
		strs = before_str + strs.replace(/\n/g, "\n" + before_str);
		return [strs];
	}
	addBeforeForNewLine(arr) {
		this.before = this.getBeforeForNewLine();
		var res = this.addBefore(arr);
		this.before = this.coverBeforeForNewLine();
		return res;
	}
	log(...args) {
		var mix_args = this.addBeforeForNewLine(args);
		this._console_log(mix_args);
	}
	info(...args) {
		args.unshift(coloredInfoSymbol);
		var mix_args = this.addBeforeForNewLine(args);
		this._console_info(mix_args);
	}
	success(...args) {
		args.unshift(coloredSuccessSymbol);
		var mix_args = this.addBeforeForNewLine(args);
		this._console_info(mix_args);
	}
	debug(...args) {
		var mix_args = this.addBeforeForNewLine(args);
		this._console_debug(mix_args);
	}
	warn(...args) {
		args.unshift(coloredWarnSymbol);
		var mix_args = this.addBeforeForNewLine(args);
		this._console_warn(mix_args);
	}
	error(...args) {
		const errorFormateds = util.format(...args).split("\n");
		const firstLine =
			coloredErrorSymbol +
			" " +
			colors.red(errorFormateds.shift()) +
			(errorFormateds.length ? "\n" : "");
		const errorBody = errorFormateds
			.map(s => colors.bgRed(colors.black(s)))
			.join("\n");
		var mix_args = this.addBeforeForNewLine([firstLine + errorBody]);
		this._console_error(mix_args);
	}
	dir(object, options) {
		var args = this.addBeforeForNewLine([
			util.inspect(
				object,
				util._extend(
					{
						customInspect: false
					},
					options
				)
			) + "\n"
		]);
		this._console_log(args);
	}
	time(...args) {
		var start_date = new Date();
		var color_start = "";
		var color_end = "";
		var may_be_flag = args[0];
		if (util.isSymbol(may_be_flag) && COLOR_MAP.has(may_be_flag)) {
			var style = COLOR_MAP.get(may_be_flag);
			color_start = style.open;
			color_end = style.close;
			// arguments = Array.slice(arguments, 1);
			args.shift();
		} else if (typeof may_be_flag === "string") {
			var color_wrap = may_be_flag.match(color_flag_reg);
			if (color_wrap) {
				color_start = color_wrap[1];
				color_end = color_wrap[4];
			}
		}
		this.before.push(
			color_start +
				`┌ (${dateFormat(start_date, this.date_format)})` +
				color_end +
				" "
		);
		var log_lines = util.format(...args).split("\n");
		var args = this.addBefore([log_lines.shift()]);
		this._console_log(args);

		this.before.pop();
		this.before.push(color_start + "│ " + color_end);

		while (log_lines.length) {
			this.log(log_lines.shift());
		}

		var res_symbol = Symbol(this.beforeSymbol.length);
		this.beforeSymbol.push(res_symbol);
		this.timeMap[res_symbol] = start_date;
		return res_symbol;
	}
	timeEnd(symbol, ...rest_args) {
		if (!util.isSymbol(symbol)) {
			this._timeEnd(
				this.beforeSymbol[this.beforeSymbol.length - 1],
				...rest_args
			);
		} else {
			this._timeEnd(symbol, ...rest_args);
		}
	}
	_timeEnd(start_symbol, ...rest_args) {
		if (!util.isSymbol(start_symbol)) {
			throw new Error(TIMEEND_FIRST_ARGUMENT_TYPE_ERROR);
		}
		/* 交错模式 */
		const start_index = this.beforeSymbol.lastIndexOf(start_symbol);
		const before_len = this.beforeSymbol.length;
		const start_date = this.timeMap[start_symbol];
		if (!start_date) {
			throw new Error(TIMEEND_FIRST_ARGUMENT_TYPE_ERROR);
		}
		const end_date = new Date();
		delete this.timeMap[start_symbol];

		if (start_index !== before_len - 1) {
			/* Match color */
			var time_flag = this.before[start_index];

			var backup = [];
			for (var i = start_index + 1; i < before_len; i += 1) {
				backup.push(this.before[i]);
				this.before[i] = Console.replaceColorContent(
					time_flag,
					this.before[i]
						.replace(color_flag_reg, "$3") // 删除颜色影响
						.replace(/(\s*)│(\s*)/, function(
							s,
							before_emp_s,
							after_emp_s
						) {
							// 替换空格
							return (
								"─".repeat(before_emp_s.length) +
								"┼" +
								(i === before_len - 1
									? after_emp_s
									: "─".repeat(after_emp_s.length))
							);
						})
				);
			}
			this.before[start_index] = time_flag.replace("│ ", "└─");

			rest_args.unshift(
				Console.replaceColorContent(
					time_flag,
					`(${dateFormat(end_date, this.date_format)}): ${end_date -
						start_date}ms`
				)
			);
			var args = this.addBefore(rest_args);
			this._console_log(args);

			for (i -= 1; i > start_index; i -= 1) {
				this.before[i] = backup.pop();
			}

			this.before.splice(start_index, 1);
			this.before[i] =
				" ".repeat(time_flag.replace(color_flag_reg, "$3").length) +
				this.before[i];
			this.beforeSymbol.splice(start_index, 1);
		} else {
			/* 简单模式 */
			var time_flag = this.before[this.before.length - 1];
			this.before[this.before.length - 1] = time_flag.replace("│", "└");

			rest_args.unshift(
				Console.replaceColorContent(
					time_flag,
					`(${dateFormat(end_date, this.date_format)}): ${end_date -
						start_date}ms`
				)
			);

			var log_lines = util.format.apply(null, rest_args).split("\n");
			var args = this.addBefore([log_lines.shift()]);
			this._console_log(args);
			this.before.pop();

			while (log_lines.length) {
				this.log(log_lines.shift());
			}

			this.beforeSymbol.pop();
		}
	}
	group(...args) {
		var color_start = "";
		var color_end = "";
		var may_be_flag = args[0];
		if (util.isSymbol(may_be_flag) && COLOR_MAP.has(may_be_flag)) {
			var style = COLOR_MAP.get(may_be_flag);
			color_start = style.open;
			color_end = style.close;
			// arguments = Array.slice(arguments, 1);
			args.shift();
		} else if (typeof may_be_flag === "string") {
			var color_wrap = may_be_flag.match(color_flag_reg);
			if (color_wrap) {
				color_start = color_wrap[1];
				color_end = color_wrap[4];
			}
		}
		this.before.push(color_start + "┌ " + color_end);
		var log_lines = util.format(...args).split("\n");
		var args = this.addBefore([log_lines.shift()]);
		this._console_log(args);

		this.before.pop();
		this.before.push(color_start + "│ " + color_end);

		while (log_lines.length) {
			this.log(log_lines.shift());
		}

		var res_symbol = Symbol(this.beforeSymbol.length);
		this.beforeSymbol.push(res_symbol);
		return res_symbol;
	}
	groupEnd(symbol, ...rest_args) {
		if (!util.isSymbol(symbol)) {
			this._groupEnd(
				this.beforeSymbol[this.beforeSymbol.length - 1],
				...rest_args
			);
		} else {
			this._groupEnd(symbol, ...rest_args);
		}
	}
	_groupEnd(start_symbol, ...rest_args) {
		if (!util.isSymbol(start_symbol)) {
			throw new Error(GROUPEND_FIRST_ARGUMENT_TYPE_ERROR);
		}
		/* 交错模式 */
		const start_index = this.beforeSymbol.lastIndexOf(start_symbol);
		const before_len = this.beforeSymbol.length;
		if (start_index !== before_len - 1) {
			/* Match color */
			var group_flag = this.before[start_index];

			var backup = [];
			for (var i = start_index + 1; i < before_len; i += 1) {
				backup.push(this.before[i]);
				this.before[i] = Console.replaceColorContent(
					group_flag,
					this.before[i]
						.replace(color_flag_reg, "$3") // 删除颜色影响
						.replace(/(\s*)│(\s*)/, function(
							s,
							before_emp_s,
							after_emp_s
						) {
							// 替换空格
							return (
								"─".repeat(before_emp_s.length) +
								"┼" +
								(i === before_len - 1
									? after_emp_s
									: "─".repeat(after_emp_s.length))
							);
						})
				);
			}
			this.before[start_index] = group_flag.replace("│ ", "└─");

			var args = this.addBefore(rest_args);
			this._console_log(args);

			for (i -= 1; i > start_index; i -= 1) {
				this.before[i] = backup.pop();
			}

			this.before.splice(start_index, 1);
			this.before[i] =
				" ".repeat(group_flag.replace(color_flag_reg, "$3").length) +
				this.before[i];
			this.beforeSymbol.splice(start_index, 1);
		} else {
			/* 简单模式 */
			var group_flag = this.before[this.before.length - 1];
			this.before[this.before.length - 1] = group_flag.replace("│", "└");

			var log_lines = util.format.apply(null, rest_args).split("\n");
			var args = this.addBefore([log_lines.shift()]);
			this._console_log(args);
			this.before.pop();

			while (log_lines.length) {
				this.log(log_lines.shift());
			}

			this.beforeSymbol.pop();
		}
	}
	flag(flag, ...rest_args) {
		const colored_flag = colorsHead("[" + flag + "]");
		this.log(colored_flag, ...rest_args);
	}
	flagHead(flag, withBG) {
		if (typeof withBG === "boolean") {
			return colorsHead(
				"[" + flag + "]",
				null,
				withBG ? TEXT_COLOR_WITH_BG : TEXT_COLOR_WITHOUT_BG
			);
		} else {
			return colorsHead("[" + flag + "]");
		}
	}
}
Console.COLOR = COLOR_ENUM;
exports.Console = Console;