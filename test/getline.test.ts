import { ConsolePro } from "../src/";
const con = new ConsolePro({ auto_reduce_indent: true });
async function test() {
  const g = con.lgroup("gg");
  const answer = await con.getLine("搞事情哦?", { default: "231" });
  con.success("res:", answer);
  con.lgroupEnd(g);
}
test().catch(con.error.bind(con));
