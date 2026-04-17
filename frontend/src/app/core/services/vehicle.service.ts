import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RapportVehicule, Vehicle, Stats } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly API = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  rechercher(immatriculation: string): Observable<RapportVehicule> {
    const encoded = encodeURIComponent(immatriculation.trim());
    return this.http.get<RapportVehicule>(`${this.API}/${encoded}`);
  }

  creer(vehicle: Partial<Vehicle>): Observable<{ success: boolean; vehicle: Vehicle }> {
    return this.http.post<{ success: boolean; vehicle: Vehicle }>(this.API, vehicle);
  }

  statistiques(): Observable<{ success: boolean } & Stats> {
    return this.http.get<{ success: boolean } & Stats>(`${this.API}/stats`);
  }
}
