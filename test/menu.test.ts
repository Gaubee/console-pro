import { ConsolePro } from "../src/";
const c = new ConsolePro({ auto_reduce_indent: true });
async function test() {
  const g = c.lgroup("gg");
  // const child_menu1 = c
  //   .menu("", [], { isChild: true })
  //   .addOption("cc", 231, 5)
  //   .addOption("21x51", "csaag", "c");
  const menu = c.menu("测试", [
    ["option1", "1", 1],
    ["option2", "2", 2],
    ["child_menu1", [["name1", "gaubee", 1], ["name2", "bangeel", 2]], "n"],
    ["child_menu2", [["age1", 12, 1], ["age2", 30, 2]], "a"],
    [
      "TREE",
      [
        ["tree1", [["node1", 1, 1], ["node2", 2, 2]], 1],
        ["tree2", [["node3", 1, 1], ["node4", 2, 2]], 2]
      ],
      "a"
    ]
    // ["other", "3", "x"]
  ]);
  // const child_menu2 = c
  //   .menu("", [], { isChild: true })
  //   .addOption("age1", 1, 1)
  //   .addOption("age2", 2, 2);
  // const menu = c.menu("搞事情哦？", [["option1", "1", 1], ["option2", "2", 2]]);
  // menu.addOption("是", true);
  // menu.addOption("否", false);
  // menu.addOption("option1", "1", 1);
  // menu.addOption("option2", "2", 2);
  // menu.addOption("optionC", "C", "c");
  // menu.addOption("optionCC", "CC", "C");
  // menu.addOption("other menu", child_menu1, "C");
  // menu.addOption("child_menu", child_menu2, "C");
  c.success("res:", await menu.selected_option);
  c.success("res:", await menu.selected_value);
  c.lgroupEnd(g);
}
test().catch(c.error.bind(c));
