const {
    Console
} = require("../");
con = new Console({
    auto_reduce_indent: true
});

async function test() {
    for (let i = 0; i < 100; i += 1) {
        await new Promise(cb => setTimeout(cb, 20));
        con.line('进度：', i)
    }
}
test().catch(con.error.bind(con));