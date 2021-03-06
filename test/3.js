const {
    ConsolePro
} = require("../");
con = new ConsolePro({
    auto_reduce_indent: true
});

// const {performance}  = require("perf_hooks")
// const start_time = performance.now();
var t1 = con.time(con.flagHead("T1", false));
con.info("INFO!!!!", {
    a: 1,
    b: 2,
    c: 3,
    d: 4
});
con.error(new Error("error!!"));
var g1 = con.group(con.flagHead("G1", false));
var t2 = con.time(con.flagHead("T2", false));
var g2 = con.group(con.flagHead("G2", false));
con.groupEnd(g1, "Group 1 End.");
con.warn("WARING!!!!");
con.timeEnd(t2);
con.success("SUCCESS!!!!");
con.groupEnd(g2, "Group 2 End.");
con.timeEnd(t1);

// const end_time = performance.now();
// console.log(end_time-start_time)