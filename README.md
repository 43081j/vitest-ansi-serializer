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

## Supported ANSI codes

The following ANSI codes are supported:

<details>
<summary>Cursor</summary>
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
| `S`    | Scroll up               | `<cursor.scrollUp>`   |
| `T`    | Scroll down             | `<cursor.scrollDown>` |

</details>

<details>
<summary>Erase</summary>
<br />

| Code      | Description         | Serialization       |
| --------- | ------------------- | ------------------- |
| `2J`      | Erase screen        | `<erase.screen>`    |
| `J`, `0J` | Erase down          | `<erase.down>`      |
| `1J`      | Erase up            | `<erase.up>`        |
| `K`, `0K` | Erase to line end   | `<erase.lineEnd>`   |
| `1K`      | Erase to line start | `<erase.lineStart>` |
| `2K`      | Erase line          | `<erase.line>`      |
| `c`       | Erase reset         | `<erase.reset>`     |

</details>

<details>
<summary>Styles</summary>
<br />

| Code  | Description     | Serialization  |
| ----- | --------------- | -------------- |
| `0m`  | Reset           | `<reset>`      |
| `1m`  | Bold            | `<bold>`       |
| `2m`  | Dim             | `<dim>`        |
| `3m`  | Italic          | `<italic>`     |
| `4m`  | Underline       | `<underline>`  |
| `22m` | Reset bold      | `</bold>`      |
| `23m` | Reset italic    | `</italic>`    |
| `24m` | Reset underline | `</underline>` |

</details>

<details>
<summary>Colors</summary>
<br />

| Code  | Description                | Serialization  |
| ----- | -------------------------- | -------------- |
| `30m` | Black                      | `<black>`      |
| `31m` | Red                        | `<red>`        |
| `32m` | Green                      | `<green>`      |
| `33m` | Yellow                     | `<yellow>`     |
| `34m` | Blue                       | `<blue>`       |
| `35m` | Magenta                    | `<magenta>`    |
| `36m` | Cyan                       | `<cyan>`       |
| `37m` | White                      | `<white>`      |
| `39m` | Default (reset)            | `</fg>`        |
| `90m` | Dim (gray/bright black)    | `<dim>`        |
| `40m` | Background black           | `<bg:black>`   |
| `41m` | Background red             | `<bg:red>`     |
| `42m` | Background green           | `<bg:green>`   |
| `43m` | Background yellow          | `<bg:yellow>`  |
| `44m` | Background blue            | `<bg:blue>`    |
| `45m` | Background magenta         | `<bg:magenta>` |
| `46m` | Background cyan            | `<bg:cyan>`    |
| `47m` | Background white           | `<bg:white>`   |
| `49m` | Default background (reset) | `</bg>`        |

</details>

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
