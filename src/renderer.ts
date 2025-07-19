import { Writable } from 'node:stream';
import type {SnapshotSerializer} from 'vitest';
import {
  type CONTROL_CODE,
  parse
} from '@ansi-tools/parser';
import {Frame} from './frame.js';

const isCursorCommand = (code: CONTROL_CODE): boolean => {
  return (
    code.type === 'CSI' &&
    (code.command === 'H' ||
      code.command === 'A' ||
      code.command === 'B' ||
      code.command === 'C' ||
      code.command === 'D' ||
      code.command === 'E' ||
      code.command === 'F' ||
      code.command === 'G')
  );
};

const isEraseCommand = (code: CONTROL_CODE): boolean => {
  return (
    (code.type === 'CSI' &&
    (code.command === 'J' || code.command === 'K')) ||
    (code.type === 'ESC' &&
     code.command === 'c')
  );
}

const formatCode = (code: CONTROL_CODE): string => {
  if (code.type === 'ESC') {
    if (code.command === '8') {
      return '<cursor.restore>';
    } else if (code.command === '7') {
      return '<cursor.save>';
    }
  }
  if (code.type === 'DEC') {
    if (code.params[0] === '?25') {
      if (code.command === 'l') {
        return '<cursor.hide>';
      } else if (code.command === 'h') {
        return '<cursor.show>';
      }
    }
  }
  if (code.type === 'CSI') {
    if (code.command === 'T') {
      return `<cursor.scrollDown count=${code.params[0] || 1}>`;
    }
    if (code.command === 'S') {
      return `<cursor.scrollUp count=${code.params[0] || 1}>`;
    }
  }
  return code.raw;
}

export class Output extends Writable {
  public get isOutputWriter(): boolean {
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
      switch (code.type) {
        case 'CSI': {
          if (isCursorCommand(code)) {
            frame.cursorByCommand(code);
          } else if (isEraseCommand(code)) {
            frame.eraseByCommand(code);
          } else {
            frame.push(formatCode(code));
          }
          break;
        }
        case 'TEXT':
          frame.push(code.raw);
          break;
        default:
          frame.push(formatCode(code));
          break;
      }
    }

    return frame.frames;
  }
}

const ansiSerializer: SnapshotSerializer = {
  serialize(val, config, indentation, depth, refs, printer) {
    const newValue = val.frames;
    return printer(newValue, config, indentation, depth, refs);
  },
  test(val) {
    return typeof val === 'object' &&
      val !== null &&
      val.isOutputWriter === true;
  }
};

export default ansiSerializer;
