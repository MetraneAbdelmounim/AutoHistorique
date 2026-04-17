import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { User } from '../../models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private router = inject(Router);
  public authService = inject(AuthService);
  public theme = inject(ThemeService);

  menuOpen = false;

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());
  }

  get user(): User | null { return this.authService.currentUser; }

  get initials(): string {
    if (!this.user) return '?';
    return `${this.user.prenom[0]}${this.user.nom[0]}`.toUpperCase();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    document.body.classList.toggle('no-scroll', this.menuOpen);
  }

  closeMenu(): void {
    if (!this.menuOpen) return;
    this.menuOpen = false;
    document.body.classList.remove('no-scroll');
  }

  toggleTheme(): void { this.theme.toggle(); }

  logout(): void { this.closeMenu(); this.authService.logout(); }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.closeMenu(); }
}
