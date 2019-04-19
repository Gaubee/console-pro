/* @flow */
import { Console as NativeConsole } from "console";
import * as util from "util";
import * as readline from "readline";
// const gq_config = process.env.GQ_CONFIG || {};
// const { performance } = require("perf_hooks");
/**
 *
 * @param {[number, number]} hrtime
 */
const hrtime_format_2_ms = (hrtime: number[]) => {
  // const NS_PER_SEC = 1e9;
  return hrtime[0] * 1e3 + hrtime[1] / 1e6;
};
const MOVE_LEFT = "\x1b[1000D"; //Buffer.from("1b5b3130303044", "hex").toString();
const MOVE_UP = "\x1b[1A"; // Buffer.from("1b5b3141", "hex").toString();
const CLEAR_LINE = "\x1b[0K"; //Buffer.from("1b5b304b", "hex").toString();
// const singleLineLog = require("single-line-log").stdout;
// const menu = require("./menu");
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
import { replaceAll } from "./replaceAll";
import { dateFormat } from "./dateFormat";
import { TerminalMenu } from "./menu";
import { timingSafeEqual } from "crypto";
import { ConsoleStdOut } from "./lib/ConsoleStd";
import { fackConsole, fackWriter } from "./lib/facker";
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

class HrtDate extends Date {
  __hrt = process.hrtime();
}

class ConsoleBase {
  stdout: ConsoleStdOut;
  stderr: ConsoleStdOut;
  stdin: NodeJS.ReadStream;
  // stdin:ConsoleStd
  protected _console: Console;
  log: Console["log"];
  protected _warn: Console["warn"];
  dir: Console["dir"];
  time: Console["time"];
  timeEnd: Console["timeEnd"];
  timeLog: Console["timeLog"];
  trace: Console["trace"];
  assert: Console["assert"];
  clear: Console["clear"];
  count: Console["count"];
  countReset: Console["countReset"];
  group: Console["group"];
  groupEnd: Console["groupEnd"];
  table: Console["table"];
  protected _debug: Console["debug"];
  protected _info: Console["info"];
  dirxml: Console["dirxml"];
  protected _error: Console["error"];
  groupCollapsed: Console["groupCollapsed"];
  constructor(config: {
    stdout?: NodeJS.WriteStream;
    stderr?: NodeJS.WriteStream;
    stdin?: NodeJS.ReadStream;
  }) {
    this.stdout = new ConsoleStdOut(config.stdout || process.stdout);
    this.stderr = new ConsoleStdOut(
      config.stderr || config.stdout || process.stderr
    );
    this.stdin = config.stdin || process.stdin;
    const con = (this._console = new NativeConsole(this.stdout, this.stderr));
    this.log = con.log.bind(con);
    this._warn = con.warn.bind(con);
    this.dir = con.dir.bind(con);
    this.time = con.time.bind(con);
    this.timeEnd = con.timeEnd.bind(con);
    this.timeLog = con.timeLog.bind(con);
    this.trace = con.trace.bind(con);
    this.assert = con.assert.bind(con);
    this.clear = con.clear.bind(con);
    this.count = con.count.bind(con);
    this.countReset = con.countReset.bind(con);
    this.group = con.group.bind(con);
    this.groupEnd = con.groupEnd.bind(con);
    this.table = con.table.bind(con);
    this._debug = con.debug.bind(con);
    this._info = con.info.bind(con);
    this.dirxml = con.dirxml.bind(con);
    this._error = con.error.bind(con);
    this.groupCollapsed = con.groupCollapsed.bind(con);
  }
}

export class ConsolePro extends ConsoleBase {
  public date_format = "hh:mm:ss MM-DD";
  public time_fixed = 4;
  public timeMap = new Map<symbol, Date>();
  public namespace = "";

  constructor(public config: ConsolePro.ConsoleOptions = {}) {
    super(config);
    if (config.date_format) {
      this.date_format = config.date_format;
    }
    if (typeof config.time_fixed === "number" && isFinite(config.time_fixed)) {
      this.time_fixed = config.time_fixed | 0;
    }
    if (config.namespace) {
      this.namespace = config.namespace;
    }

    this.info = this.info.bind(this);
    this.success = this.success.bind(this);
    this.debug = this.debug.bind(this);
    this.warn = this.warn.bind(this);
    this.error = this.error.bind(this);
    this.ltime = this.ltime.bind(this);
    this.ltimeEnd = this.ltimeEnd.bind(this);
    this.lgroup = this.lgroup.bind(this);
    this.lgroupEnd = this.lgroupEnd.bind(this);
    this.flag = this.flag.bind(this);
    this.flagHead = this.flagHead.bind(this);
    this.line = this.line.bind(this);
    this.menu = this.menu.bind(this);
    this.getLine = this.getLine.bind(this);
  }

  private _log_bak = this.log;
  private _info_bak = this.info;
  private _debug_bak = this.debug;
  private _success_bak = this.success;
  private _warn_bak = this.warn;
  private _error_bak = this.error;
  private _dir_bak = this.dir;
  private _group_bak = this.group;
  private _groupEnd_bak = this.groupEnd;
  private _time_bak = this.time;
  private _timeEnd_bak = this.timeEnd;
  current_is_silence = false;

  silence(to_silence?: boolean) {
    to_silence = Boolean(to_silence);
    if (this.current_is_silence === to_silence) {
      return;
    }
    this.current_is_silence = to_silence;
    // if (to_silence) {
    //   this.log = noop;
    //   this.info = noop;
    //   this.debug = noop;
    //   this.success = noop;
    //   this.warn = noop;
    //   this.error = noop;
    //   this.dir = noop;
    //   this.group = noop;
    //   this.groupEnd = noop;
    //   this.time = noop;
    //   this.timeEnd = noop;
    // } else {
    //   this.log = this._log_bak;
    //   this.info = this._info_bak;
    //   this.debug = this._debug_bak;
    //   this.success = this._success_bak;
    //   this.warn = this._warn_bak;
    //   this.error = this._error_bak;
    //   this.dir = this._dir_bak;
    //   this.group = this._group_bak;
    //   this.groupEnd = this._groupEnd_bak;
    //   this.time = this._time_bak;
    //   this.timeEnd = this._timeEnd_bak;
    // }
  }
  public _before: string[] = [];
  private _effectBefore() {
    this.stdout.beforeBuffer = this.stderr.beforeBuffer = Buffer.from(
      this._before.join("")
    );
  }
  public _beforeSymbol: symbol[] = [];
  //   private __reduce_indent_set?: number[];
  getBeforeForNewLine(opts?: {}) {
    if (this.config.auto_reduce_indent) {
      const reduce_indent_set = [] as number[];
      const new_before = this._before.slice().map((char, i) => {
        if (char.startsWith("  ") && char.includes("│")) {
          //两个空格以上才进行缩进减少，多个空格合成一个
          return char
            .replace(/^\s+/, function(match_str) {
              reduce_indent_set[i] = match_str.length - 1;
              return "";
            })
            .replace("│", "┌" + "─".repeat(reduce_indent_set[i]) + "┘");
        } else {
          reduce_indent_set[i] = 0;
        }
        return char;
      });
      return { before: new_before, reduce_indent_set };
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
    return { before: this._before };
  }
  coverBeforeForNewLine(reduce_indent_set?: number[]) {
    if (reduce_indent_set) {
      const new_before = this._before.slice();
      for (let i = 0; i < new_before.length; i += 1) {
        const cur_char_reduce_indent = reduce_indent_set[i];
        if (cur_char_reduce_indent) {
          new_before[i] = new_before[i].replace(/┌─*┘/, "│");
          if (new_before[i + 1]) {
            new_before[i + 1] =
              " ".repeat(cur_char_reduce_indent + 1) + new_before[i + 1];
          }
        }
      }
      return new_before;
    }
    return this._before;
  }
  static replaceColorContent(str: string, replacer: string) {
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

  private _after_log_new_line?: boolean;
  addBefore(arr: any[], opts?: { from_line?: boolean }) {
    let strs = (util.format as any)(...arr);
    const before_str = this._before.join("");
    strs = before_str + strs.replace(/\n/g, "\n" + before_str);

    if (this._after_log_new_line) {
      // 使用line打印后，后面没有回车符号，需要在新行中另外起一个\n
      if (!(opts && opts.from_line)) {
        strs = "\n" + strs;
        this._after_log_new_line = false;
      }
    }
    return [strs];
  }
  addBeforeForNewLine(arr: any[], opts?: { from_line?: boolean }) {
    const { before, reduce_indent_set } = this.getBeforeForNewLine(opts);
    this._before = before;

    let unshift_new_line = false;
    if (this._after_log_new_line) {
      // 使用line打印后，后面没有回车符号，需要在新行中另外起一个\n
      if (!(opts && opts.from_line)) {
        unshift_new_line = true;
      }
    }
    var res = this.addBefore(arr, opts);
    this._before = this.coverBeforeForNewLine(reduce_indent_set);
    if (unshift_new_line && this._before[0] && this._before[0][0] === "\n") {
      this._before[0] = this._before[0].substr(1);
    }
    this._effectBefore();
    return res;
  }

  info(...args: any[]) {
    this._info(coloredInfoSymbol, ...args);
  }
  success(...args: any[]) {
    this._info(coloredSuccessSymbol, ...args);
  }
  debug(...args: any[]) {
    this._debug(...args);
  }
  warn(...args: any[]) {
    this._warn(coloredWarnSymbol, ...args);
  }
  error(...args: any[]) {
    this._error(coloredErrorSymbol, ...args);
  }

  ltime(...args: any[]) {
    var start_date = new HrtDate();
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
    this._before.push(
      color_start +
        `┌ (${dateFormat(start_date, this.date_format)})` +
        color_end +
        " "
    );
    this._effectBefore();
    var log_lines = (util.format as any)(...args).split("\n");
    var args = this.addBefore([log_lines.shift()]);
    this.log(log_lines.shift());

    this._before.pop();
    this._before.push(color_start + "│ " + color_end);
    this._effectBefore();

    while (log_lines.length) {
      this.log(log_lines.shift());
    }

    var res_symbol = Symbol(this._beforeSymbol.length);
    this._beforeSymbol.push(res_symbol);
    this.timeMap.set(res_symbol, start_date);
    return res_symbol;
  }
  ltimeEnd(symbol?: any, ...rest_args: any[]) {
    if (!util.isSymbol(symbol)) {
      this._timeEnd(
        this._beforeSymbol[this._beforeSymbol.length - 1],
        ...rest_args
      );
    } else {
      this._timeEnd(symbol, ...rest_args);
    }
  }
  private _timeEnd(start_symbol: symbol, ...rest_args: any[]) {
    if (!util.isSymbol(start_symbol)) {
      throw new Error(TIMEEND_FIRST_ARGUMENT_TYPE_ERROR);
    }
    /* 交错模式 */
    const start_index = this._beforeSymbol.lastIndexOf(start_symbol);
    const before_len = this._beforeSymbol.length;
    const start_date = this.timeMap.get(start_symbol);
    if (!start_date) {
      throw new Error(TIMEEND_FIRST_ARGUMENT_TYPE_ERROR);
    }
    const end_date = new HrtDate();
    this.timeMap.delete(start_symbol);

    if (start_index !== before_len - 1) {
      /* Match color */
      var time_flag = this._before[start_index];

      var backup = [];
      for (var i = start_index + 1; i < before_len; i += 1) {
        backup.push(this._before[i]);
        this._before[i] = ConsolePro.replaceColorContent(
          time_flag,
          this._before[i]
            .replace(color_flag_reg, "$3") // 删除颜色影响
            .replace(/(\s*)│(\s*)/, function(s, before_emp_s, after_emp_s) {
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
      this._before[start_index] = time_flag.replace("│ ", "└─");
      this._effectBefore();

      rest_args.unshift(
        ConsolePro.replaceColorContent(
          time_flag,
          `(${dateFormat(end_date, this.date_format)}): ${hrtime_format_2_ms(
            end_date.__hrt
          ).toFixed(this.time_fixed)}ms`
        )
      );
      var args = this.addBefore(rest_args);
      this.log(...args);

      for (i -= 1; i > start_index; i -= 1) {
        this._before[i] = backup.pop() as string;
      }

      this._before.splice(start_index, 1);
      this._before[i] =
        " ".repeat(time_flag.replace(color_flag_reg, "$3").length) +
        this._before[i];
      this._beforeSymbol.splice(start_index, 1);
      this._effectBefore();
    } else {
      /* 简单模式 */
      var time_flag = this._before[this._before.length - 1];
      this._before[this._before.length - 1] = time_flag.replace("│", "└");
      this._effectBefore();

      rest_args.unshift(
        ConsolePro.replaceColorContent(
          time_flag,
          `(${dateFormat(end_date, this.date_format)}): ${hrtime_format_2_ms(
            end_date.__hrt
          ).toFixed(this.time_fixed)}ms`
        )
      );

      var log_lines = (util.format as any)(...rest_args).split("\n");
      this.log(log_lines.shift());
      this._before.pop();
      this._effectBefore();

      while (log_lines.length) {
        this.log(log_lines.shift());
      }

      this._beforeSymbol.pop();
    }
  }
  lgroup(...args: any[]) {
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
    this._before.push(color_start + "┌ " + color_end);
    this._effectBefore();
    var log_lines = (util.format as any)(...args).split("\n");
    this.log(log_lines.shift());

    this._before.pop();
    this._before.push(color_start + "│ " + color_end);
    this._effectBefore();

    while (log_lines.length) {
      this.log(log_lines.shift());
    }

    var res_symbol = Symbol(this._beforeSymbol.length);
    this._beforeSymbol.push(res_symbol);
    return res_symbol;
  }
  lgroupEnd(symbol?: any, ...rest_args: any[]) {
    if (!util.isSymbol(symbol)) {
      this._groupEnd(
        this._beforeSymbol[this._beforeSymbol.length - 1],
        ...rest_args
      );
    } else {
      this._groupEnd(symbol, ...rest_args);
    }
  }
  private _groupEnd(start_symbol: symbol, ...rest_args: any[]) {
    if (!util.isSymbol(start_symbol)) {
      throw new Error(GROUPEND_FIRST_ARGUMENT_TYPE_ERROR);
    }
    /* 交错模式 */
    const start_index = this._beforeSymbol.lastIndexOf(start_symbol);
    const before_len = this._beforeSymbol.length;
    if (start_index !== before_len - 1) {
      /* Match color */
      var group_flag = this._before[start_index];

      var backup = [];
      for (var i = start_index + 1; i < before_len; i += 1) {
        backup.push(this._before[i]);
        this._before[i] = ConsolePro.replaceColorContent(
          group_flag,
          this._before[i]
            .replace(color_flag_reg, "$3") // 删除颜色影响
            .replace(/(\s*)│(\s*)/, function(s, before_emp_s, after_emp_s) {
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
      this._before[start_index] = group_flag.replace("│ ", "└─");
      this._effectBefore();

      this.log(...rest_args);

      for (i -= 1; i > start_index; i -= 1) {
        this._before[i] = backup.pop() as string;
      }

      this._before.splice(start_index, 1);
      this._before[i] =
        " ".repeat(group_flag.replace(color_flag_reg, "$3").length) +
        this._before[i];
      this._effectBefore();
      this._beforeSymbol.splice(start_index, 1);
    } else {
      /* 简单模式 */
      var group_flag = this._before[this._before.length - 1];
      this._before[this._before.length - 1] = group_flag.replace("│", "└");
      this._effectBefore();

      var log_lines = (util.format as any)(...rest_args).split("\n");
      this.log(log_lines.shift());
      this._before.pop();
      this._effectBefore();

      while (log_lines.length) {
        this.log(log_lines.shift());
      }

      this._beforeSymbol.pop();
    }
  }
  flag(flag: any, ...rest_args: any[]) {
    const colored_flag = colorsHead("[" + flag + "]");
    this.log(colored_flag, ...rest_args);
  }
  flagHead(flag: any, withBG?: boolean) {
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
  //   child(namespace: string) {}
  private _prevLineCount = 0;
  line(...args: any[]) {
    fackConsole.log(...args);
    if (this.stdout.new_line_at_start) {
      // Clear screen
      let str = "";
      const prevLineCount = this._prevLineCount + 1;

      for (let i = 0; i < prevLineCount; i++) {
        str += MOVE_LEFT + CLEAR_LINE + (i < prevLineCount - 1 ? MOVE_UP : "");
      }

      this.stdout.baseWrite(str);
    }
    this.stdout.new_line_at_start = true;
    this._prevLineCount = 0;
    const arg_line = Buffer.concat(
      (fackWriter.cachedBuffers as Uint8Array[]).map(buffer => {
        this._prevLineCount += buffer.filter(v => v === 0x0a).length;

        return buffer;
      })
    );

    fackWriter.cachedBuffers.length = 0;

    this.stdout.baseWrite(arg_line);
  }
  //   clear() {
  //     this.log();
  //   }
  // clear() {
  //   singleLineLog.clear();
  // }
  menu(title: string, childs?: any[][], _opts?: ConsolePro.MenuConfig) {
    const opts = Object.assign(
      {
        waiting_msg: " （请稍后……）",
        useArrowKeys_msg: " （使用方向键进行选择）",
        isChild: true
      },
      _opts
    );
    const res = new TerminalMenu(title, opts, this);
    const generate_childs = (menu: TerminalMenu, childs: any[][]) => {
      childs.forEach(([name, value, key]) => {
        if (value instanceof Array && value[0] instanceof Array) {
          const child_menu = new TerminalMenu(
            "",
            { ...opts, isChild: true },
            this
          );
          child_menu.level = menu.level + 1;
          generate_childs(child_menu, value);
          value = child_menu;
        }
        menu.addOption(name, value, key);
      });
    };
    childs && generate_childs(res, childs);
    res.startSelect();
    return res;
  }
  getLine(
    question: string,
    opts?: { default?: string; filter?: (answer: string) => boolean }
  ) {
    const filter = opts && opts.filter;
    const defaultVal = opts && opts.default;
    return new Promise<string>(cb => {
      var rl = readline.createInterface({
        input: this.stdin,
        output: this.stdout.outter
      });
      const prompt = this.stdout.beforeBuffer
        ? this.stdout.beforeBuffer.toString()
        : "";
      // this.stdin.setRawMode && this.stdin.setRawMode(false);
      let print_line = prompt + question;
      if (defaultVal !== undefined) {
        print_line += " " + colors.grey(`(${defaultVal})`);
      }
      rl.question(print_line, answer => {
        if (filter instanceof Function) {
          if (!filter(answer)) {
            return cb(this.getLine(question, opts));
          }
        }
        if (!answer && defaultVal !== undefined) {
          answer = defaultVal;
        }
        cb(answer);
        rl.close();
      });
    });
  }

  static COLOR = COLOR_ENUM;
}
