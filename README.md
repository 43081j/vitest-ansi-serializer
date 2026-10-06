# vitest-ansi-serializer

This package provides a snapshot serializer to be used with vitest.

It will serialize ANSI escape sequences into human-readable code in strings, to
allow for easier reading and diffing of snapshots.

## Install

```sh
npm i -D vitest-ansi-serializer
```

## Usage

As per the [vitest docs](https://vitest.dev/guide/snapshot.html#custom-serializer),
you can use the serializer like so:

```ts
import {expect} from 'vitest';
import ansiSerializer from 'vitest-ansi-serializer';

expect.addSnapshotSerializer(ansiSerializer);
```

### Serializing programmatically

This package also exports a serialization utility for use in other testing frameworks:

```ts
import test from 'node:test';
import assert from 'node:assert';
import {replaceAnsiCodes} from 'vitest-ansi-serializer';

test('serializes', () => {
  assert.equal(replaceAnsiCodes('\x1B[1mfoo\x1B[22m'), '<bold>foo</bold>');
});
```

## Supported ANSI codes

The following ANSI codes are supported:

<ul>

<li>
<details>
<summary>Cursor codes</summary>
<br />

| Code   | Description             | Serialization         |
| ------ | ----------------------- | --------------------- |
| `?25l` | Cursor hide             | `<cursor.hide>`       |
| `?25h` | Cursor show             | `<cursor.show>`       |
| `7`    | Cursor save position    | `<cursor.save>`       |
| `8`    | Cursor restore position | `<cursor.restore>`    |
| `A`    | Cursor up               | `<cursor.up>`         |
| `B`    | Cursor down             | `<cursor.down>`       |
| `C`    | Cursor forward          | `<cursor.forward>`    |
| `D`    | Cursor backward         | `<cursor.backward>`   |
| `E`    | Cursor next line        | `<cursor.nextLine>`   |
| `F`    | Cursor previous line    | `<cursor.prevLine>`   |
| `G`    | Cursor left             | `<cursor.left>`       |
| `H`    | Cursor to line/column   | `<cursor.moveTo>`     |
| `S`    | Scroll up               | `<cursor.scrollUp>`   |
| `T`    | Scroll down             | `<cursor.scrollDown>` |

</details>
</li>

<li>
<details>
<summary>Erase codes</summary>
<br />

| Code      | Description            | Serialization       |
| --------- | ---------------------- | ------------------- |
| `2J`      | Erase screen           | `<erase.screen>`    |
| `J`, `0J` | Erase down             | `<erase.down>`      |
| `1J`      | Erase up               | `<erase.up>`        |
| `K`, `0K` | Erase to line end      | `<erase.lineEnd>`   |
| `1K`      | Erase to line start    | `<erase.lineStart>` |
| `2K`      | Erase line             | `<erase.line>`      |
| `c`       | Reset to initial state | `<erase.reset>`     |

</details>
</li>

<li>
<details>
<summary>Style codes</summary>
<br />

| Code  | Description         | Serialization       |
| ----- | ------------------- | ------------------- |
| `0m`  | Reset               | `<reset>`           |
| `1m`  | Bold                | `<bold>`            |
| `2m`  | Dim                 | `<dim>`             |
| `3m`  | Italic              | `<italic>`          |
| `4m`  | Underline           | `<underline>`       |
| `5m`  | Blink               | `<blink>`           |
| `7m`  | Inverse             | `<inverse>`         |
| `8m`  | Hidden              | `<hidden>`          |
| `9m`  | Strikethrough       | `<strikethrough>`   |
| `21m` | Double underline    | `<doubleunderline>` |
| `51m` | Framed              | `<framed>`          |
| `53m` | Overlined           | `<overlined>`       |
| `22m` | Reset bold          | `</bold>`           |
| `23m` | Reset italic        | `</italic>`         |
| `24m` | Reset underline     | `</underline>`      |
| `25m` | Reset blink         | `</blink>`          |
| `27m` | Reset inverse       | `</inverse>`        |
| `28m` | Reset hidden        | `</hidden>`         |
| `29m` | Reset strikethrough | `</strikethrough>`  |
| `54m` | Reset framed        | `</framed>`         |
| `55m` | Reset overlined     | `</overlined>`      |

</details>
</li>

<li>
<details>
<summary>Color codes</summary>
<br />

| Code   | Description                | Serialization        |
| ------ | -------------------------- | -------------------- |
| `30m`  | Black                      | `<black>`            |
| `31m`  | Red                        | `<red>`              |
| `32m`  | Green                      | `<green>`            |
| `33m`  | Yellow                     | `<yellow>`           |
| `34m`  | Blue                       | `<blue>`             |
| `35m`  | Magenta                    | `<magenta>`          |
| `36m`  | Cyan                       | `<cyan>`             |
| `37m`  | White                      | `<white>`            |
| `39m`  | Default (reset)            | `</fg>`              |
| `90m`  | Bright black               | `<grey>`             |
| `91m`  | Bright red                 | `<redBright>`        |
| `92m`  | Bright green               | `<greenBright>`      |
| `93m`  | Bright yellow              | `<yellowBright>`     |
| `94m`  | Bright blue                | `<blueBright>`       |
| `95m`  | Bright magenta             | `<magentaBright>`    |
| `96m`  | Bright cyan                | `<cyanBright>`       |
| `97m`  | Bright white               | `<whiteBright>`      |
| `40m`  | Background black           | `<bg:black>`         |
| `41m`  | Background red             | `<bg:red>`           |
| `42m`  | Background green           | `<bg:green>`         |
| `43m`  | Background yellow          | `<bg:yellow>`        |
| `44m`  | Background blue            | `<bg:blue>`          |
| `45m`  | Background magenta         | `<bg:magenta>`       |
| `46m`  | Background cyan            | `<bg:cyan>`          |
| `47m`  | Background white           | `<bg:white>`         |
| `49m`  | Default background (reset) | `</bg>`              |
| `100m` | Background bright black    | `<bg:grey>`          |
| `101m` | Background bright red      | `<bg:redBright>`     |
| `102m` | Background bright green    | `<bg:greenBright>`   |
| `103m` | Background bright yellow   | `<bg:yellowBright>`  |
| `104m` | Background bright blue     | `<bg:blueBright>`    |
| `105m` | Background bright magenta  | `<bg:magentaBright>` |
| `106m` | Background bright cyan     | `<bg:cyanBright>`    |
| `107m` | Background bright white    | `<bg:whiteBright>`   |

</details>
</li>

<li>
<details>
<summary>Terminal links</summary>
<br />

`ST`- and `BEL`-terminated links are supported:

```xml
<!-- ST: \x1B]8;;https://example.com\x1B\\foo\x1B]8;;\x1B\\ -->
<link url=https://example.com>foo</link>

<!-- BEL: \x1B]8;id=1:foo=bar;file://path/to/file.txt\x07baz\x1B]8;;\x07 -->
<link url=file://path/to/file.txt>baz</link>
```

</details>
</li>
</ul>

These will be made human readable in snapshots in the form of XML-like tags:

```xml
<!-- \x1B[1B -->
<cursor.down count=1>

<!-- \x1B[34mfoo\x1B[39m -->
<blue>foo</fg>
```

See [main.test.ts.snap](./test/__snapshots__/main.test.ts.snap) for more examples of what this looks like.

## License

MIT
