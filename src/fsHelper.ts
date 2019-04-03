import { existsSync, lstatSync, mkdirSync } from "fs";
import { resolve, sep } from "path";
export function checkAndMakeDir(dirpath: string) {
  if (!(existsSync(dirpath) && lstatSync(dirpath).isDirectory())) {
    mkdirSync(dirpath);
  }
}
export function checkAndMakeDirs(base_path: string, rest_path: string) {
  base_path = resolve(base_path);
  const full_path = resolve(base_path, rest_path);
  rest_path = full_path.substr(base_path.length);
  const path_parts = rest_path.split(sep);
  var cur_path = base_path;
  for (let path_part of path_parts) {
    cur_path += sep + path_part;
    checkAndMakeDir(cur_path);
  }
}
