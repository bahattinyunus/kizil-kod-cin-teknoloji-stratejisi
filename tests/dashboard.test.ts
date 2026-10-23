import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { generateDashboardHtml } from '../src/dashboard.ts';
import { analyze } from '../src/analysis.ts';

describe('Dashboard Generator Tests', () => {
  it('should generate valid standalone HTML with dashboard components', () => {
    const dataset = [
      { id: 'doc-1', title: 'Test Belgesi', tags: ['yarıiletken'], actor: 'SMIC', mcfLevel: 'critical' }
    ];
    const textSamples = [
      { id: 'doc-1', title: 'Test Belgesi', content: 'Seri üretim aşamasına geçilmiştir.' }
    ];

    const result = analyze(dataset, textSamples);
    const html = generateDashboardHtml(result);

    assert.ok(html.includes('<!DOCTYPE html>'));
    assert.ok(html.includes('KIZIL KOD'));
    assert.ok(html.includes('Boğulma Noktaları'));
    assert.ok(html.includes('Askeri-Sivil Entegrasyon'));
    assert.ok(html.includes('Test Belgesi'));
    assert.ok(html.includes('TRL'));
  });
});
