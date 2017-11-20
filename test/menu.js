const {
    Console
} = require("../");
con = new Console({
    auto_reduce_indent: true
});
async function test() {
    const g = con.group("gg")
    const menu = con.menu("搞事情哦？", "呵呵呵");
    menu.add('是', true)
    menu.add('否', false)
    con.success('res:', await menu.selected_options);
    con.groupEnd(g);
}
test().catch(con.error.bind(con));