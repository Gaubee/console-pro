"use strict";

var keypress = require("keypress");
var colors = require("colors");

export function menu(
  title: string,
  cb: (selected_option: ConsolePro.MenuOption) => any,
  log: Console["log"],
  opts: ConsolePro.MenuConfig = {}
) {
  var items: ConsolePro.MenuOption[] = [];
  var isRaw = process.stdin.isRaw;
  var active = true;
  var moved = false;
  var selected = 0;

  var waiting_msg = opts.waiting_msg || " (waiting...)";
  var useArrowKeys_msg = opts.useArrowKeys_msg || " (use arrow keys)";

  keypress(process.stdin);
  process.stdin.on("keypress", onkeypress);
  if (!isRaw) process.stdin.setRawMode && process.stdin.setRawMode(true);
  process.stdin.resume();
  draw();

  const key_map = new Map<string, number>();
  function add(item: string | ConsolePro.MenuOption) {
    if (!active) return;
    if (typeof item === "string") {
      item = {
        name: item,
        value: item
      };
    }
    if (item.key === undefined) {
      const default_key = items.length + 1 + "";
      if (!key_map.has(default_key)) {
        key_map.set(default_key, items.length);
      }
    } else {
      key_map.set(item.key.toString()[0], items.length);
    }
    items.push(item);
    draw();
  }

  function onkeypress(ch: any, key: any) {
    if (key) {
      if (key.ctrl && key.name === "c") process.exit(130);

      if (key.name === "up") {
        if (selected === 0) return;
        selected--;
        moved = true;
        return draw();
      } else if (key.name === "down") {
        if (selected >= items.length - 1) return;
        selected++;
        moved = true;
        return draw();
      } else if (items.length > 0 && key.name === "return") {
        return select();
      }
    }
    if (ch) {
      const index = key_map.get(ch);
      if (index !== undefined) {
        selected = index;
        draw();
      }
    }
  }

  function select() {
    active = false;
    draw();
    process.stdin.pause();
    if (!isRaw) process.stdin.setRawMode && process.stdin.setRawMode(false);
    process.stdin.removeListener("keypress", onkeypress);
    cb(items[selected]);
  }

  function draw() {
    var status = "";
    var q = colors.green("? ") + colors.bold(title);
    if (active) {
      if (items.length === 0) status = waiting_msg;
      else if (!moved) status = useArrowKeys_msg;

      log(
        items.reduce(function(s, item, index) {
          const key_str =
            item.key !== undefined ? colors.blue(`[${item.key}] `) : "";
          return (
            s +
            (index === selected
              ? colors.cyan("> " + key_str + item.name)
              : "  " + key_str + item.name) +
            "\n"
          );
        }, q + status + "\n")
      );
    } else {
      log(q + " " + colors.cyan(items[selected].name) + "\n");
    }
  }

  return {
    add,
    items
  };
}

export class TerminalMenu {
  constructor(
    public title: string,
    public opts: ConsolePro.MenuConfig,
    public logger: Console["log"]
  ) {
    this.selected_value = this.selected_options.then(options => options.value);
    this.add = this.addOption;
  }
  private menu!: ReturnType<typeof menu>;
  selected_options = new Promise<ConsolePro.MenuOption>(cb => {
    this.menu = menu(
      this.title,
      selected_options => {
        cb(selected_options);
      },
      this.logger,
      this.opts
    );
  });
  selected_value = this.selected_options.then(options => options.value);
  addOption(name: string, value: any, key?: string | number) {
    this.menu.add({
      name,
      value,
      key
    });
  }
  add = this.addOption;
}
