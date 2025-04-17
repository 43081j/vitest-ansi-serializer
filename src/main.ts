import type {SnapshotSerializer} from 'vitest';

const cursorCodes = {
  '?25l': 'hide',
  '?25h': 'show',
  '7': 'save',
  '8': 'restore'
} as const;
const repeatableCursorCodes = {
  A: 'up',
  B: 'down',
  C: 'forward',
  D: 'backward',
  E: 'nextLine',
  F: 'prevLine',
  G: 'left',
  S: 'scrollUp',
  T: 'scrollDown'
} as const;
const eraseCodes = {
  '2J': 'screen',
  J: 'down',
  '0J': 'down',
  '1J': 'up',
  K: 'lineEnd',
  '0K': 'lineEnd',
  '1K': 'lineStart',
  '2K': 'line',
  c: 'reset'
} as const;

const pattern = /\x1B([78]|\[(?:\?25[lh]|\d+;\d+H|\d*[A-Z]+))/g;
const repeatedPattern = /^(?<count>\d*)(?<code>[a-zA-Z])$/;
const lineColumnPattern = /^(?<line>\d+);(?<column>\d+)H$/;

function replaceAnsiCodes(str: string): string {
  return str.replaceAll(pattern, (str, codeOrPrefixed: string) => {
    const code = codeOrPrefixed.startsWith('[')
      ? codeOrPrefixed.slice(1)
      : codeOrPrefixed;
    if (code in cursorCodes) {
      return `<cursor.${cursorCodes[code as never]}>`;
    }
    if (code in eraseCodes) {
      return `<erase.${eraseCodes[code as never]}>`;
    }
    const repeatMatch = code.match(repeatedPattern);
    if (repeatMatch?.groups) {
      const count = repeatMatch.groups.count || '1';
      const key = repeatMatch.groups.code;
      if (key in repeatableCursorCodes) {
        return `<cursor.${repeatableCursorCodes[key as never]} count=${count}>`;
      }
    }
    const lineColumnMatch = code.match(lineColumnPattern);
    if (lineColumnMatch) {
      const lineNumber = lineColumnMatch.groups?.line;
      const lineColumn = lineColumnMatch.groups?.column;
      return `<cursor.moveTo line=${lineNumber} column=${lineColumn}>`;
    }
    return str;
  });
}

const ansiSerializer: SnapshotSerializer = {
  serialize(val, config, indentation, depth, refs, printer) {
    const newValue = replaceAnsiCodes(val);
    // TODO (43081j): maybe there's a way to not do this?
    // `printer` will call this plugin recursively since the `test` below
    // will always pass for a string.
    // Ideally, the `test` would test that this is a string we haven't already
    // processed. You can't just test for ANSI codes though, as we may not
    // replace all of them so would still enter recursion hell.
    const newConfig = {
      ...config,
      plugins: config.plugins.filter((plugin) => plugin !== ansiSerializer)
    };
    return printer(newValue, newConfig, indentation, depth, refs);
  },
  test(val) {
    return typeof val === 'string';
  }
};

export default ansiSerializer;
