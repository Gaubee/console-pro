import { ConsolePro } from "../src/";
const c = new ConsolePro({ auto_reduce_indent: true });
c.log("qaq");
const g1 = c.lgroup(c.flagHead("11"));
const g2 = c.lgroup(c.flagHead("22"));
c.log("1");
c.error("2");
c.lgroupEnd(g1, "11xx");
c.success("3");
const t1 = c.ltime(c.flagHead("33"));
const t2 = c.ltime("44");
c.info("2");
c.table({ a: "c", b: 2, c: true });
c.ltimeEnd(t1, "33xx");
c.lgroupEnd(g2, "22xx");
c.ltimeEnd(t2, "44xx");

let i = 0;
const ti1 = setInterval(() => {
  if (i > 10) {
    c.log("\nqaq");
    return clearInterval(ti1);
  }
  c.line(i++);
}, 100);

const a = {
  qaq: 1,
  aoa: "aa"
};
type A = typeof a;
type B = Exclude<keyof A, "qaq">;
