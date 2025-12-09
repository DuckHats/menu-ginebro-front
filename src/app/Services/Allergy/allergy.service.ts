import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';
import { Allergy } from '../../interfaces/allergy';

@Injectable({
  providedIn: 'root'
})
export class AllergyService extends BaseService {

  get endpoint(): string {
    return 'allergies';
  }

  getAllergies(): Observable<Allergy[]> {
    return this.http.get<Allergy[]>(`${this.baseUrl}/${this.endpoint}`);
  }
}
