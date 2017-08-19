var consolePro = require("../");
const { Console } = consolePro;
const myconsole = new Console({
	async_log: true,
	auto_reduce_indent: true,
	silence: process.argv.indexOf("-s") != -1
});
const g1 = myconsole.group("G1 Start!");

myconsole.info("QAQ");
myconsole.warn("QAQ");
myconsole.success("QAQ");
myconsole.error("QAQ");

myconsole.groupEnd(g1, "G1 IS OVER");
