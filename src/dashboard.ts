import { writeFileSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { AnalysisResult } from './analysis.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateDashboardHtml(result: AnalysisResult): string {
  const generatedTime = new Date(result.timestamp).toLocaleString('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kızıl Kod — Çin Teknoloji Stratejisi & TRL İstihbarat Paneli</title>
  <style>
    :root {
      --bg-primary: #0a0c10;
      --bg-secondary: #121620;
      --bg-card: #19202f;
      --accent-red: #e63946;
      --accent-crimson: #9e2a2b;
      --accent-gold: #f4a261;
      --accent-cyan: #2a9d8f;
      --text-main: #f1faee;
      --text-muted: #94a3b8;
      --border-color: #2a3449;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-primary);
      color: var(--text-main);
      font-family: var(--font-family);
      line-height: 1.6;
      padding-bottom: 50px;
    }
    header {
      background: linear-gradient(135deg, #1f0b10 0%, #0d131f 100%);
      border-bottom: 2px solid var(--accent-red);
      padding: 30px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .header-title h1 {
      font-size: 26px;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-title h1 span.badge {
      background: var(--accent-red);
      color: white;
      font-size: 13px;
      padding: 3px 10px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .header-title p {
      color: var(--text-muted);
      font-size: 14px;
      margin-top: 5px;
    }
    .header-meta {
      text-align: right;
      font-size: 13px;
      color: var(--text-muted);
    }
    .container {
      max-width: 1400px;
      margin: 30px auto;
      padding: 0 20px;
    }
    /* Stats Bar */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--accent-red);
    }
    .stat-card.gold::before { background: var(--accent-gold); }
    .stat-card.cyan::before { background: var(--accent-cyan); }
    .stat-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    .stat-val {
      font-size: 32px;
      font-weight: 700;
      color: #fff;
    }
    .stat-sub {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    /* Navigation Tabs */
    .tabs {
      display: flex;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 25px;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 12px 20px;
      font-size: 15px;
      cursor: pointer;
      font-weight: 600;
      border-bottom: 3px solid transparent;
      transition: all 0.2s ease;
    }
    .tab-btn:hover { color: #fff; }
    .tab-btn.active {
      color: #fff;
      border-bottom-color: var(--accent-red);
      background: rgba(230, 57, 70, 0.08);
      border-radius: 6px 6px 0 0;
    }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    /* Tables & Cards */
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 24px;
      margin-bottom: 25px;
    }
    .card h2 {
      font-size: 18px;
      color: #fff;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      margin-top: 10px;
    }
    th, td {
      padding: 12px 14px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }
    th {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    tr:hover { background: rgba(255, 255, 255, 0.02); }
    /* Progress Bars */
    .prog-track {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      height: 8px;
      width: 100%;
      overflow: hidden;
      margin-top: 6px;
    }
    .prog-fill {
      height: 100%;
      border-radius: 10px;
      background: var(--accent-red);
    }
    .prog-fill.green { background: #2a9d8f; }
    .prog-fill.gold { background: #f4a261; }
    /* Badges */
    .pill {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .pill-red { background: rgba(230, 57, 70, 0.2); color: #ff6b6b; border: 1px solid rgba(230, 57, 70, 0.4); }
    .pill-green { background: rgba(42, 157, 143, 0.2); color: #48cae4; border: 1px solid rgba(42, 157, 143, 0.4); }
    .pill-gold { background: rgba(244, 162, 97, 0.2); color: #f4a261; border: 1px solid rgba(244, 162, 97, 0.4); }
    /* Search box */
    .search-box {
      width: 100%;
      padding: 12px 16px;
      border-radius: 8px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: #fff;
      font-size: 14px;
      margin-bottom: 20px;
      outline: none;
    }
    .search-box:focus { border-color: var(--accent-red); }
    /* Synergies Grid */
    .synergy-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }
    .synergy-item {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
    }
    .synergy-item h3 {
      font-size: 16px;
      color: var(--accent-gold);
      margin-bottom: 8px;
    }
    .synergy-item p {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    .synergy-geo {
      background: rgba(230, 57, 70, 0.08);
      border-left: 3px solid var(--accent-red);
      padding: 8px 12px;
      font-size: 12px;
      color: #ffccd5;
      border-radius: 0 4px 4px 0;
    }
  </style>
</head>
<body>

  <header>
    <div class="header-title">
      <h1>
        <span>🟥</span> KIZIL KOD: Çin Teknoloji Stratejisi
        <span class="badge">TRL & MCF Platformu</span>
      </h1>
      <p>Ulusal Güç, Teknolojik Olgunluk (TRL), Boğulma Noktaları (卡脖子) ve Askeri-Sivil Entegrasyon İstihbarat Paneli</p>
    </div>
    <div class="header-meta">
      <div>Rapor Oluşturulma: <strong>${generatedTime}</strong></div>
      <div>Veri Seti Kapsamı: <strong>24 Stratejik Doküman, 10 Boğulma Noktası</strong></div>
    </div>
  </header>

  <div class="container">
    <!-- Quick Metrics -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Toplam İncelenen Belge</div>
        <div class="stat-val">${result.totalItems}</div>
        <div class="stat-sub">Stratejik teknoloji vakaları</div>
      </div>
      <div class="stat-card cyan">
        <div class="stat-label">Genel Bağımsızlık Skoru</div>
        <div class="stat-val">%${result.overallAutonomyScore}</div>
        <div class="stat-sub">Yerli teknolojik özerklik endeksi</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-label">Boğulma Noktası İkame Oranı</div>
        <div class="stat-val">%${result.chokepoints.averageSubstitutionRate}</div>
        <div class="stat-sub">10 kritik (卡脖子) alanda yerli pay</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Kritik Dual-Use (MCF) Oranı</div>
        <div class="stat-val">%${result.mcf.criticalSharePercent}</div>
        <div class="stat-sub">Askeri-Sivil entegrasyon payı</div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('tab-matrix')">📊 Sektör TRL Matrisi</button>
      <button class="tab-btn" onclick="switchTab('tab-chokepoints')">🛑 Boğulma Noktaları (卡脖子)</button>
      <button class="tab-btn" onclick="switchTab('tab-mcf')">⚔️ Askeri-Sivil Entegrasyon (MCF)</button>
      <button class="tab-btn" onclick="switchTab('tab-actors')">🏛️ Stratejik Aktörler</button>
      <button class="tab-btn" onclick="switchTab('tab-synergies')">⚡ Çapraz Sinerjiler</button>
      <button class="tab-btn" onclick="switchTab('tab-docs')">📄 Doküman Kütüphanesi</button>
    </div>

    <!-- TAB 1: SEKTÖR TRL MATRİSİ -->
    <div id="tab-matrix" class="tab-content active">
      <div class="card">
        <h2>Sektör Bazlı Teknolojik Olgunluk (TRL) ve Özerklik Endeksi</h2>
        <table>
          <thead>
            <tr>
              <th>Teknoloji Alanı</th>
              <th>Belge Sayısı</th>
              <th>Ortalama TRL</th>
              <th>Olgunluk Seviyesi</th>
              <th>Stratejik Özerklik</th>
              <th>Temsili Başlıklar</th>
            </tr>
          </thead>
          <tbody>
            ${result.tagReadiness.map((item) => {
              const pillClass = item.avgTRL >= 7.5 ? 'pill-green' : item.avgTRL >= 5.0 ? 'pill-gold' : 'pill-red';
              const progColor = item.strategicAutonomyIndex >= 70 ? 'green' : item.strategicAutonomyIndex >= 45 ? 'gold' : '';
              return `<tr>
                <td><strong>${item.tag.toUpperCase()}</strong></td>
                <td>${item.count}</td>
                <td><span class="pill ${pillClass}">TRL ${item.avgTRL} / 9</span></td>
                <td>${item.status}</td>
                <td style="width: 180px;">
                  <div style="display:flex; justify-content:space-between; font-size:12px;">
                    <span>Özerklik:</span>
                    <strong>%${item.strategicAutonomyIndex}</strong>
                  </div>
                  <div class="prog-track">
                    <div class="prog-fill ${progColor}" style="width: ${item.strategicAutonomyIndex}%;"></div>
                  </div>
                </td>
                <td style="color: var(--text-muted); font-size: 13px;">
                  ${item.sampleTitles.join(' • ')}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: BOĞULMA NOKTALARI -->
    <div id="tab-chokepoints" class="tab-content">
      <div class="card">
        <h2>Çin'in Stratejik Boğulma Noktaları (卡脖子 - Ka Bo Zi) ve Yerli İkame Durumu</h2>
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 15px;">
          Çin Sanayi ve Bilgi Teknolojileri Bakanlığı (MIIT) tarafından tespit edilen, Batı yaptırımlarına en açık ve yerli ikame çalışmalarının en yoğun olduğu 10 kritik teknoloji:
        </p>
        <table>
          <thead>
            <tr>
              <th>Teknoloji & Çince Terim</th>
              <th>Sektör</th>
              <th>Kritiklik</th>
              <th>Yerli İkame Payı</th>
              <th>Yabancı Tekel</th>
              <th>Çinli Rakipler</th>
              <th>Hedef Yıl</th>
            </tr>
          </thead>
          <tbody>
            ${result.chokepoints.items.map((cp) => {
              const pillClass = cp.severity === 'Kritik' ? 'pill-red' : cp.severity === 'Yüksek' ? 'pill-gold' : 'pill-green';
              const barColor = cp.domesticSubstitutionRate >= 50 ? 'green' : cp.domesticSubstitutionRate >= 30 ? 'gold' : '';
              return `<tr>
                <td>
                  <strong>${cp.technology}</strong><br>
                  <small style="color: var(--text-muted);">${cp.chineseTerm}</small>
                </td>
                <td>${cp.domain}</td>
                <td><span class="pill ${pillClass}">${cp.severity}</span></td>
                <td style="width: 150px;">
                  <div style="font-size:12px; font-weight:600;">%${cp.domesticSubstitutionRate}</div>
                  <div class="prog-track">
                    <div class="prog-fill ${barColor}" style="width: ${cp.domesticSubstitutionRate}%;"></div>
                  </div>
                </td>
                <td style="font-size: 13px;">${cp.foreignMonopolist}</td>
                <td style="font-size: 13px; color: var(--accent-gold);">${cp.chineseChallengers.join(', ')}</td>
                <td><strong>${cp.targetYear}</strong></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: MCF ANALİZİ -->
    <div id="tab-mcf" class="tab-content">
      <div class="card">
        <h2>Askeri-Sivil Entegrasyon (Military-Civil Fusion - 军民融合) Analizi</h2>
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;">
          Sivil ticari yatırımlar ile Halk Kurtuluş Ordusu (PLA) modernizasyonunun tek bir havuzda birleştirilmesi doktrini.
        </p>
        <div class="stats-grid">
          ${result.mcf.distribution.map((d) => `
            <div class="stat-card">
              <div class="stat-label">${d.level}</div>
              <div class="stat-val">${d.count} <span style="font-size: 16px; color: var(--text-muted);">(%${d.percent})</span></div>
            </div>
          `).join('')}
        </div>

        <h3 style="margin: 20px 0 10px; font-size: 16px; color: var(--accent-gold);">Yüksek Riskli / Doğrudan Askeri Entegre Projeler</h3>
        <table>
          <thead>
            <tr>
              <th>Belge / Teknoloji</th>
              <th>Aktör</th>
              <th>Entegrasyon Düzeyi</th>
              <th>Dual-Use Puanı</th>
              <th>Stratejik Değerlendirme</th>
            </tr>
          </thead>
          <tbody>
            ${result.mcf.highRiskItems.map((h) => `
              <tr>
                <td><strong>${h.title}</strong></td>
                <td>${h.actor}</td>
                <td><span class="pill ${h.mcfLevel === 'critical' ? 'pill-red' : 'pill-gold'}">${h.dualUseCategory}</span></td>
                <td><strong>${h.mcfScore} / 100</strong></td>
                <td style="font-size: 13px; color: var(--text-muted);">${h.riskAssessment}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 4: AKTÖRLER -->
    <div id="tab-actors" class="tab-content">
      <div class="card">
        <h2>Çin Teknoloji Ekosisteminin Kilit Aktörleri ve Şirketleri</h2>
        <table>
          <thead>
            <tr>
              <th>Kuruluş / Şirket</th>
              <th>Tip</th>
              <th>Odak Alanları</th>
              <th>Yaptırım Durumu</th>
              <th>Stratejik Rol</th>
            </tr>
          </thead>
          <tbody>
            ${result.mcf.actors.map((actor) => `
              <tr>
                <td>
                  <strong>${actor.name}</strong><br>
                  <small style="color: var(--text-muted);">${actor.chineseName}</small>
                </td>
                <td>${actor.type}</td>
                <td><small>${actor.focus.join(' • ')}</small></td>
                <td><span class="pill ${actor.sanctionStatus.includes('Entity List') ? 'pill-red' : 'pill-green'}">${actor.sanctionStatus}</span></td>
                <td style="font-size: 13px; color: var(--text-muted);">${actor.strategicRole}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 5: ÇAPRAZ SİNERJİLER -->
    <div id="tab-synergies" class="tab-content">
      <div class="card">
        <h2>Çapraz Teknoloji Sinerjileri ve Küresel Hegemonya Projeksiyonları</h2>
        <div class="synergy-grid">
          ${result.synergies.map((s) => `
            <div class="synergy-item">
              <h3>${s.title}</h3>
              <div style="margin-bottom: 8px;">
                ${s.tags.map((t) => `<span class="pill pill-gold">${t}</span> `).join('')}
              </div>
              <p><strong>Teknolojik Etki:</strong> ${s.impact}</p>
              <div class="synergy-geo">
                <strong>Jeopolitik Sonuç:</strong> ${s.geopoliticalSignificance}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- TAB 6: DOKÜMAN KÜTÜPHANESİ -->
    <div id="tab-docs" class="tab-content">
      <div class="card">
        <h2>İncelenen Stratejik Belgeler ve TRL Skorları</h2>
        <input type="text" id="docSearch" class="search-box" placeholder="Belge başlığı, TRL veya kanıt kelimesi ara..." onkeyup="filterDocs()">
        <table id="docsTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Başlık</th>
              <th>TRL Seviyesi</th>
              <th>Güven Skoru</th>
              <th>Tespit Edilen Kanıtlar</th>
            </tr>
          </thead>
          <tbody>
            ${result.trlBreakdown.map((doc) => `
              <tr>
                <td><code>${doc.id}</code></td>
                <td><strong>${doc.title || 'Başlıksız'}</strong></td>
                <td><span class="pill ${doc.trl >= 8 ? 'pill-green' : doc.trl >= 5 ? 'pill-gold' : 'pill-red'}">TRL-${doc.trl}</span></td>
                <td>%${doc.confidence}</td>
                <td style="font-size: 13px; color: var(--text-muted);">
                  ${doc.evidence.length > 0 ? doc.evidence.join(', ') : 'Varsayılan Seviye'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <script>
    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      
      const target = document.getElementById(tabId);
      if (target) target.classList.add('active');
      
      const btn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
      if (btn) btn.classList.add('active');
    }

    function filterDocs() {
      const input = document.getElementById('docSearch');
      const filter = input.value.toLowerCase();
      const rows = document.querySelectorAll('#docsTable tbody tr');
      
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
      });
    }
  </script>
</body>
</html>`;
}

export function exportDashboardHtml(result: AnalysisResult, outputPath?: string): string {
  const finalPath = outputPath || path.join(__dirname, '..', 'dashboard.html');
  const html = generateDashboardHtml(result);
  writeFileSync(finalPath, html, 'utf8');
  return finalPath;
}
