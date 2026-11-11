import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuthErrorMessage } from '../auth/auth-error';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = true;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private supabaseService: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const reason = this.route.snapshot.queryParamMap.get('reason');
    if (reason === 'session-check-failed') {
      this.errorMessage = 'Non è stato possibile verificare la sessione. Controlla la connessione e riprova.';
    } else if (reason === 'session-expired') {
      this.errorMessage = 'La sessione è scaduta. Accedi di nuovo.';
    }
    void this.redirectIfAuthenticated();
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    try {
      const { email, password } = this.loginForm.getRawValue();
      const { error } = await this.supabaseService.signIn(email, password);

      if (error) {
        this.errorMessage = getAuthErrorMessage(error);
        return;
      }

      await this.router.navigate(['/home']);
    } catch (error: unknown) {
      this.errorMessage = getAuthErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  private async redirectIfAuthenticated(): Promise<void> {
    try {
      const session = await this.supabaseService.getSession();
      if (session) {
        await this.router.navigate(['/home']);
      }
    } catch (error: unknown) {
      this.errorMessage = getAuthErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }
}
