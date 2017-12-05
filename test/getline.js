const { Console } = require('../');
con = new Console({
	auto_reduce_indent: true
});
async function test() {
	const g = con.group('gg');
	const answer = await con.getTrimLine('搞事情哦？');
	con.success('res:', answer);
	con.groupEnd(g);
}
test().catch(con.error.bind(con));
