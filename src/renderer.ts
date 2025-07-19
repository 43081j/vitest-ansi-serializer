import { Writable } from 'node:stream';
import type {SnapshotSerializer} from 'vitest';

export interface TextToken {
  kind: 'text';
  value: string;
}

export interface ForegroundColorToken {
  kind: 'foregroundColor';
  code: number;
}

export interface BackgroundColorToken {
  kind: 'backgroundColor';
  code: number;
}

export interface ResetToken {
  kind: 'reset';
}

export interface CursorUpToken {
  kind: 'cursorUp';
  count: number;
}

export interface CursorDownToken {
  kind: 'cursorDown';
  count: number;
}

export interface CursorForwardToken {
  kind: 'cursorForward';
  count: number;
}

export interface CursorBackwardToken {
  kind: 'cursorBackward';
  count: number;
}

export interface CursorPositionToken {
  kind: 'cursorPosition';
  row: number;
  col: number;
}

export interface EraseDisplayToken {
  kind: 'eraseDisplay';
  mode: number;
}

export interface EraseLinesToken {
  kind: 'eraseLines';
  count: number;
}

export interface EraseLineToken {
  kind: 'eraseLine';
  mode: number;
}

export type AnsiToken =
  | TextToken
  | ForegroundColorToken
  | BackgroundColorToken
  | ResetToken
  | CursorUpToken
  | CursorDownToken
  | CursorForwardToken
  | CursorBackwardToken
  | CursorPositionToken
  | EraseDisplayToken
  | EraseLinesToken
  | EraseLineToken;

export function tokenize(input: string): AnsiToken[] {
  const tokens: AnsiToken[] = [];
  let i = 0;
  let textBuffer = '';

  const flushTextBuffer = () => {
    if (textBuffer.length > 0) {
      tokens.push({ kind: 'text', value: textBuffer });
      textBuffer = '';
    }
  };

  while (i < input.length) {
    // Check for ANSI escape sequence
    if (input[i] === '\x1b' && input[i + 1] === '[') {
      flushTextBuffer();

      // Find the end of the escape sequence
      let j = i + 2;
      let params = '';

      // Collect parameters (digits, semicolons)
      while (j < input.length && /[\d;]/.test(input[j])) {
        params += input[j];
        j++;
      }

      if (j < input.length) {
        const command = input[j];
        const paramNumbers = params ? params.split(';').map(p => parseInt(p, 10) || 0) : [];

        switch (command) {
          case 'm': // SGR (Select Graphic Rendition) - colors and styles
            if (paramNumbers.length === 0 || paramNumbers[0] === 0) {
              tokens.push({ kind: 'reset' });
            } else {
              for (const param of paramNumbers) {
                if (param >= 30 && param <= 37) {
                  tokens.push({ kind: 'foregroundColor', code: param });
                } else if (param >= 40 && param <= 47) {
                  tokens.push({ kind: 'backgroundColor', code: param });
                } else if (param >= 90 && param <= 97) {
                  tokens.push({ kind: 'foregroundColor', code: param });
                } else if (param >= 100 && param <= 107) {
                  tokens.push({ kind: 'backgroundColor', code: param });
                } else if (param === 0) {
                  tokens.push({ kind: 'reset' });
                }
              }
            }
            break;

          case 'A': // Cursor Up
            tokens.push({ kind: 'cursorUp', count: paramNumbers[0] || 1 });
            break;

          case 'B': // Cursor Down
            tokens.push({ kind: 'cursorDown', count: paramNumbers[0] || 1 });
            break;

          case 'C': // Cursor Forward
            tokens.push({ kind: 'cursorForward', count: paramNumbers[0] || 1 });
            break;

          case 'D': // Cursor Backward
            tokens.push({ kind: 'cursorBackward', count: paramNumbers[0] || 1 });
            break;

          case 'H': // Cursor Position
          case 'f': // Horizontal and Vertical Position
            tokens.push({
              kind: 'cursorPosition',
              row: paramNumbers[0] || 1,
              col: paramNumbers[1] || 1
            });
            break;

          case 'J': // Erase Display
            tokens.push({ kind: 'eraseDisplay', mode: paramNumbers[0] || 0 });
            break;

          case 'K': // Erase Line
            tokens.push({ kind: 'eraseLine', mode: paramNumbers[0] || 0 });
            break;

          case 'M': // Delete Lines
            tokens.push({ kind: 'eraseLines', count: paramNumbers[0] || 1 });
            break;
        }

        i = j + 1;
      } else {
        // Malformed escape sequence, treat as text
        textBuffer += input[i];
        i++;
      }
    } else {
      textBuffer += input[i];
      i++;
    }
  }

  flushTextBuffer();
  return tokens;
}

export class Writer extends Writable {
  public frames: string[] = [];
	public buffer: string[] = [];
  public cursorLine: number = 0;
  public cursorColumn: number = 0;

	_write(
		chunk: string | Buffer,
		_encoding: BufferEncoding,
		callback: (error?: Error | null | undefined) => void
	): void {
		this.buffer.push(chunk.toString());
		callback();
	}
}

const ansiSerializer: SnapshotSerializer = {
  serialize(val, config, indentation, depth, refs, printer) {
    const newValue = val.frames;
    return printer(newValue, config, indentation, depth, refs);
  },
  test(val) {
    return val instanceof Writer;
  }
};

export default ansiSerializer;
