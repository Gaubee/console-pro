import { Console } from "console";
export const noop = () => {};
export const fackWriter = new class FackWriter {
  cachedBuffers = [] as Uint8Array[];
  write(buffer: Buffer | Uint8Array | string, encoding?: any) {
    if (typeof buffer === "string") {
      buffer = Buffer.from(buffer, encoding);
    }
    this.cachedBuffers.push(buffer);
  }
  addListener = noop;
  on = noop;
  once = noop;
  removeListener = noop;
  off = noop;
  removeAllListeners = noop;
}();
export const fackConsole = new Console(fackWriter as any, fackWriter as any);
