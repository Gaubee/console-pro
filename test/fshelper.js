const { checkAndMakeDirs } = require("../src/fsHelper");
const os = require("os");
checkAndMakeDirs(os.homedir(), "qaq/zzz/qqq");
