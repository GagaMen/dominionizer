import { ShuffleService } from './../services/shuffle.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationGuard implements CanActivate {

  constructor(private router: Router, private shuffleService: ShuffleService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.shuffleService.configuration) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
