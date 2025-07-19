import type {SnapshotSerializer} from 'vitest';
import {Frame} from './frame.js';
import {FrameWriter} from './frame-writer.js';

const ansiSerializer: SnapshotSerializer = {
  serialize(val, config, indentation, depth, refs, printer) {
    const newValue = val.frames;
    return printer(newValue, config, indentation, depth, refs);
  },
  test(val) {
    return typeof val === 'object' &&
      val !== null &&
      val.isFrameWriter === true;
  }
};

export default ansiSerializer;

export {FrameWriter, Frame};
