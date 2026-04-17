import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {
  constructor(public authService: AuthService) {}

  faqs = [
    { q: 'Que contient le rapport ?', a: 'Le rapport inclut tous les accidents déclarés aux assurances partenaires : date, gravité, type de choc, compagnie, montant des dommages et statut de réparation.', open: false },
    { q: 'Les données sont-elles à jour ?', a: 'Oui, les données sont synchronisées en temps réel avec les bases des compagnies d\'assurance partenaires.', open: false },
    { q: 'Et si le véhicule n\'a pas d\'historique ?', a: 'Vous recevez quand même un rapport indiquant qu\'aucun sinistre n\'a été déclaré — ce qui est en soi une information précieuse.', open: false },
    { q: 'Le paiement est-il sécurisé ?', a: 'Oui, le paiement est traité via CMI (Centre Monétique Interbancaire), la solution de paiement en ligne certifiée au Maroc.', open: false },
  ];

  toggle(faq: any): void { faq.open = !faq.open; }
}
