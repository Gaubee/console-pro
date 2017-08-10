const { Console } = require("../");
const con = new Console({ async_log: true, auto_reduce_indent: true });
(function() {
	const g1 = con.group(con.flagHead("G1"));
	con.log("GGG");
	const g7 = con.group(Console.COLOR.red, "G7");
	con.log("GGG");
	con.groupEnd(g7, "G7");
	con.groupEnd(g1, con.flagHead("G1"));
})();

(function() {
	const g1 = con.group(con.flagHead("G1"));
	con.log("GGG");
	const g7 = con.group(Console.COLOR.red, "G7");
	con.log("GGG");
	con.groupEnd(g1, con.flagHead("G1"));
	con.groupEnd(g7, "G7");
})();
