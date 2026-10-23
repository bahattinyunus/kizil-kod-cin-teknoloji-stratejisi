import { readFileSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ChokepointItem {
  id: string;
  technology: string;
  domain: string;
  severity: 'Kritik' | 'Yüksek' | 'Orta';
  chineseTerm: string;
  domesticSubstitutionRate: number; // Yüzde (%)
  targetYear: number;
  foreignMonopolist: string;
  chineseChallengers: string[];
  description: string;
}

export interface ChokepointAnalysis {
  totalItems: number;
  criticalCount: number;
  highCount: number;
  moderateCount: number;
  averageSubstitutionRate: number;
  domainAverages: { domain: string; avgRate: number; count: number }[];
  urgentBottlenecks: ChokepointItem[];
  items: ChokepointItem[];
}

export function loadChokepoints(customPath?: string): ChokepointItem[] {
  const filePath = customPath || path.join(__dirname, '..', 'data', 'chokepoints.json');
  try {
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function analyzeChokepoints(items?: ChokepointItem[]): ChokepointAnalysis {
  const data = items && items.length > 0 ? items : loadChokepoints();
  const totalItems = data.length;

  if (totalItems === 0) {
    return {
      totalItems: 0,
      criticalCount: 0,
      highCount: 0,
      moderateCount: 0,
      averageSubstitutionRate: 0,
      domainAverages: [],
      urgentBottlenecks: [],
      items: []
    };
  }

  let criticalCount = 0;
  let highCount = 0;
  let moderateCount = 0;
  let totalRate = 0;

  const domainMap: Record<string, { sum: number; count: number }> = {};

  for (const item of data) {
    totalRate += item.domesticSubstitutionRate;
    if (item.severity === 'Kritik') criticalCount++;
    else if (item.severity === 'Yüksek') highCount++;
    else moderateCount++;

    if (!domainMap[item.domain]) {
      domainMap[item.domain] = { sum: 0, count: 0 };
    }
    domainMap[item.domain].sum += item.domesticSubstitutionRate;
    domainMap[item.domain].count += 1;
  }

  const averageSubstitutionRate = parseFloat((totalRate / totalItems).toFixed(1));

  const domainAverages = Object.entries(domainMap)
    .map(([domain, stats]) => ({
      domain,
      avgRate: parseFloat((stats.sum / stats.count).toFixed(1)),
      count: stats.count
    }))
    .sort((a, b) => a.avgRate - b.avgRate);

  const urgentBottlenecks = [...data]
    .filter((item) => item.domesticSubstitutionRate < 35)
    .sort((a, b) => a.domesticSubstitutionRate - b.domesticSubstitutionRate);

  return {
    totalItems,
    criticalCount,
    highCount,
    moderateCount,
    averageSubstitutionRate,
    domainAverages,
    urgentBottlenecks,
    items: data
  };
}
