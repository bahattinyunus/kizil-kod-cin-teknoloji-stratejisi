import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { analyze } from '../src/analysis.ts';

describe('Strategic Analysis Module Tests', () => {
  it('should return empty analysis when dataset is empty', () => {
    const res = analyze([], []);
    assert.strictEqual(res.totalItems, 0);
    assert.strictEqual(res.tagReadiness.length, 0);
    assert.strictEqual(res.overallAutonomyScore, 0);
  });

  it('should analyze dataset and compute tag readiness with strategic autonomy index', () => {
    const dataset = [
      { id: 'd-1', title: 'Çip Fabrikası', tags: ['yarıiletken'] },
      { id: 'd-2', title: 'Batarya Üretimi', tags: ['batarya'] }
    ];
    const textSamples = [
      { id: 'd-1', title: 'Çip Fabrikası', content: 'Seri üretim ve ticari satış başlamıştır.' },
      { id: 'd-2', title: 'Batarya Üretimi', content: 'Laboratuvar simülasyonu ve testleri sürüyor.' }
    ];

    const result = analyze(dataset, textSamples);
    assert.strictEqual(result.totalItems, 2);
    assert.strictEqual(result.tagReadiness.length, 2);
    assert.ok(result.overallAutonomyScore > 0);
    assert.ok(result.synergies.length > 0);
    assert.ok(result.highlights.length > 0);
  });
});
