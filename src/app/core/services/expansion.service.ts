import { Injectable } from '@angular/core';
import { Expansion } from '../models/expansion';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExpansionService {

  private expansionsSubject: BehaviorSubject<Expansion[]> = new BehaviorSubject<Expansion[]>([]);

  readonly expansions$: Observable<Expansion[]> = this.expansionsSubject.pipe(
    first((expansions: Expansion[]) => expansions.length !== 0),
  );

  constructor(private dataService: DataService) {
    this.dataService.expansions().subscribe((expansions: Expansion[]) =>
      this.expansionsSubject.next(expansions)
    );
  }
}
