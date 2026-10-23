export interface TRLDefinition {
  level: number;
  name: string;
  shortDesc: string;
  milestone: string;
}

export const TRL_DEFINITIONS: Record<number, TRLDefinition> = {
  1: {
    level: 1,
    name: 'Temel İlkelerin Gözlemlenmesi',
    shortDesc: 'Kuramsal ve bilimsel temellerin incelenmesi',
    milestone: 'Akademik tez, kuramsal fizik/matematik hipotezleri'
  },
  2: {
    level: 2,
    name: 'Teknoloji Konsepti ve Uygulama Formülasyonu',
    shortDesc: 'Pratik uygulamaların tasarlanması ve analizi',
    milestone: 'Fikir tasarımı, patent ön başvurusu, ilk fizibilite'
  },
  3: {
    level: 3,
    name: 'Kavram Kanıtlama (Proof-of-Concept)',
    shortDesc: 'Analitik ve deneysel kritik fonksiyon doğrulaması',
    milestone: 'Laboratuvar ortamında ilk başarılı veri veya prototip simülasyonu'
  },
  4: {
    level: 4,
    name: 'Laboratuvar Ortamında Bileşen Doğrulaması',
    shortDesc: 'Ayrı bileşenlerin laboratuvarda test edilmesi',
    milestone: 'Breadboard devre testi, ilk kimyasal/fiziksel bileşen doğrulaması'
  },
  5: {
    level: 5,
    name: 'İlgili Ortamda Bileşen/Sistem Entegrasyonu',
    shortDesc: 'Temel bileşenlerin gerçekçi destekleyici unsurlarla entegrasyonu',
    milestone: 'Masaüstü entegre prototip testi, donanım-yazılım birleşimi'
  },
  6: {
    level: 6,
    name: 'İlgili Ortamda Prototip Gösterimi',
    shortDesc: 'Temsili model veya prototipin sahaya yakın ortamda çalıştırılması',
    milestone: 'Rüzgar tüneli testi, kontrollü açık alan uçuşu, fabrika simülasyonu'
  },
  7: {
    level: 7,
    name: 'Operasyonel Ortamda Sistem Prototip Gösterimi',
    shortDesc: 'Operasyonel ortamda gerçek ölçekli sistem denemeleri',
    milestone: 'Saha denemesi, uçan test yatağı, gerçek pilot üretim hattı'
  },
  8: {
    level: 8,
    name: 'Gerçek Sistemin Tamamlanması ve Kalifikasyonu',
    shortDesc: 'Tüm testlerin tamamlandığı, sertifikalandırılmış operasyonel sistem',
    milestone: 'Uçuş sertifikasyonu, askeri kalifikasyon kabulü, fabrika kabul testi'
  },
  9: {
    level: 9,
    name: 'Gerçek Sistemin Başarılı Görev/Ticari Operasyon Kanıtı',
    shortDesc: 'Sistemin gerçek koşullarda yaygın kullanımı ve seri üretimi',
    milestone: 'Ticari seri üretim, küresel pazara dağıtım, sahada aktif filo görevi'
  }
};

export interface TRLResult {
  id: string | number;
  title?: string;
  trl: number;
  evidence: string[];
  confidence: number; // 0 - 100 arası yüzde
  summary: string;
}

interface KeywordEntry {
  kw: string;
  level: number;
  weight: number;
}

const KEYWORDS: KeywordEntry[] = [
  // TRL 9 - Seri Üretim / Ticari / Operasyonel
  { kw: 'seri üretim', level: 9, weight: 1.0 },
  { kw: 'commercial', level: 9, weight: 1.0 },
  { kw: 'ticari', level: 9, weight: 1.0 },
  { kw: 'deployed', level: 9, weight: 1.0 },
  { kw: 'operational', level: 9, weight: 1.0 },
  { kw: 'operasyonel kullanım', level: 9, weight: 1.0 },
  { kw: 'production', level: 9, weight: 0.9 },
  { kw: 'yaygınlaştırma', level: 9, weight: 0.9 },
  { kw: 'kullanımda', level: 9, weight: 0.8 },
  { kw: 'sahada aktif', level: 9, weight: 0.9 },
  { kw: 'sahada kanıtlanmış', level: 9, weight: 1.0 },
  { kw: '量产', level: 9, weight: 1.0 }, // Seri üretim (Çince)
  { kw: '商业化', level: 9, weight: 1.0 }, // Ticarileşme (Çince)

  // TRL 8 - Kalifikasyon ve Test Tamamlama
  { kw: 'kalifiye', level: 8, weight: 1.0 },
  { kw: 'qualified', level: 8, weight: 1.0 },
  { kw: 'kalifikasyon', level: 8, weight: 1.0 },
  { kw: 'proven system', level: 8, weight: 0.9 },
  { kw: 'sistem doğrulama', level: 8, weight: 0.8 },
  { kw: 'tamamlanmış sistem', level: 8, weight: 0.8 },
  { kw: 'kabul testi', level: 8, weight: 0.9 },

  // TRL 7 - Pilot Üretim / Saha Denemesi
  { kw: 'pilot üretim', level: 7, weight: 1.0 },
  { kw: 'saha denemesi', level: 7, weight: 1.0 },
  { kw: 'field trial', level: 7, weight: 1.0 },
  { kw: 'pilot fazı', level: 7, weight: 0.9 },
  { kw: 'pilot sürüş', level: 7, weight: 0.9 },
  { kw: 'operasyonel ortam test', level: 7, weight: 1.0 },
  { kw: 'uçan test yatağı', level: 7, weight: 1.0 },
  { kw: 'pilot', level: 7, weight: 0.7 },

  // TRL 6 - Gösterim / Prototip Doğrulama (Relevant Env)
  { kw: 'prototip gösterimi', level: 6, weight: 1.0 },
  { kw: 'demonstration', level: 6, weight: 0.9 },
  { kw: 'demonstrate', level: 6, weight: 0.8 },
  { kw: 'gösterim', level: 6, weight: 0.8 },
  { kw: 'sistemi doğrulamıştır', level: 6, weight: 0.9 },

  // TRL 5 - Entegre Prototip / Donanım-Yazılım Birleşimi
  { kw: 'entegre prototip', level: 5, weight: 1.0 },
  { kw: 'laboratuvar ölçekli entegre', level: 5, weight: 1.0 },
  { kw: 'laboratuvar ölçekli', level: 5, weight: 0.8 },
  { kw: 'prototype', level: 5, weight: 0.8 },
  { kw: 'prototip', level: 5, weight: 0.7 },

  // TRL 4 - Deney / Simülasyon / Laboratuvar Testi
  { kw: 'laboratuvar testi', level: 4, weight: 1.0 },
  { kw: 'laboratuvar deneyi', level: 4, weight: 1.0 },
  { kw: 'simülasyon ve test', level: 4, weight: 1.0 },
  { kw: 'simülasyon', level: 4, weight: 0.8 },
  { kw: 'simulation', level: 4, weight: 0.8 },
  { kw: 'experiment', level: 4, weight: 0.8 },
  { kw: 'validation', level: 4, weight: 0.7 },

  // TRL 3 - Kavram Kanıtlama (Proof-of-Concept)
  { kw: 'proof-of-concept', level: 3, weight: 1.0 },
  { kw: 'proof of concept', level: 3, weight: 1.0 },
  { kw: 'kavram kanıtlama', level: 3, weight: 1.0 },
  { kw: 'kavram kanıtı', level: 3, weight: 1.0 },
  { kw: 'analitik çalışma', level: 3, weight: 0.8 },

  // TRL 2 - Araştırma / Makale / Tasarım Formülasyonu
  { kw: 'araştırma makalesi', level: 2, weight: 1.0 },
  { kw: 'formülasyon', level: 2, weight: 0.9 },
  { kw: 'tasarım aşaması', level: 2, weight: 0.9 },
  { kw: 'paper', level: 2, weight: 0.8 },
  { kw: 'study', level: 2, weight: 0.8 },
  { kw: 'research', level: 2, weight: 0.8 },
  { kw: 'araştırma', level: 2, weight: 0.7 },

  // TRL 1 - Kuramsal / Temel İlkeler
  { kw: 'temel ilkeler', level: 1, weight: 1.0 },
  { kw: 'kuramsal', level: 1, weight: 1.0 },
  { kw: 'temel teorileri', level: 1, weight: 1.0 },
  { kw: 'teori', level: 1, weight: 0.8 },
  { kw: 'concept', level: 1, weight: 0.7 },
  { kw: 'kavram', level: 1, weight: 0.6 }
];

function detectKeywords(text: string): { evidence: string[]; level: number; confidence: number } {
  const normalized = text.toLowerCase();
  const matchedEvidence: string[] = [];
  const levelScores: Record<number, number> = {};

  for (const item of KEYWORDS) {
    if (normalized.includes(item.kw.toLowerCase())) {
      matchedEvidence.push(item.kw);
      levelScores[item.level] = (levelScores[item.level] || 0) + item.weight;
    }
  }

  if (matchedEvidence.length === 0) {
    return { evidence: [], level: 3, confidence: 40 };
  }

  // En yüksek ağırlığa sahip ve en olgun TRL seviyesini belirle
  let bestLevel = 3;
  let maxScore = -1;

  for (const [lvlStr, score] of Object.entries(levelScores)) {
    const lvl = parseInt(lvlStr, 10);
    // Yüksek TRL seviyelerine hafif bir öncelik ver (operasyonel göstergeleri yakalamak için)
    const weightedScore = score + (lvl * 0.1);
    if (weightedScore > maxScore) {
      maxScore = weightedScore;
      bestLevel = lvl;
    }
  }

  const confidence = Math.min(98, Math.round(50 + (matchedEvidence.length * 12)));
  return { evidence: Array.from(new Set(matchedEvidence)), level: bestLevel, confidence };
}

export function assessTRL(docs: Array<{ id?: string | number; title?: string; content?: string }>): TRLResult[] {
  const results: TRLResult[] = [];
  for (const d of docs) {
    const fullText = [d.title || '', d.content || ''].join('\n');
    const { evidence, level, confidence } = detectKeywords(fullText);
    const def = TRL_DEFINITIONS[level];
    const summary = `TRL-${level}: ${def ? def.name : 'Belirlenmedi'}`;
    results.push({
      id: d.id ?? 'unknown',
      title: d.title,
      trl: level,
      evidence,
      confidence,
      summary
    });
  }
  return results;
}
