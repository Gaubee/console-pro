const { Console } = require("../");
const colors = require("colors");
con = new Console({ auto_reduce_indent: true });

var t1 = con.time(con.flagHead("T1"));
con.log("zzzz")
con.timeEnd(t1);