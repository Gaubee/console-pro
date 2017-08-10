const { Console } = require("../");
con = new Console();
var t1 = con.time("aaa", 1);
var t2 = con.time("aaa", 2);
con.log("hahha");
con.timeEnd(t1,"aaa", 2);
con.timeEnd(t2,"aaa", 1);

con.group("xx");
con.log({
	a: "a",
	b: "QAQ",
	ssssssssssssssssssssssssssssss: [1, 2, 3, 3, , 4, , , 5, , , 6]
});
con.log("hahha1");
con.group("xx");
con.log("hahha2");
con.group("xx");
con.log("hahha3");
con.groupEnd("haha1");
con.log("hahha4");
con.groupEnd("haha2");
con.log("hahha5");
con.error(new Error("asd").stack);
con.groupEnd("haha3");

con = new Console();
var _3 = con.group("0".red);
var _0 = con.group("0".blue);
var _1 = con.group("1".yellow);
var _2 = con.group("2".green);
con.log({
	test: "zzz",
	zzz: {
		cc: [1, 2, 3, 4, 5, 6],
		dd: [1, 2, 3, 4, 5, 6]
	},
	f: () => {}
});
con.groupEnd(_1, "1");
con.groupEnd(_3, "0");
con.groupEnd(_2, "2");
var _4 = con.group("4".yellow);
var _5 = con.group("5".green);
var _6 = con.group("6".red);
con.log({
	test: "zzz",
	zzz: {
		cc: [1, 2, 3, 4, 5, 6],
		dd: [1, 2, 3, 4, 5, 6]
	},
	f: () => {}
});
con.groupEnd(_5, "5");
con.groupEnd(_0, "0");
con.groupEnd(_4, "4");
con.groupEnd(_6, "6");

console.log("((̵̵́ ̆͒͟˚̩̭ ̆͒)̵̵̀)");
