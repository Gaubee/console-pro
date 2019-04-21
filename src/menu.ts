import { EventEmitter } from "events";
import chalk from "chalk";
const MENU_SYMBOL = Symbol("menu");
import * as readline from "readline";

export class TerminalMenu extends EventEmitter {
  [MENU_SYMBOL] = true;

  constructor(
    public title: string,
    public opts: ConsolePro.MenuConfig,
    public cpro: import("./Console").ConsolePro // public log: Console["log"], // public stdin = process.stdin
  ) {
    super();
    opts.waiting_msg && (this.waiting_msg = opts.waiting_msg);
    opts.useArrowKeys_msg && (this.useArrowKeys_msg = opts.useArrowKeys_msg);
    this.onkeypress = this.onkeypress.bind(this);
    if (!opts.isChild) {
      this.startSelect();
    }
  }
  private waiting_msg = " (waiting...)";
  private useArrowKeys_msg = " (use arrow keys)";
  public items: ConsolePro.MenuOption[] = [];
  public is_open = true;
  private isRaw = this.cpro.stdin.isRaw;
  private active = true;
  private moved = false;
  private selected = 0;
  private parent?: TerminalMenu;
  private key_map = new Map<string, number>();
  private _resolve!: (value: ConsolePro.MenuOption) => void;
  public selected_option = new Promise<ConsolePro.MenuOption>(cb => {
    this._resolve = cb;
  });
  public level = 1;
  public selected_value = this.selected_option.then(options => {
    this.active = false;
    if (this.level === 1) {
      this.draw();
    }
    return options.value;
  });
  addOption(name: string, value: any, key?: string | number) {
    if (!this.active) return this;
    const item: ConsolePro.MenuOption = {
      name,
      value,
      key
    };
    if (value instanceof TerminalMenu) {
      // 子菜单默认关闭
      value.is_open = false;
      value.selected_option.then(v => {
        console.log("child selected", v, this.title);
        this._resolve(v);
      });
      value.level = this.level + 1;
      value.parent = this;
    }
    if (item.key === undefined) {
      const default_key = this.items.length + 1 + "";
      if (!this.key_map.has(default_key)) {
        this.key_map.set(default_key, this.items.length);
      }
    } else {
      this.key_map.set(item.key.toString()[0], this.items.length);
    }
    this.items.push(item);
    this.draw();
    return this;
  }

  private onkeypress(ch: any, key: any) {
    if (key) {
      if (key.ctrl && key.name === "c") {
        if (this.cpro.stdin === process.stdin) {
          process.exit(130);
        } else {
          this.cpro.stdin.emit("exit", 130);
        }
        return;
      }

      if (key.name === "up") {
        if (this.selected === 0) return;
        this.selected--;
        this.moved = true;
        return this.draw();
      } else if (key.name === "down") {
        if (this.selected >= this.items.length - 1) return;
        this.selected++;
        this.moved = true;
        return this.draw();
      } else if (key.name === "right") {
        if (
          this.items[this.selected] &&
          this.items[this.selected].value instanceof TerminalMenu
        ) {
          return this.select();
        }
      } else if (key.name === "left" || key.name === "escape") {
        if (this.parent && this.is_open) {
          this.is_open = false;
          this.stopSelect();
          return this.parent.startSelect();
        }
      } else if (this.items.length > 0 && key.name === "return") {
        return this.select();
      }
    }
    if (ch) {
      const index = this.key_map.get(ch);
      if (index !== undefined) {
        this.selected = index;
        this.draw();
      }
    }
  }
  rl?: readline.Interface;
  startSelect() {
    if (this.rl) {
      return;
    }
    this.rl = readline.createInterface({
      input: this.cpro.stdin,
      output: this.cpro.stdout.outter
    });
    // 回车不会打印换行符
    (this.rl as any).clearLine = function(this: any) {
      this._moveCursor(+Infinity);
      this._writeToOutput("\x1b[1000D\x1b[0K");
      this.line = "";
      this.cursor = 0;
      this.prevRows = 0;
    };

    this.emit("readline", this.rl);

    if (!this.isRaw)
      this.cpro.stdin.setRawMode && this.cpro.stdin.setRawMode(true);
    // if (this.cpro.stdin.isPaused) {
    //   this.cpro.stdin.once("resume", () => {
    //     this.cpro.stdin.on("keypress", this.onkeypress);
    //   });
    // } else {
    //   this.cpro.stdin.on("keypress", this.onkeypress);
    // }
    // this.cpro.stdin.on("keypress", this.onkeypress);

    this.cpro.stdin.once("resume", () => {
      this.cpro.stdin.on("keypress", this.onkeypress);
    });
    this.cpro.stdin.resume();
    this.draw();
  }
  stopSelect() {
    if (!this.rl) {
      return;
    }
    this.rl.close();
    this.rl = undefined;
    this.cpro.stdin.pause();
    if (!this.isRaw)
      this.cpro.stdin.setRawMode && this.cpro.stdin.setRawMode(false);
    this.cpro.stdin.removeListener("keypress", this.onkeypress);
  }
  select() {
    this.stopSelect();
    const selected_option = this.items[this.selected];
    if (selected_option && selected_option.value instanceof TerminalMenu) {
      selected_option.value.is_open = true;
      selected_option.value.startSelect();
    } else {
      console.log("self select", selected_option);
      this._resolve(selected_option);
    }
  }

  private _draw(): string {
    if (!this.is_open) {
      return "";
    }
    var status = "";
    var q = this.title ? chalk.green("? ") + chalk.bold(this.title) : "";
    if (this.active) {
      if (this.items.length === 0) status = this.waiting_msg;
      else if (!this.moved) status = this.useArrowKeys_msg;

      return this.items.reduce(
        (s, item, index) => {
          const key_str =
            item.key !== undefined
              ? chalk.cyan(chalk.bold(`[${item.key}]`)) + " "
              : "";
          const first_key =
            item.value instanceof TerminalMenu
              ? "+"
              : index === this.selected
              ? ">"
              : " ";
          const line_left = first_key + " ";
          const left_space = "  ".repeat(this.level - 1);
          const line = left_space + key_str + item.name;
          const res =
            s +
            (index === this.selected
              ? chalk.cyan(line_left + line)
              : line_left + line) +
            "\n";
          return (
            res + (item.value instanceof TerminalMenu ? item.value._draw() : "")
          );
        },
        q ? q + status + "\n" : ""
      );
    } else {
      return q
        ? q + " " + chalk.cyan(this.items[this.selected].name) + "\n"
        : "";
    }
  }
  private draw() {
    if (this.parent) {
      if (this.is_open) {
        this.parent.draw();
      }
    } else {
      this.cpro.line(this._draw());
    }
  }
}
