import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { User } from '../../shared/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  form: FormGroup;

  marketingStats = [
    { value: '+12 000', label: 'Véhicules vérifiés' },
    { value: '4',       label: 'Assurances partenaires' },
    { value: '< 3s',    label: 'Résultat instantané' },
    { value: '100%',    label: 'Données officielles' },
  ];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      immatriculation: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.currentUser;
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  onSearch(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.router.navigate(['/search'], {
      queryParams: { q: this.form.value.immatriculation.trim() }
    });
  }
}
