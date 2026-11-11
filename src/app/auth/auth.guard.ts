import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable, catchError, from, map, of } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return from(this.supabaseService.getSession()).pipe(
      map(session => session ? true : this.router.createUrlTree(['/login'])),
      catchError(() => of(this.router.createUrlTree(['/login'], {
        queryParams: { reason: 'session-check-failed' }
      })))
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class SessionRedirectGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  canActivate(): Observable<UrlTree> {
    return from(this.supabaseService.getSession()).pipe(
      map(session => this.router.createUrlTree([session ? '/home' : '/login'])),
      catchError(() => of(this.router.createUrlTree(['/login'], {
        queryParams: { reason: 'session-check-failed' }
      })))
    );
  }
}
