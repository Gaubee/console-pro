const {
    Console
} = require("../");
con = new Console({
    auto_reduce_indent: true
});

async function test() {
    const g = con.group("gg")
    for (let i = 0; i <= 100; i += 1) {
        await new Promise(cb => setTimeout(cb, 10));
        con.line('进度：', i)
    }
    con.log("qaq")

    for (let i = 0; i <= 100; i += 1) {
        await new Promise(cb => setTimeout(cb, 10));
        con.line('进度：', i)
    }
    con.groupEnd(g);
}
test().catch(con.error.bind(con));