import {test, expect, suite, SnapshotSerializer} from 'vitest';
import ansiSerializer from '../src/main.js';
import {cursor, erase, scroll} from 'sisteransi';

type NewSnapshotSerializer = Exclude<SnapshotSerializer, {print: unknown}>;

const serializer = ansiSerializer as NewSnapshotSerializer;

const mockConfig: Parameters<NewSnapshotSerializer['serialize']>[1] =
  {} as never;
const toString = (val: unknown) => String(val);
const basicSerialize = (input: unknown) =>
  serializer.serialize(input, mockConfig, '', 0, [], toString);

const serializeCases: Array<[name: string, input: string]> = [
  ['cursor.backward()', `foo${cursor.backward()}`],
  ['cursor.backward(n)', `foo${cursor.backward(2)}`],
  ['cursor.down()', `foo${cursor.down()}`],
  ['cursor.down(n)', `foo${cursor.down(2)}`],
  ['cursor.forward()', `foo${cursor.forward()}`],
  ['cursor.forward(n)', `foo${cursor.forward(2)}`],
  ['cursor.hide', `foo${cursor.hide}`],
  ['cursor.left', `foo${cursor.left}`],
  ['cursor.move(1, 2)', `foo${cursor.move(1, 2)}`],
  ['cursor.nextLine()', `foo${cursor.nextLine()}`],
  ['cursor.nextLine(n)', `foo${cursor.nextLine(2)}`],
  ['cursor.prevLine()', `foo${cursor.prevLine()}`],
  ['cursor.prevLine(n)', `foo${cursor.prevLine(2)}`],
  ['cursor.restore', `foo${cursor.restore}`],
  ['cursor.save', `foo${cursor.save}`],
  ['cursor.show', `foo${cursor.show}`],
  ['cursor.to(1, 2)', `foo${cursor.to(1, 2)}`],
  ['cursor.up', `foo${cursor.up()}`],
  ['cursor.up(n)', `foo${cursor.up(2)}`],
  ['erase.down(1)', `foo${erase.down(1)}`],
  ['erase.line', `foo${erase.line}`],
  ['erase.lineEnd', `foo${erase.lineEnd}`],
  ['erase.lineStart', `foo${erase.lineStart}`],
  ['erase.lines(1)', `foo${erase.lines(1)}`],
  ['erase.lines(10)', `foo${erase.lines(10)}`],
  ['erase.screen', `foo${erase.screen}`],
  ['erase.up()', `foo${erase.up()}`],
  ['erase.up(n)', `foo${erase.up(2)}`],
  ['scroll.down()', `foo${scroll.down()}`],
  ['scroll.down(n)', `foo${scroll.down(2)}`],
  ['scroll.up()', `foo${scroll.up()}`],
  ['scroll.up(n)', `foo${scroll.up(2)}`],
  ['multiple cursor movements', `foo${cursor.up(3)}bar${cursor.backward(10)}`]
];
suite('serializer', () => {
  suite('serialize', () => {
    test('returns non-ansi string unchanged', () => {
      const input = 'choo choo';
      expect(basicSerialize(input)).toMatchSnapshot();
    });

    test.for(serializeCases)('%s', ([_name, input]) => {
      expect(basicSerialize(input)).toMatchSnapshot();
    });
  });

  suite('test', () => {
    test('returns true for string', () => {
      const result = serializer.test('string');
      expect(result).toBe(true);
    });

    test('returns false for non-string', () => {
      const result = serializer.test(123);
      expect(result).toBe(false);
    });
  });
});
