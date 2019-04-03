import { ConsolePro } from "../src/";
const c = new ConsolePro({ auto_reduce_indent: true });
async function test() {
  const g = c.lgroup("gg");
  const menu = c.menu("搞事情哦？");
  menu.add("是", true);
  menu.add("否", false);
  menu.add("option1", "1", 1);
  menu.add("option2", "2", 2);
  menu.add("optionC", "C", "c");
  menu.add("optionCC", "CC", "C");
  c.success("res:", await menu.selected_options);
  c.lgroupEnd(g);
}
test().catch(c.error.bind(c));
