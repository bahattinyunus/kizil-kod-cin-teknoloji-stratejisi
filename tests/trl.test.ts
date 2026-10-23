import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { assessTRL, TRL_DEFINITIONS } from '../src/trl.ts';

describe('TRL Engine Tests', () => {
  it('should correctly define 9 TRL levels', () => {
    for (let i = 1; i <= 9; i++) {
      assert.ok(TRL_DEFINITIONS[i], `TRL-${i} tanımı bulunmalıdır.`);
      assert.strictEqual(TRL_DEFINITIONS[i].level, i);
      assert.ok(TRL_DEFINITIONS[i].name.length > 0);
    }
  });

  it('should detect TRL 9 for commercial serial production keywords', () => {
    const docs = [
      {
        id: 'test-1',
        title: '7nm Çip',
        content: 'Ürün ticari pazara sürülmüş ve seri üretim aşamasına geçilmiştir.'
      }
    ];
    const results = assessTRL(docs);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].trl, 9);
    assert.ok(results[0].evidence.includes('seri üretim') || results[0].evidence.includes('ticari'));
    assert.ok(results[0].confidence >= 70);
  });

  it('should detect TRL 4 for laboratory simulation keywords', () => {
    const docs = [
      {
        id: 'test-4',
        title: 'Batarya Simülasyonu',
        content: 'Hücrelerin kimyasal kararlılığı için bilgisayar simülasyonu ve laboratuvar testi yapıldı.'
      }
    ];
    const results = assessTRL(docs);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].trl, 4);
    assert.ok(results[0].evidence.includes('laboratuvar testi'));
  });

  it('should fallback gracefully for empty content', () => {
    const docs = [{ id: 'empty-doc', title: '', content: '' }];
    const results = assessTRL(docs);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].trl, 3); // varsayılan
    assert.strictEqual(results[0].evidence.length, 0);
  });
});
