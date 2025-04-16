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
import { expect } from 'vitest';
import { ansiSerializer } from 'vitest-ansi-serializer';

expect.addSnapshotSerializer(ansiSerializer);
```

## Supported ANSI codes

The following ANSI codes are supported:

- `cursor.hide` (`?25l`)
- `cursor.show` (`?25h`)
- `cursor.save` (`7`)
- `cursor.restore` (`8`)
- `cursor.up` (`A`)
- `cursor.down` (`B`)
- `cursor.forward` (`C`)
- `cursor.backward` (`D`)
- `cursor.nextLine` (`E`)
- `cursor.prevLine` (`F`)
- `cursor.left` (`G`)
- `cursor.scrollUp` (`S`)
- `cursor.scrollDown` (`T`)
- `erase.screen` (`2J`)
- `erase.down` (`J`, `0J`)
- `erase.up` (`1J`)
- `erase.lineEnd` (`K`, `0K`)
- `erase.lineStart` (`1K`)
- `erase.line` (`2K`)
- `erase.reset` (`c`)

These will be made human readable in snapshots in the form of XML-like tags:

```xml
<cursor.down count=1>
```

## License

MIT
