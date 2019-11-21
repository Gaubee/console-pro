import { Console } from "console";
import { EventEmitter } from "events";
export const noop = () => { };
export const fackWriter = new class FackWriter extends EventEmitter {
  cachedBuffers = [] as Uint8Array[];
  write(buffer: Buffer | Uint8Array | string, encoding?: any) {
    if (typeof buffer === "string") {
      buffer = Buffer.from(buffer, encoding);
    }
    this.cachedBuffers.push(buffer);
  }
}();
export const fackConsole = new Console(fackWriter as any, fackWriter as any);
