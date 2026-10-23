import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { loadChokepoints, analyzeChokepoints } from '../src/chokepoints.ts';

describe('Chokepoints (Ka Bo Zi) Analyzer Tests', () => {
  it('should load default chokepoints dataset', () => {
    const items = loadChokepoints();
    assert.ok(items.length >= 10, 'En az 10 boğulma noktası yüklenmelidir.');
    const first = items[0];
    assert.ok(first.technology);
    assert.ok(first.severity);
    assert.ok(typeof first.domesticSubstitutionRate === 'number');
  });

  it('should analyze chokepoints and calculate statistics', () => {
    const analysis = analyzeChokepoints();
    assert.ok(analysis.totalItems > 0);
    assert.ok(analysis.averageSubstitutionRate > 0 && analysis.averageSubstitutionRate <= 100);
    assert.ok(analysis.criticalCount > 0);
    assert.ok(analysis.urgentBottlenecks.length > 0);
    assert.ok(analysis.domainAverages.length > 0);
  });

  it('should handle custom input items', () => {
    const mockItems = [
      {
        id: 'cp-mock-1',
        technology: 'Mock Tech 1',
        domain: 'Test Domain',
        severity: 'Kritik' as const,
        chineseTerm: '测试',
        domesticSubstitutionRate: 10,
        targetYear: 2026,
        foreignMonopolist: 'Mock Corp',
        chineseChallengers: ['Local Corp'],
        description: 'Test desc'
      },
      {
        id: 'cp-mock-2',
        technology: 'Mock Tech 2',
        domain: 'Test Domain',
        severity: 'Yüksek' as const,
        chineseTerm: '测试2',
        domesticSubstitutionRate: 50,
        targetYear: 2027,
        foreignMonopolist: 'Mock Corp 2',
        chineseChallengers: ['Local Corp 2'],
        description: 'Test desc 2'
      }
    ];

    const result = analyzeChokepoints(mockItems);
    assert.strictEqual(result.totalItems, 2);
    assert.strictEqual(result.criticalCount, 1);
    assert.strictEqual(result.highCount, 1);
    assert.strictEqual(result.averageSubstitutionRate, 30);
    assert.strictEqual(result.urgentBottlenecks.length, 1);
  });
});
