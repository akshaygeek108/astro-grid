import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AstroRecord {
  house: number;
  planet: string;
  year: number;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) { }

  getData(): Observable<AstroRecord[]> {
    return this.http.get<AstroRecord[]>('assets/data.json');
  }
}
