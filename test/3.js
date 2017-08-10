const { Console } = require("../");
const colors = require("colors");
con = new Console({ auto_reduce_indent: true });

var t1 = con.time(con.flagHead("T1"));
con.info("INFO!!!!", { a: 1, b: 2, c: 3, d: 4 });
con.error(new Error("error!!"));
con.info("INFO!!!!", { a: 1, b: 2, c: 3, d: 4 });
var g1 = con.group(con.flagHead("G1"));
var t2 = con.time(con.flagHead("T2"));
var g2 = con.group(con.flagHead("G2"));
con.groupEnd(g1,"Group 1 End.");
con.warn("WARING!!!!");
con.timeEnd(t2);
con.success("SUCCESS!!!!");
con.groupEnd(g2,"Group 2 End.");
con.timeEnd(t1);
