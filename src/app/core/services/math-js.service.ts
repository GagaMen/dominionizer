import { Injectable } from '@angular/core';
import * as math from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class MathJsService {
  pickRandom(array: number[], number?: number, weights?: number[]): number | number[] {
    return math.pickRandom(array, number, weights);
  }
}
