import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ReplacePipe } from '../../shared/pipes/replace.pipe';
import { RapportVehicule, Accident } from '../../shared/models';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, ReplacePipe],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @ViewChild('reportDoc', { static: false }) reportDoc?: ElementRef<HTMLElement>;

  rapport: RapportVehicule | null = null;
  downloading = false;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.rapport = nav?.extras?.state?.['rapport'] ?? null;
  }

  ngOnInit(): void { if (!this.rapport) this.router.navigate(['/search']); }

  async telechargerPdf(): Promise<void> {
    if (!this.reportDoc || this.downloading) return;
    this.downloading = true;
    const plate = (this.rapport?.immatriculation || 'rapport').replace(/\s+/g, '');
    const filename = `AutoHistorique_${plate}_${this.fileDate()}.pdf`;

    // Force light theme + add pdf-export class (strips color-mix/backdrop-filter in CSS)
    const html = document.documentElement;
    const prevTheme = html.getAttribute('data-theme');
    html.setAttribute('data-theme', 'light');
    this.reportDoc.nativeElement.classList.add('pdf-export');

    const options: any = {
      margin: [8, 8, 10, 8],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        // Strip unsupported modern CSS from the cloned document before capture
        onclone: (clonedDoc: Document) => {
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              backdrop-filter: none !important;
              -webkit-backdrop-filter: none !important;
            }
            .report-doc::before, .doc-header::before { display: none !important; }
          `;
          clonedDoc.head.appendChild(style);
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await html2pdf()
        .set(options)
        .from(this.reportDoc.nativeElement)
        .save();
    } catch (e: any) {
      console.error('Erreur génération PDF:', e);
      const msg = e?.message || String(e);
      alert(`Impossible de générer le PDF.\n\nDétail: ${msg}\n\nOuvrez la console (F12) pour plus d'infos.`);
    } finally {
      if (prevTheme === null) html.removeAttribute('data-theme');
      else html.setAttribute('data-theme', prevTheme);
      this.reportDoc?.nativeElement.classList.remove('pdf-export');
      this.downloading = false;
    }
  }

  graviteLabel(g: string): string { return ({ leger:'Léger', modere:'Modéré', grave:'Grave', total:'Perte totale' } as any)[g] ?? g; }
  responsabiliteLabel(r: string): string {
    return ({ responsable:'Responsable', non_responsable:'Non responsable', partage:'Responsabilité partagée', inconnu:'Inconnue' } as any)[r] ?? r;
  }
  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-MA', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  }
  get scoreColor(): string {
    return ({ excellent:'#16A34A', faible:'#65A30D', moyen:'#D97706', eleve:'#EA580C', risque:'#DC2626' } as any)[this.rapport?.scoreConfiance.score ?? ''] ?? '#64748B';
  }
  get accidentsParAnnee(): Record<string, Accident[]> {
    const map: Record<string, Accident[]> = {};
    this.rapport?.accidents.forEach(a => { const y = new Date(a.dateAccident).getFullYear().toString(); if (!map[y]) map[y] = []; map[y].push(a); });
    return map;
  }
  get anneesSorted(): string[] { return Object.keys(this.accidentsParAnnee).sort((a, b) => +b - +a); }
  get dateGeneration(): string {
    return new Date().toLocaleDateString('fr-MA', { day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }

  private fileDate(): string {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
  }
}
