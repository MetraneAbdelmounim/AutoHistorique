import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'auto';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly KEY = 'ah_theme';
  readonly mode = signal<ThemeMode>(this.load());
  readonly resolved = signal<'light' | 'dark'>(this.resolve(this.mode()));

  constructor() {
    this.apply(this.mode());
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.mode() === 'auto') this.apply('auto');
    });
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
    localStorage.setItem(this.KEY, mode);
    this.apply(mode);
  }

  toggle(): void {
    const next = this.resolved() === 'dark' ? 'light' : 'dark';
    this.set(next);
  }

  private apply(mode: ThemeMode): void {
    const resolved = this.resolve(mode);
    const html = document.documentElement;
    if (mode === 'auto') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', mode);
    }
    this.resolved.set(resolved);

    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute('content', resolved === 'dark' ? '#0A0E1A' : '#EC6F3B');
  }

  private resolve(mode: ThemeMode): 'light' | 'dark' {
    if (mode === 'light' || mode === 'dark') return mode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private load(): ThemeMode {
    const v = localStorage.getItem(this.KEY) as ThemeMode | null;
    return v === 'light' || v === 'dark' || v === 'auto' ? v : 'auto';
  }
}
