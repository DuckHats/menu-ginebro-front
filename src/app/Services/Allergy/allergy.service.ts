import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';
import { Allergy } from '../../interfaces/allergy';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AllergyService extends BaseService {

  get endpoint(): string {
    return 'allergies';
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllergies(): Observable<Allergy[]> {
    return this.http.get<Allergy[]>(`${this.baseUrl}/${this.endpoint}`, { headers: this.getHeaders() });
  }

  updateUserAllergies(allergies: number[], customAllergies: string): Observable<any> {
    const payload = {
        allergies: allergies,
        custom_allergies: customAllergies
    };
    return this.http.post<any>(`${this.baseUrl}/${this.endpoint}`, payload, { headers: this.getHeaders() });
  }
}
