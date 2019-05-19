import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Extension } from '../models/extension';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  extensions(): Observable<Extension[]> {
    return this.http.get<Extension[]>('/assets/data/extensions.json');
  }
}
