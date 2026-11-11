import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuthErrorMessage } from './auth/auth-error';
import { Smoking } from './models/smoking';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-smoking-page',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  currentfumate: Smoking | null = null;
  loadingfumate = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam === null) {
      return;
    }

    const id = Number(idParam);
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.error = 'Identificativo della registrazione non valido.';
      return;
    }

    this.loadingfumate = true;
    this.supabaseService.getSmokingById(id).subscribe({
      next: (fumate) => {
        this.currentfumate = fumate;
        this.loadingfumate = false;
      },
      error: (error: unknown) => {
        this.error = getAuthErrorMessage(error);
        this.loadingfumate = false;
      }
    });
  }

  onfumateSaved(): void {
    this.currentfumate = null;
    if (this.route.snapshot.paramMap.has('id')) {
      void this.router.navigate(['/censimento']);
    }
  }

  onfumateCleared(): void {
    this.currentfumate = null;
  }
}

