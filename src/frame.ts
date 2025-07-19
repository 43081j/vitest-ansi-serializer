import {CONTROL_CODE} from "@ansi-tools/parser";

export class Frame {
  #buffer: string[] = [];
  #cursorX: number = 0;
  #cursorY: number = 0;
  #frames: string[] = [];

  get frames(): string[] {
    return [
      ...this.#frames,
      this.#buffer.join('\n')
    ];
  }

  get cursor(): [x: number, y: number] {
    return [this.#cursorX, this.#cursorY];
  }

  get line(): string {
    return this.#buffer[this.#cursorY] || '';
  }

  cursorUp(count: number): void {
    this.#cursorY = Math.max(0, this.#cursorY - count);
  }

  cursorDown(count: number): void {
    this.#cursorY = Math.min(this.#buffer.length, this.#cursorY + count);
  }

  cursorTo(x: number, y: number): void {
    this.#cursorY = Math.max(0, Math.min(this.#buffer.length, y));
    this.#cursorX = Math.max(0, Math.min(this.line.length, x));
  }

  cursorForward(count: number): void {
    this.#cursorX = Math.min(this.line.length, this.#cursorX + count);
  }

  cursorBackward(count: number): void {
    this.#cursorX = Math.max(0, this.#cursorX - count);
  }

  push(text: string): void {
    const parts = text.split('\n');

    if (parts.length === 0) {
      return;
    }

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];

      if (i === 0) {
        const lastBufferPart = this.#buffer[this.#buffer.length - 1];
        this.#buffer[this.#buffer.length - 1] = lastBufferPart + part;
      } else {
        this.#buffer.push(part);
      }
    }

    this.cursorTo(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  }

  cursorByCommand(code: CONTROL_CODE): void {
    if (code.command === 'H') {
      this.cursorTo(
        code.params[0] ? parseInt(code.params[0]) - 1 : 0,
        code.params[1] ? parseInt(code.params[1]) - 1 : 0
      );
      return;
    }

    const multiplier = code.params[0] ? parseInt(code.params[0]) : 1;

    switch (code.command) {
      case 'A':
        this.cursorUp(multiplier);
        break;
      case 'B':
        this.cursorDown(multiplier);
        break;
      case 'C':
        this.cursorForward(multiplier);
        break;
      case 'D':
        this.cursorBackward(multiplier);
        break;
      case 'E':
        this.cursorTo(0, this.#cursorY + multiplier);
        break;
      case 'F':
        this.cursorTo(0, this.#cursorY - multiplier);
        break;
      case 'G':
        this.cursorTo(multiplier - 1, this.#cursorY);
        break;
    }
  }

  eraseAll(): void {
    this.#pushFrame();
    this.#buffer = [];
    this.cursorTo(0, 0);
  }

  #pushFrame(): void {
    this.#frames.push(this.#buffer.join('\n'));
  }

  eraseLine(): void {
    this.#pushFrame();
    this.#buffer[this.#cursorY] = '';
    this.cursorTo(0, this.#cursorY);
  }

  eraseToEndOfLine(): void {
    this.#pushFrame();
    const line = this.#buffer[this.#cursorY];

    if (line === undefined) {
      return;
    }

    this.#buffer[this.#cursorY] = line.slice(0, this.#cursorX);
  }

  eraseToStartOfLine(): void {
    this.#pushFrame();
    const line = this.#buffer[this.#cursorY];

    if (line === undefined) {
      return;
    }

    this.#buffer[this.#cursorY] = ' '.repeat(this.#cursorX) + line.slice(this.#cursorX);
  }

  eraseToEnd(): void {
    this.#pushFrame();
    this.eraseToEndOfLine();
    this.#buffer.splice(this.#cursorY + 1);
  }

  eraseToStart(): void {
    this.#pushFrame();
    this.eraseToStartOfLine();
    this.#buffer.splice(0, this.#cursorY);
    this.cursorTo(this.#cursorX, 0);
  }

  eraseByCommand(code: CONTROL_CODE): void {
    if (code.type === 'ESC' && code.command === 'c') {
      this.eraseAll();
      return;
    }
    const flag = code.params[0] ? parseInt(code.params[0]) : 0;
    if (code.command === 'J') {
      switch (flag) {
        case 0:
          this.eraseToEnd();
          break;
        case 1:
          this.eraseToStart();
          break;
        case 2:
          this.eraseAll();
          break;
      }
    } else if (code.command === 'K') {
      switch (flag) {
        case 0:
          this.eraseToEndOfLine();
          break;
        case 1:
          this.eraseToStartOfLine();
          break;
        case 2:
          this.eraseLine();
          break;
      }
    }
  }
}
