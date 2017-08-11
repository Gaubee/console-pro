const { Console } = require("../");
const myconsole = new Console({ async_log: true, auto_reduce_indent: true });

const g1 = myconsole.group("G1 Start!"); // no color
const g2 = myconsole.group(myconsole.flagHead("G2")); // use flag's color
const g3 = myconsole.group(Console.COLOR.bgBlueWithWhite, "G3"); // use custom color
const g4 = myconsole.group("G4".green); // use colors api to change string color

myconsole.info("QAQ");
myconsole.warn("QAQ");

myconsole.groupEnd(g3, "G3 IS OVER");
myconsole.groupEnd(g2, "G2 IS OVER");

myconsole.success("QAQ");
myconsole.error("QAQ");

myconsole.groupEnd(g4, "G4 IS OVER");
myconsole.groupEnd(g1, "G1 IS OVER");