export { assessTRL, TRL_DEFINITIONS, type TRLResult, type TRLDefinition } from './trl.ts';
export { analyze, type AnalysisResult, type TagReadiness, type TechnologySynergy } from './analysis.ts';
export { analyzeChokepoints, loadChokepoints, type ChokepointItem, type ChokepointAnalysis } from './chokepoints.ts';
export { assessMCF, loadActors, type MCFLevel, type TechActor, type MCFScoreItem, type MCFAnalysisResult } from './mcf.ts';
export { generateDashboardHtml, exportDashboardHtml } from './dashboard.ts';

export function run(): void {
  console.log('Kızıl Kod: Çin Teknoloji Stratejisi ve TRL İstihbarat Platformu Başlatıldı.');
}

if (process.argv[1] && process.argv[1].endsWith('index.ts')) {
  run();
}
