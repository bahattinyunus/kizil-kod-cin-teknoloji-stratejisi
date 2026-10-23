import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { run } from '../src/index.ts';

describe('Index Module Test', () => {
  it('runs without throwing', () => {
    assert.doesNotThrow(() => run());
  });
});
