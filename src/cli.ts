import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { analyze } from './analysis.ts';
import { assessTRL, TRL_DEFINITIONS } from './trl.ts';
import { analyzeChokepoints } from './chokepoints.ts';
import { assessMCF } from './mcf.ts';
import { exportDashboardHtml } from './dashboard.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJSON(filePath: string): any {
  try {
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e: any) {
    console.error('Örnek veri okunamadı:', e.message);
    return null;
  }
}

const sampleFile = path.join(__dirname, '..', 'data', 'sample.json');
const textSamplesFile = path.join(__dirname, '..', 'data', 'text_samples.json');

const dataset = loadJSON(sampleFile) || [];
const textSamples = loadJSON(textSamplesFile) || [];

const mode = (process.argv[2] || 'analysis').toLowerCase();

switch (mode) {
  case 'trl': {
    console.log('\n========================================================================');
    console.log('                 BELGE TABANLI TRL DEĞERLENDİRME SONUÇLARI');
    console.log('========================================================================');
    
    const trlResults = assessTRL(textSamples);
    for (const r of trlResults) {
      const def = TRL_DEFINITIONS[r.trl];
      console.log(`\n📄 Belge Kimliği: ${r.id}`);
      console.log(`   Başlık:       ${r.title ?? 'Başlıksız'}`);
      console.log(`   TRL Seviyesi: TRL-${r.trl} (${def ? def.name : 'N/A'}) [Güven: %${r.confidence}]`);
      console.log(`   Açıklama:     ${def ? def.shortDesc : ''}`);
      console.log(`   Kanıtlar:     ${r.evidence.length > 0 ? r.evidence.join(', ') : 'Varsayılan'}`);
      console.log('   ---------------------------------------------------------------------');
    }
    break;
  }

  case 'chokepoints':
  case 'chokepoint': {
    console.log('\n========================================================================');
    console.log('         ÇİN STRATEJİK BOĞULMA NOKTALARI (卡脖子 - KA BO ZI) ANALİZİ');
    console.log('========================================================================');
    const cp = analyzeChokepoints();
    console.log(`\n📌 Toplam İncelenen Kritik Teknoloji: ${cp.totalItems}`);
    console.log(`📊 Ortalama Yerli İkame Oranı:         %${cp.averageSubstitutionRate}`);
    console.log(`🚨 Kritik Seviye (<%35 İkame):         ${cp.criticalCount} adet teknoloji\n`);

    console.log(String('Kritik Teknoloji').padEnd(32) + ' | ' +
                String('Alan').padEnd(16) + ' | ' +
                String('İkame %').padEnd(8) + ' | ' +
                String('Yabancı Tekel'));
    console.log('---------------------------------------------------------------------------------------------');

    for (const item of cp.items) {
      console.log(
        item.technology.padEnd(32) + ' | ' +
        item.domain.padEnd(16) + ' | ' +
        (`%${item.domesticSubstitutionRate}`).padStart(8) + ' | ' +
        item.foreignMonopolist
      );
    }
    console.log('---------------------------------------------------------------------------------------------\n');
    break;
  }

  case 'mcf': {
    console.log('\n========================================================================');
    console.log('        ASKERİ-SİVİL ENTEGRASYON (MILITARY-CIVIL FUSION - 军民融合)');
    console.log('========================================================================');
    const mcf = assessMCF(dataset);
    console.log(`\n🔍 Değerlendirilen Sistem Sayısı:     ${mcf.totalEvaluated}`);
    console.log(`🎖️  Ortalama Dual-Use (MCF) Skoru:     ${mcf.averageDualUseScore}/100`);
    console.log(`⚠️  Doğrudan Askeri/Kritik Payı:       %${mcf.criticalSharePercent}\n`);

    console.log('Kategori Dağılımı:');
    for (const d of mcf.distribution) {
      console.log(`   • ${d.level.padEnd(42)}: ${d.count} sistem (%${d.percent})`);
    }

    console.log('\n🚨 Yüksek Riskli Kritik Çift Kullanımlı Sistemler:');
    for (const h of mcf.highRiskItems.slice(0, 6)) {
      console.log(`   • [${h.actor}] ${h.title} (Skor: ${h.mcfScore}) -> ${h.dualUseCategory}`);
    }
    console.log('');
    break;
  }

  case 'dashboard': {
    const result = analyze(dataset, textSamples);
    const out = exportDashboardHtml(result);
    console.log('\n========================================================================');
    console.log('           KIZIL KOD — İNTERAKTİF HTML PANELİ OLUŞTURULDU');
    console.log('========================================================================');
    console.log(`\n✅ Başarıyla oluşturuldu: ${out}`);
    console.log('   Tarayıcınızda açmak için bu dosyaya çift tıklayabilir veya sunabilirsiniz.\n');
    break;
  }

  case 'export': {
    const result = analyze(dataset, textSamples);
    const jsonPath = path.join(__dirname, '..', 'analysis_export.json');
    writeFileSync(jsonPath, JSON.stringify(result, null, 2), 'utf8');
    const htmlPath = exportDashboardHtml(result);
    console.log('\n========================================================================');
    console.log('             RAPOR VE VERİ ÇIKTILARI BAŞARIYLA KAYDEDİLDİ');
    console.log('========================================================================');
    console.log(`📄 JSON Verisi:   ${jsonPath}`);
    console.log(`📊 HTML Dashboard: ${htmlPath}\n`);
    break;
  }

  case 'help': {
    console.log('\nKızıl Kod CLI Komutları:');
    console.log('  npm run cli             - Genel stratejik TRL ve özerklik analizi');
    console.log('  npm run cli:trl         - Belge bazlı TRL seviyeleri ve kanıtlar');
    console.log('  npm run cli:chokepoints - Boğulma noktaları (卡脖子) ve ikame oranları');
    console.log('  npm run cli:mcf         - Askeri-Sivil Entegrasyon (Dual-Use) matrisi');
    console.log('  npm run cli:dashboard   - İnteraktif web dashboard (dashboard.html) üretir');
    console.log('  npm run cli:report      - Raporu ve JSON çıktısını dışa aktarır\n');
    break;
  }

  case 'analysis':
  default: {
    console.log('\n========================================================================');
    console.log('          KIZIL KOD — ÇİN TEKNOLOJİ STRATEJİSİ RAPORLAMA ARACI');
    console.log('========================================================================');

    const result = analyze(dataset, textSamples);
    console.log(`\n📢 Özet: ${result.summary}\n`);

    console.log('-------------------------------------------------------------------------------------------------');
    console.log('                        TEKNOLOJİK OLGUNLUK (TRL) & STRATEJİK ÖZERKLİK MATRİSİ');
    console.log('-------------------------------------------------------------------------------------------------');
    console.log(
      String('Teknoloji Alanı').padEnd(18) + ' | ' + 
      String('Belge').padEnd(6) + ' | ' + 
      String('Ort. TRL').padEnd(9) + ' | ' + 
      String('Özerklik %').padEnd(11) + ' | ' +
      String('Olgunluk Durumu')
    );
    console.log('-------------------------------------------------------------------------------------------------');
    
    for (const item of result.tagReadiness) {
      console.log(
        item.tag.padEnd(18) + ' | ' + 
        String(item.count).padStart(6) + ' | ' + 
        String(item.avgTRL).padStart(9) + ' | ' + 
        (`%${item.strategicAutonomyIndex}`).padStart(11) + ' | ' +
        item.status
      );
    }
    console.log('-------------------------------------------------------------------------------------------------\n');

    console.log('💡 Stratejik İstihbarat Özetleri:');
    for (const h of result.highlights) {
      console.log(`   • ${h}`);
    }

    console.log('\n⚡ Önemli Çapraz Sinerjiler:');
    for (const s of result.synergies.slice(0, 3)) {
      console.log(`   • [${s.title}]`);
      console.log(`     -> ${s.impact}`);
    }

    console.log('\n📌 Detaylı TRL analizi için:    npm run cli:trl');
    console.log('📌 Boğulma noktaları için:     npm run cli:chokepoints');
    console.log('📌 Askeri-Sivil Entegrasyon:   npm run cli:mcf');
    console.log('📌 İnteraktif Web Paneli:      npm run cli:dashboard\n');
    break;
  }
}
