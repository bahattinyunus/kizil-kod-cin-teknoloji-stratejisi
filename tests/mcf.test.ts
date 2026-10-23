import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { assessMCF, loadActors } from '../src/mcf.ts';

describe('Military-Civil Fusion (MCF) Tests', () => {
  it('should load tech actors catalog', () => {
    const actors = loadActors();
    assert.ok(actors.length >= 8);
    assert.ok(actors.some((a) => a.name.includes('Huawei')));
    assert.ok(actors.some((a) => a.name.includes('SMIC')));
  });

  it('should evaluate MCF scores and categorize dual-use risks', () => {
    const mockDataset = [
      { id: '1', title: 'Savunma Uydusu', actor: 'CASC', mcfLevel: 'critical' },
      { id: '2', title: 'Tüketici Pili', actor: 'BYD', mcfLevel: 'low' },
      { id: '3', title: '5G İstasyonu', actor: 'Huawei', mcfLevel: 'high' }
    ];

    const result = assessMCF(mockDataset);
    assert.strictEqual(result.totalEvaluated, 3);
    assert.ok(result.averageDualUseScore > 0);
    assert.strictEqual(result.distribution.length, 4);
    assert.strictEqual(result.highRiskItems.length, 2);
  });

  it('should handle empty dataset cleanly', () => {
    const result = assessMCF([]);
    assert.strictEqual(result.totalEvaluated, 0);
    assert.strictEqual(result.averageDualUseScore, 0);
  });
});
