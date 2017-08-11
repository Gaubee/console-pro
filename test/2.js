const { Console } = require("../");
function test(
	info = "Automatically reduce indentation",
	auto_reduce_indent = true
) {
	con = new Console({ async_log: true, auto_reduce_indent });
	var g1 = con.group(con.flagHead("1", false));
	var g2 = con.group(con.flagHead("2", false));
	var g3 = con.group(con.flagHead("3", false));
	var g4 = con.group(con.flagHead("4", false));
	var g5 = con.group(con.flagHead("5", false));
	con.log(info);
	con.groupEnd(g1, con.flagHead("End1", false));
	con.log(info);
	con.log(info);
	con.groupEnd(g2, con.flagHead("End2", false));
	con.log(info);
	con.log(info);
	con.log(info);
	con.groupEnd(g3, con.flagHead("End3", false));
	con.log(info);
	con.log(info);
	con.log(info);
	con.log(info);
	con.groupEnd(g4, con.flagHead("End4", false));
	con.log(info);
	con.log(info);
	con.log(info);
	con.log(info);
	con.log(info);
	var g6 = con.group(con.flagHead("6", false));
	var g7 = con.group(con.flagHead("7", false));
	var g8 = con.group(con.flagHead("8", false));
	con.groupEnd(g5, con.flagHead("End5", false));
	con.groupEnd(g7, con.flagHead("End7", false));
	con.groupEnd(g6, con.flagHead("End6", false));
	con.log("BOOM");
	con.log("BOOM");
	con.log("BOOM");
	con.groupEnd(g8, con.flagHead("End8", false));
}
test("Automatically reduce indentation", true);
test("Disabled auto_reduce_indent", false);
