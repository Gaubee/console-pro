const MOVE_LEFT_BUFFER = new Uint8Array(Buffer.from("1b5b3130303044", "hex"));
export class ConsoleStdOut {
  constructor(public outter: NodeJS.WriteStream | import("tty").WriteStream) {}
  addListener = this.outter.addListener.bind(this.outter);
  on = this.outter.on.bind(this.outter);
  once = this.outter.once.bind(this.outter);
  removeListener = this.outter.removeListener.bind(this.outter);
  off = this.outter.off.bind(this.outter);
  removeAllListeners = this.outter.removeAllListeners.bind(this.outter);
  setMaxListeners = this.outter.setMaxListeners.bind(this.outter);
  getMaxListeners = this.outter.getMaxListeners.bind(this.outter);
  listeners = this.outter.listeners.bind(this.outter);
  rawListeners = this.outter.rawListeners.bind(this.outter);
  emit = this.outter.emit.bind(this.outter);
  listenerCount = this.outter.listenerCount.bind(this.outter);
  prependListener = this.outter.prependListener.bind(this.outter);
  prependOnceListener = this.outter.prependOnceListener.bind(this.outter);
  eventNames = this.outter.eventNames.bind(this.outter);

  //#region TTY

  get columns() {
    return this.outter.columns;
  }
  get rows() {
    return this.outter.rows;
  }
  get isTTY() {
    return this.outter.isTTY;
  }
  get getColorDepth() {
    return "getColorDepth" in this.outter
      ? this.outter.getColorDepth.bind(this.outter)
      : undefined;
  }
  get hasColors() {
    return "hasColors" in this.outter
      ? (this.outter as any)["hasColors"].bind(this.outter)
      : undefined;
  }
  get clearLine() {
    return "clearLine" in this.outter
      ? this.outter.clearLine.bind(this.outter)
      : undefined;
  }
  get clearScreenDown() {
    return "clearScreenDown" in this.outter
      ? this.outter.clearScreenDown.bind(this.outter)
      : undefined;
  }
  get cursorTo() {
    return "cursorTo" in this.outter
      ? this.outter.cursorTo.bind(this.outter)
      : undefined;
  }
  //#endregion

  /**是否在开头的地方加入新的一行 */
  new_line_at_start = false;
  writable = true;
  beforeBuffer?: Buffer;

  baseWrite(buffer: Buffer | Uint8Array | string, encoding?: any, cb?: any) {
    if (typeof buffer === "string") {
      buffer = Buffer.from(buffer, encoding);
    } else {
      cb = encoding;
    }
    const { beforeBuffer } = this;
    if (beforeBuffer) {
      const bufferLines: Uint8Array[] = [];
      do {
        const after_index: number = buffer.indexOf(0x0a) + 1;
        if (after_index === 0 || after_index === buffer.length) {
          bufferLines.push(buffer);
          break;
        }
        if (bufferLines.length !== 0) {
          bufferLines.push(MOVE_LEFT_BUFFER);
        }
        bufferLines.push(buffer.slice(0, after_index));
        buffer = buffer.slice(after_index);
      } while (true);

      buffer = Buffer.concat(
        bufferLines.map(bufline => {
          const buf = Buffer.allocUnsafe(beforeBuffer.length + bufline.length);
          buf.set(beforeBuffer, 0);
          buf.set(bufline, beforeBuffer.length);
          return buf;
        })
      );
    }
    return this.outter.write(buffer, cb);
  }
  write(buffer: Buffer | Uint8Array | string, encoding?: any, cb?: any) {
    if (this.new_line_at_start) {
      this.new_line_at_start = false;
      //   this.baseWrite("\n");
    }
    return this.baseWrite(buffer, encoding, cb);
  }
  end(str?: any, encoding?: any, cb?: any) {
    if (typeof str !== "function") {
      this.write(str, encoding, cb);
    } else {
      if (typeof encoding === "function") {
        cb = encoding;
      }
      this.outter.end(cb);
    }
  }
}
