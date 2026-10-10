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

Escape sequences will be made human readable in snapshots in the form of XML-like tags:

```xml
<!-- \x1B[1B -->
<cursor.down count=1>

<!-- \x1B[34mfoo\x1B[39m -->
<blue>foo</fg>
```

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
<summary>Style and color codes</summary>
<br />

Style codes will be serialized as `<style>` and `</style>` tags:

```xml
<!-- \x1B[1mfoo\x1B[22m and \x1B[4mbar\x1B[24m -->
<bold>foo</bold> and <underline>bar</underline>
```

Foreground and background colors will be serialized as `<color>` and `<bg:color>`. Resets are `</fg>` and `</bg>`:

```xml
<!-- \x1B[34mfoo\x1B[39m and \x1B[41mbar\x1B[49m -->
<blue>foo</fg> and <bg:red>bar</bg>
```

The list of all supported colors can be found in [colors.ts](./src/colors.ts).

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

See [main.test.ts.snap](./test/__snapshots__/main.test.ts.snap) for more examples of what this looks like.

## License

MIT
