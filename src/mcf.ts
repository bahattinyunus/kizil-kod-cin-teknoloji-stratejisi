import { readFileSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type MCFLevel = 'critical' | 'high' | 'medium' | 'low';

export interface TechActor {
  name: string;
  chineseName: string;
  type: string;
  focus: string[];
  sanctionStatus: string;
  strategicRole: string;
}

export interface MCFScoreItem {
  id: string;
  title: string;
  actor: string;
  mcfLevel: MCFLevel;
  mcfScore: number; // 0 - 100
  dualUseCategory: string;
  riskAssessment: string;
}

export interface MCFAnalysisResult {
  totalEvaluated: number;
  averageDualUseScore: number;
  criticalSharePercent: number;
  distribution: { level: string; count: number; percent: number }[];
  highRiskItems: MCFScoreItem[];
  actors: TechActor[];
}

export function loadActors(customPath?: string): TechActor[] {
  const filePath = customPath || path.join(__dirname, '..', 'data', 'actors.json');
  try {
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

const MCF_SCORE_TABLE: Record<MCFLevel, { score: number; label: string; desc: string }> = {
  critical: {
    score: 95,
    label: 'Doğrudan Askeri / Ulusal Güvenlik Entegrasyonu',
    desc: 'Harp kabiliyeti, stratejik nükleer/uzay gücü veya istihbarat altyapısıyla doğrudan bağlantılıdır.'
  },
  high: {
    score: 75,
    label: 'Çift Kullanımlı (Dual-Use) Kritik Teknoloji',
    desc: 'Ticari görünümün altında güçlü taktik/operasyonel askeri veya gözetim kullanım potansiyeli taşır.'
  },
  medium: {
    score: 50,
    label: 'Stratejik Endüstriyel / Bilişsel Altyapı',
    desc: 'Büyük veri, sanayi otomasyonu ve yapay zeka bilişsel üstünlüğü sağlayan teknoloji.'
  },
  low: {
    score: 25,
    label: 'Ağırlıklı Olarak Sivil / Tüketici Odaklı',
    desc: 'Doğrudan askeri tehdit oluşturmayan, küresel pazar payı ve ekonomik güç üreten sistemler.'
  }
};

export function assessMCF(dataset: any[]): MCFAnalysisResult {
  const actors = loadActors();
  const scoredItems: MCFScoreItem[] = [];
  const levelCounts: Record<MCFLevel, number> = { critical: 0, high: 0, medium: 0, low: 0 };

  for (const item of dataset) {
    const level: MCFLevel = item.mcfLevel || 'medium';
    levelCounts[level] = (levelCounts[level] || 0) + 1;
    const meta = MCF_SCORE_TABLE[level] || MCF_SCORE_TABLE.medium;

    scoredItems.push({
      id: item.id,
      title: item.title,
      actor: item.actor || 'Bilinmiyor',
      mcfLevel: level,
      mcfScore: meta.score,
      dualUseCategory: meta.label,
      riskAssessment: meta.desc
    });
  }

  const total = scoredItems.length;
  if (total === 0) {
    return {
      totalEvaluated: 0,
      averageDualUseScore: 0,
      criticalSharePercent: 0,
      distribution: [],
      highRiskItems: [],
      actors
    };
  }

  const totalScore = scoredItems.reduce((acc, curr) => acc + curr.mcfScore, 0);
  const averageDualUseScore = parseFloat((totalScore / total).toFixed(1));
  const criticalSharePercent = parseFloat(((levelCounts.critical / total) * 100).toFixed(1));

  const distribution = (['critical', 'high', 'medium', 'low'] as MCFLevel[]).map((lvl) => ({
    level: MCF_SCORE_TABLE[lvl].label,
    count: levelCounts[lvl],
    percent: parseFloat(((levelCounts[lvl] / total) * 100).toFixed(1))
  }));

  const highRiskItems = scoredItems
    .filter((s) => s.mcfLevel === 'critical' || s.mcfLevel === 'high')
    .sort((a, b) => b.mcfScore - a.mcfScore);

  return {
    totalEvaluated: total,
    averageDualUseScore,
    criticalSharePercent,
    distribution,
    highRiskItems,
    actors
  };
}
