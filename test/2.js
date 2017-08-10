const { Console } = require("../");
function test(
	info = "Automatically reduce indentation",
	auto_reduce_indent = true
) {
	con = new Console({ async_log: true, auto_reduce_indent });
	var g1 = con.group(con.flagHead("1"));
	var g2 = con.group(con.flagHead("2"));
	var g3 = con.group(con.flagHead("3"));
	var g4 = con.group(con.flagHead("4"));
	var g5 = con.group(con.flagHead("5"));
	con.log(info);
	con.groupEnd(g1, con.flagHead("End1"));
	con.log(info);
	con.log(info);
	con.groupEnd(g2, con.flagHead("End2"));
	con.log(info);
	con.log(info);
	con.log(info);
	con.groupEnd(g3, con.flagHead("End3"));
	con.log(info);
	con.log(info);
	con.log(info);
	con.log(info);
	con.groupEnd(g4, con.flagHead("End4"));
	con.log(info);
	con.log(info);
	con.log(info);
	con.log(info);
	con.log(info);
	var g6 = con.group(con.flagHead("6"));
	var g7 = con.group(con.flagHead("7"));
	var g8 = con.group(con.flagHead("8"));
	con.groupEnd(g5, con.flagHead("End5"));
	con.groupEnd(g7, con.flagHead("End7"));
	con.groupEnd(g6, con.flagHead("End6"));
	con.log("BOOM");
	con.log("BOOM");
	con.log("BOOM");
	con.groupEnd(g8, con.flagHead("End8"));
}
test("Automatically reduce indentation", true);
test("Disabled auto_reduce_indent", false);
