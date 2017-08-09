/* @flow */
const _console = global.console;
const _log = _console.log;
const gq_config = process.gq_config || {};
const util = require("util");
const {
	colors,
	color_flag_reg,
	colorsHead,
	COLOR_ENUM,
	COLOR_MAP
} = require("./stringColor");
const { replaceAll } = require("./replaceAll");
const { dateFormat } = require("./dateFormat");

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
		} else {
			this._console_log = args => {
				_console.log(...args);
			};
		}

		this.assert = _console.assert;
		this.trace = _console.trace;
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
			replacer = replacer.replace(color_flag_reg, "$2");
			return str
				.trim()
				.replace(
					color_flag_reg,
					"$1" + replaceAll(replacer, "$", "$$$$") + "$3"
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
		var mix_args = this.addBeforeForNewLine(args);
		_console.info(...mix_args);
	}
	debug(...args) {
		var mix_args = this.addBeforeForNewLine(args);
		_console.debug(...mix_args);
	}
	warn(...args) {
		var mix_args = this.addBeforeForNewLine(args);
		_console.warn(...mix_args);
	}
	error(...args) {
		var mix_args = this.addBeforeForNewLine(args);
		_console.error(...mix_args);
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
		var time_str = args.join(" ");
		this.timeMap[time_str] = start_date;

		this.before.push(
			"┌ (" + dateFormat(start_date, this.date_format) + ")"
		);
		var args = this.addBefore(args);
		this._console_log(args);

		this.before.pop();
		this.before.push("│ ");
	}
	timeEnd(...args) {
		var end_date = new Date();
		var time_str = args.join(" ");
		if (!this.timeMap.hasOwnProperty(time_str)) {
			throw new Error("No such label: " + time_str);
		}
		var start_date = this.timeMap[time_str];

		this.before.pop();
		this.before.push("└ (" + dateFormat(end_date, this.date_format) + ")");
		var mix_args = this.addBefore(args);
		mix_args.push(": " + (end_date - start_date) + "ms");
		this._console_log(mix_args);
		this.before.pop();
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
				color_end = color_wrap[3];
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
	groupEnd(may_be_symbol, ...rest_args) {
		/* 交错模式 */
		if (util.isSymbol(may_be_symbol)) {
			const start_index = this.beforeSymbol.lastIndexOf(may_be_symbol);
			const before_len = this.beforeSymbol.length;
			if (start_index !== -1 && start_index !== before_len - 1) {
				/* Match color */
				var group_flag = this.before[start_index];

				var backup = [];
				for (var i = start_index + 1; i < before_len; i += 1) {
					backup.push(this.before[i]);
					this.before[i] = Console.replaceColorContent(
						group_flag,
						this.before[i]
							.replace(color_flag_reg, "$2") // 删除颜色影响
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
					" ".repeat(
						group_flag.replace(color_flag_reg, "$2").length
					) + this.before[i];
				this.beforeSymbol.splice(start_index, 1);
				return;
			} else {
				// arguments = rest_args;
			}
		}
		/* 简单模式 */
		var group_flag = this.before[this.before.length - 1];
		this.before[this.before.length - 1] = group_flag.replace("│", "└");

		var log_lines = util.format.apply(this, rest_args).split("\n");
		var args = this.addBefore([log_lines.shift()]);
		this._console_log(args);
		this.before.pop();

		while (log_lines.length) {
			this.log(log_lines.shift());
		}

		this.beforeSymbol.pop();
	}
	flag(flag, ...rest_args) {
		const colored_flag = colorsHead("[" + flag + "]");
		this.log(colored_flag, ...rest_args);
	}
	flagHead(flag) {
		return colorsHead("[" + flag + "]");
	}
}
Console.COLOR = COLOR_ENUM;
exports.Console = Console;
