import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Accident } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AccidentService {
  private readonly API = `${environment.apiUrl}/accidents`;

  constructor(private http: HttpClient) {}

  lister(immatriculation?: string): Observable<{ success: boolean; accidents: Accident[] }> {
    const params = immatriculation ? `?immatriculation=${encodeURIComponent(immatriculation)}` : '';
    return this.http.get<{ success: boolean; accidents: Accident[] }>(`${this.API}${params}`);
  }

  creer(accident: Partial<Accident>): Observable<{ success: boolean; accident: Accident }> {
    return this.http.post<{ success: boolean; accident: Accident }>(this.API, accident);
  }
}
