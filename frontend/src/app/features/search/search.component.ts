import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ReplacePipe } from '../../shared/pipes/replace.pipe';
import { RapportVehicule } from '../../shared/models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, ReplacePipe],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  errorMsg = '';
  rapport: RapportVehicule | null = null;

  // Payment modal
  showPayModal = false;
  payStep: 'choice' | 'card' | 'processing' | 'success' = 'choice';
  payLoading = false;

  exemples = ['123456-A-78', '654321-B-22', '11111-WW'];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      immatriculation: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    document.body.classList.remove('no-scroll');
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.form.patchValue({ immatriculation: params['q'] });
        this.onSubmit();
      }
    });
  }

  fillExemple(ex: string): void {
    this.form.patchValue({ immatriculation: ex });
    this.rapport = null; this.errorMsg = '';
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.errorMsg = ''; this.rapport = null;
    this.vehicleService.rechercher(this.form.value.immatriculation.trim()).subscribe({
      next: res => { this.rapport = res; this.loading = false; },
      error: err => { this.errorMsg = err.error?.message || 'Erreur lors de la recherche'; this.loading = false; }
    });
  }

  // Check if current immat was already paid (session-based demo)
  get isPaid(): boolean {
    const paid = JSON.parse(sessionStorage.getItem('paid_reports') || '[]');
    return paid.includes(this.rapport?.immatriculation);
  }

  openPayModal(): void {
    this.showPayModal = true;
    this.payStep = 'choice';
    document.body.classList.add('no-scroll');
  }
  closePayModal(): void {
    this.showPayModal = false;
    this.payStep = 'choice';
    document.body.classList.remove('no-scroll');
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { if (this.showPayModal) this.closePayModal(); }

  selectCard(): void { this.payStep = 'card'; }

  simulatePay(): void {
    this.payStep = 'processing';
    setTimeout(() => {
      // Store paid immat in session
      const paid = JSON.parse(sessionStorage.getItem('paid_reports') || '[]');
      paid.push(this.rapport?.immatriculation);
      sessionStorage.setItem('paid_reports', JSON.stringify(paid));
      this.payStep = 'success';
    }, 2200);
  }

  voirRapportComplet(): void {
    this.showPayModal = false;
    document.body.classList.remove('no-scroll');
    if (this.rapport) this.router.navigate(['/report'], { state: { rapport: this.rapport } });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('no-scroll');
  }

  get scoreClass(): string { return this.rapport?.scoreConfiance?.score ? `score-${this.rapport.scoreConfiance.score}` : ''; }
  get scorePercent(): number { return this.rapport?.scoreConfiance?.value ?? 0; }
  graviteLabel(g: string): string { return ({ leger:'Léger', modere:'Modéré', grave:'Grave', total:'Perte totale' } as any)[g] ?? g; }
  graviteClass(g: string): string { return `gravite-${g}`; }
  formatDate(d: string): string { return new Date(d).toLocaleDateString('fr-MA', { day:'2-digit', month:'long', year:'numeric' }); }
}
