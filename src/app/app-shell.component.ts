import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { Subscription } from 'rxjs';
import { getAuthErrorMessage } from './auth/auth-error';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app-shell.component.html'
})
export class AppShellComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  logoutError: string | null = null;
  loggingOut = false;
  private wasAuthenticated = false;
  private authSubscription: Subscription | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.supabaseService.onAuthStateChange().subscribe(({ session }) => {
      this.currentUser = session?.user ?? null;

      if (session) {
        this.wasAuthenticated = true;
      } else if (this.wasAuthenticated && !this.loggingOut) {
        this.wasAuthenticated = false;
        void this.router.navigate(['/login'], {
          queryParams: { reason: 'session-expired' }
        });
      } else if (!session) {
        this.wasAuthenticated = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  async signOut(): Promise<void> {
    this.logoutError = null;
    this.loggingOut = true;

    try {
      await this.supabaseService.signOut();
      this.wasAuthenticated = false;
      await this.router.navigate(['/login']);
    } catch (error: unknown) {
      this.logoutError = getAuthErrorMessage(error);
    } finally {
      this.loggingOut = false;
    }
  }
}
