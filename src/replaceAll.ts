function escapeRegExp(string: string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
export function replaceAll(string: string, find: string, replace: string) {
  return string.replace(new RegExp(escapeRegExp(find), "g"), replace);
}
