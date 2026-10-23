import { assessTRL, type TRLResult } from './trl.ts';
import { analyzeChokepoints, type ChokepointAnalysis } from './chokepoints.ts';
import { assessMCF, type MCFAnalysisResult } from './mcf.ts';

export interface TagReadiness {
  tag: string;
  count: number;
  avgTRL: number;
  status: string;
  strategicAutonomyIndex: number; // 0 - 100 arası bağımsızlık puanı
  sampleTitles: string[];
}

export interface TechnologySynergy {
  title: string;
  tags: string[];
  impact: string;
  geopoliticalSignificance: string;
}

export interface AnalysisResult {
  summary: string;
  totalItems: number;
  highlights: string[];
  tagReadiness: TagReadiness[];
  trlBreakdown: TRLResult[];
  chokepoints: ChokepointAnalysis;
  mcf: MCFAnalysisResult;
  synergies: TechnologySynergy[];
  overallAutonomyScore: number;
  timestamp: string;
}

export function analyze(dataset: any[], textSamples: any[]): AnalysisResult {
  const totalItems = dataset.length;
  const highlights: string[] = [];

  const trlResults = assessTRL(textSamples);
  const chokepoints = analyzeChokepoints();
  const mcf = assessMCF(dataset);

  if (totalItems === 0) {
    return {
      summary: 'Veri kümesi boş.',
      totalItems: 0,
      highlights: [],
      tagReadiness: [],
      trlBreakdown: [],
      chokepoints,
      mcf,
      synergies: [],
      overallAutonomyScore: 0,
      timestamp: new Date().toISOString()
    };
  }

  // Belge ID'lerine göre TRL haritası
  const trlMap = new Map<string | number, TRLResult>();
  for (const r of trlResults) {
    trlMap.set(r.id, r);
  }

  // Etiket bazlı TRL ve başlık gruplaması
  const tagCounts: Record<string, number> = {};
  const tagTrlSums: Record<string, number> = {};
  const tagDocTitles: Record<string, string[]> = {};

  for (const item of dataset) {
    const docId = item.id;
    const tags: string[] = Array.isArray(item.tags) ? item.tags : [];
    const trlInfo = trlMap.get(docId);
    const trlValue = trlInfo ? trlInfo.trl : 3;

    for (const tag of tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      tagTrlSums[tag] = (tagTrlSums[tag] || 0) + trlValue;
      if (!tagDocTitles[tag]) tagDocTitles[tag] = [];
      if (item.title && tagDocTitles[tag].length < 3) {
        tagDocTitles[tag].push(item.title);
      }
    }
  }

  // Etiket olgunluk ve bağımsızlık hesaplamaları
  const tagReadiness: TagReadiness[] = [];
  let weightedAutonomySum = 0;
  let totalDocWeight = 0;

  for (const [tag, count] of Object.entries(tagCounts)) {
    const avgTRL = parseFloat((tagTrlSums[tag] / count).toFixed(1));
    let status = 'Araştırma ve Kavramsal (TRL 1-4)';
    if (avgTRL >= 7.5) {
      status = 'Ticari ve Operasyonel (TRL 8-9)';
    } else if (avgTRL >= 5.0) {
      status = 'Prototip ve Gösterim (TRL 5-7)';
    }

    // Stratejik özerklik endeksi: TRL seviyesi, chokepoint faktörüyle normalize edilir
    // Örn. Yarıiletken için chokepoint yüksek olduğundan ceza katsayısı uygulanır
    let penalty = 1.0;
    if (tag === 'yarıiletken') penalty = 0.65;
    else if (tag === 'havacılık') penalty = 0.70;
    else if (tag === 'batarya') penalty = 1.25;

    let strategicAutonomyIndex = Math.min(99, Math.round((avgTRL / 9) * 100 * penalty));
    strategicAutonomyIndex = Math.max(15, strategicAutonomyIndex);

    weightedAutonomySum += strategicAutonomyIndex * count;
    totalDocWeight += count;

    tagReadiness.push({
      tag,
      count,
      avgTRL,
      status,
      strategicAutonomyIndex,
      sampleTitles: tagDocTitles[tag] || []
    });
  }

  // En yüksek ortalama TRL ve doküman sayısına göre sırala
  tagReadiness.sort((a, b) => b.avgTRL - a.avgTRL || b.count - a.count);

  const overallAutonomyScore = totalDocWeight > 0 
    ? Math.round(weightedAutonomySum / totalDocWeight) 
    : 50;

  // Öne çıkan bulgular (Highlights)
  highlights.push(`Toplam İncelenen Stratejik Doküman: ${totalItems}`);
  highlights.push(`Ortalama Stratejik Bağımsızlık Endeksi: %${overallAutonomyScore}/100`);
  highlights.push(`Kritik Düzeyde Çift Kullanımlı (MCF) Teknoloji Oranı: %${mcf.criticalSharePercent}`);
  highlights.push(`Kritik Boğulma Noktası (Ka Bo Zi) Teknolojileri: ${chokepoints.criticalCount} adet, Ort. İkame Oranı: %${chokepoints.averageSubstitutionRate}`);

  // Çapraz Teknolojik Sinerjiler
  const synergies: TechnologySynergy[] = [
    {
      title: 'Kuantum Güvenlikli Uydu ve Fiber İletişim Ağı',
      tags: ['kuantum', 'uzay', 'telekom'],
      impact: 'Hacklenemez stratejik askeri komuta-kontrol ve diplomatik haberleşme.',
      geopoliticalSignificance: 'Batı sinyal istihbaratını (SIGINT) Çin sınırlarında tamamen körleştirme kabiliyeti.'
    },
    {
      title: 'Bilişsel Otonomi ve Sürü Robotik Entegrasyonu',
      tags: ['yapay-zeka', 'uzay', 'robotik'],
      impact: 'GPS bağımsız insansız hava, kara ve deniz otonom taarruz sürüleri.',
      geopoliticalSignificance: 'Tayvan Boğazı ve Güney Çin Denizi senaryolarında asimetrik satürasyon üstünlüğü.'
    },
    {
      title: 'Yarı İletken Ambargolarına Karşı Fotonik ve MoE Mimarisi',
      tags: ['yarıiletken', 'yapay-zeka'],
      impact: 'Donanım kısıtlarını algoritma verimliliği (DeepSeek) ve ışık tabanlı çiplerle aşma.',
      geopoliticalSignificance: 'ABD ihracat kontrollerinin (GPU ve EUV kısıtlamaları) etki sahasını hızla daraltma.'
    },
    {
      title: 'Batarya ve Nadir Maden İhracat Kontrolü (Asimetrik Tedarik Kılıcı)',
      tags: ['batarya', 'yarıiletken', 'politika'],
      impact: 'Küresel EV tedarik zinciri tekelini galyum, germanyum ve grafit kotalarıyla silah haline getirme.',
      geopoliticalSignificance: 'Batı otomotiv ve savunma sanayisini kritik ham madde arz krizleriyle yüzleştirme.'
    }
  ];

  const summary = `Toplam analiz edilen stratejik belge: ${totalItems}. Çin teknoloji ekosisteminin genel stratejik bağımsızlık skoru %${overallAutonomyScore}/100 olarak ölçülmüştür.`;

  return {
    summary,
    totalItems,
    highlights,
    tagReadiness,
    trlBreakdown: trlResults,
    chokepoints,
    mcf,
    synergies,
    overallAutonomyScore,
    timestamp: new Date().toISOString()
  };
}
