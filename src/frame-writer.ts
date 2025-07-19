import { Writable } from 'node:stream';
import {
  type CODE,
  type CONTROL_CODE,
  parse
} from '@ansi-tools/parser';
import {Frame} from './frame.js';

const isCursorCommand = (code: CODE): code is CONTROL_CODE => {
  return (
    (
    code.type === 'CSI' &&
    (code.command === 'H' ||
      code.command === 'A' ||
      code.command === 'B' ||
      code.command === 'C' ||
      code.command === 'D' ||
      code.command === 'E' ||
      code.command === 'F' ||
      code.command === 'G' ||
      code.command === 'T' ||
      code.command === 'S')) ||
    (code.type === 'ESC' &&
      (code.command === '8' || code.command === '7')) ||
    (code.type === 'DEC' &&
      (code.command === 'l' || code.command === 'h'))
  );
};

const isEraseCommand = (code: CODE): code is CONTROL_CODE => {
  return (
    (code.type === 'CSI' &&
    (code.command === 'J' || code.command === 'K')) ||
    (code.type === 'ESC' &&
     code.command === 'c')
  );
};

export class FrameWriter extends Writable {
  public get isFrameWriter(): boolean {
    return true;
  }

  public buffer: string[] = [];

  _write(
    chunk: string | Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): void {
    this.buffer.push(chunk.toString());
    callback();
  }

  public get frames(): string[] {
    const ast = parse(this.buffer.join(''));
    const frame = new Frame();

    for (const code of ast) {
      if (isCursorCommand(code)) {
        frame.cursorByCommand(code);
      } else if (isEraseCommand(code)) {
        frame.eraseByCommand(code);
      } else if (code.type === 'TEXT') {
        frame.push(code.raw);
      }
    }

    return frame.frames;
  }
}
