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

| Name                    | Code   | Serialization         |
| ----------------------- | ------ | --------------------- |
| Cursor hide             | `?25l` | `<cursor.hide>`       |
| Cursor show             | `?25h` | `<cursor.show>`       |
| Cursor save position    | `7`    | `<cursor.save>`       |
| Cursor restore position | `8`    | `<cursor.restore>`    |
| Cursor up               | `A`    | `<cursor.up>`         |
| Cursor down             | `B`    | `<cursor.down>`       |
| Cursor forward          | `C`    | `<cursor.forward>`    |
| Cursor backward         | `D`    | `<cursor.backward>`   |
| Cursor next line        | `E`    | `<cursor.nextLine>`   |
| Cursor previous line    | `F`    | `<cursor.prevLine>`   |
| Cursor left             | `G`    | `<cursor.left>`       |
| Scroll up               | `S`    | `<cursor.scrollUp>`   |
| Scroll down             | `T`    | `<cursor.scrollDown>` |

</details>

<details>
<summary>Erase</summary>
<br />

| Name                | Code      | Serialization       |
| ------------------- | --------- | ------------------- |
| Erase screen        | `2J`      | `<erase.screen>`    |
| Erase down          | `J`, `0J` | `<erase.down>`      |
| Erase up            | `1J`      | `<erase.up>`        |
| Erase to line end   | `K`, `0K` | `<erase.lineEnd>`   |
| Erase to line start | `1K`      | `<erase.lineStart>` |
| Erase line          | `2K`      | `<erase.line>`      |
| Erase reset         | `c`       | `<erase.reset>`     |

</details>

<details>
<summary>Styles</summary>
<br />

| Name            | Code  | Serialization  |
| --------------- | ----- | -------------- |
| Reset           | `0m`  | `<reset>`      |
| Bold            | `1m`  | `<bold>`       |
| Dim             | `2m`  | `<dim>`        |
| Italic          | `3m`  | `<italic>`     |
| Underline       | `4m`  | `<underline>`  |
| Reset bold      | `22m` | `</bold>`      |
| Reset italic    | `23m` | `</italic>`    |
| Reset underline | `24m` | `</underline>` |

</details>

<details>
<summary>Colors</summary>
<br />

| Name                       | Code  | Serialization  |
| -------------------------- | ----- | -------------- |
| Black                      | `30m` | `<black>`      |
| Red                        | `31m` | `<red>`        |
| Green                      | `32m` | `<green>`      |
| Yellow                     | `33m` | `<yellow>`     |
| Blue                       | `34m` | `<blue>`       |
| Magenta                    | `35m` | `<magenta>`    |
| Cyan                       | `36m` | `<cyan>`       |
| White                      | `37m` | `<white>`      |
| Default (reset)            | `39m` | `</fg>`        |
| Dim (gray/bright black)    | `90m` | `<dim>`        |
| Background black           | `40m` | `<bg:black>`   |
| Background red             | `41m` | `<bg:red>`     |
| Background green           | `42m` | `<bg:green>`   |
| Background yellow          | `43m` | `<bg:yellow>`  |
| Background blue            | `44m` | `<bg:blue>`    |
| Background magenta         | `45m` | `<bg:magenta>` |
| Background cyan            | `46m` | `<bg:cyan>`    |
| Background white           | `47m` | `<bg:white>`   |
| Default background (reset) | `49m` | `</bg>`        |

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
