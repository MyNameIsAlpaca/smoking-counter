import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, catchError, map, merge, of, startWith, switchMap, takeUntil } from 'rxjs';
import { getAuthErrorMessage } from '../auth/auth-error';
import { SupabaseService } from '../services/supabase.service';
import { Smoking } from '../models/smoking';
import { getDailySmokingStatus } from '../models/daily-smoking';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: []
})
export class fumateFormComponent implements OnChanges, OnInit, OnDestroy {
  @Input() fumate: Smoking | null = null;
  @Output() fumateSaved = new EventEmitter<void>();
  @Output() fumateCleared = new EventEmitter<void>();
  
  fumateForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  dailyTiri: number | null = null;
  dailyTiriError: string | null = null;
  dailyTiriLoading = false;
  readonly getDailySmokingStatus = getDailySmokingStatus;
  private readonly refreshDailyTiri = new Subject<void>();
  private readonly destroyed = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService
  ) {
    const dataOra = this.toLocalDateTimeInput(new Date().toISOString());
    this.fumateForm = this.fb.group({
      data: [dataOra.slice(0, 10), Validators.required],
      orario: [dataOra.slice(11, 16), Validators.required],
      tiri: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      luogo: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    const dateControl = this.fumateForm.controls['data'];
    merge(
      dateControl.valueChanges,
      this.refreshDailyTiri.pipe(map(() => dateControl.value))
    ).pipe(
      startWith(dateControl.value),
      switchMap((date: unknown) => {
        this.dailyTiri = null;
        this.dailyTiriError = null;
        if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || dateControl.invalid) {
          this.dailyTiriLoading = false;
          return of(null);
        }

        this.dailyTiriLoading = true;
        return this.supabaseService.getDailyTiri(date).pipe(
          catchError((error: unknown) => {
            this.dailyTiriError = 'Errore nel caricamento del totale giornaliero: ' + getAuthErrorMessage(error);
            console.error(error);
            return of(null);
          })
        );
      }),
      takeUntil(this.destroyed)
    ).subscribe(total => {
      this.dailyTiri = total;
      this.dailyTiriLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngOnChanges(): void {
    if (this.fumate) {
      const dataOra = this.toLocalDateTimeInput(this.fumate.data_inserimento);
      this.fumateForm.patchValue({
        data: dataOra.slice(0, 10),
        orario: dataOra.slice(11, 16),
        tiri: this.fumate.tiri,
        luogo: this.fumate.luogo
      });
    } else if (this.fumateForm) {
      const dataOra = this.toLocalDateTimeInput(new Date().toISOString());
      this.fumateForm.reset({
        data: dataOra.slice(0, 10),
        orario: dataOra.slice(11, 16),
        tiri: 0,
        luogo: ''
      });
    }
  }

  onSubmit(): void {
    if (this.fumateForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = null;

      const formValue = this.fumateForm.getRawValue();
      const fumate = {
        data_inserimento: new Date(`${formValue.data}T${formValue.orario}`).toISOString(),
        tiri: Number(formValue.tiri),
        luogo: formValue.luogo.trim()
      };

      if (this.fumate?.id) {
        this.supabaseService.updatefumate(this.fumate.id, fumate).subscribe({
          next: () => {
            this.loading = false;
            this.resetForm();
            this.success = 'fumate aggiornata correttamente!';
            this.fumateSaved.emit();
            this.refreshDailyTiri.next();
            setTimeout(() => {
              this.success = null;
            }, 3000);
          },
          error: (err) => {
            this.error = 'Errore durante l’aggiornamento della fumate: ' + err.message;
            this.loading = false;
            console.error(err);
          }
        });
      } else {
        this.supabaseService.createfumate(fumate).subscribe({
          next: () => {
            this.loading = false;
            this.resetForm();
            this.success = 'Fumata creata correttamente!';
            this.fumateSaved.emit();
            this.refreshDailyTiri.next();
            setTimeout(() => {
              this.success = null;
            }, 3000);
          },
          error: (err) => {
            this.error = 'Errore durante la creazione della fumate: ' + err.message;
            this.loading = false;
            console.error(err);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    const dataOra = this.toLocalDateTimeInput(new Date().toISOString());
    this.fumateForm.reset({
      data: dataOra.slice(0, 10),
      orario: dataOra.slice(11, 16),
      tiri: 0,
      luogo: ''
    });
    this.fumate = null;
    this.error = null;
    this.success = null;
    this.fumateCleared.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.fumateForm.controls).forEach(key => {
      const control = this.fumateForm.get(key);
      control?.markAsTouched();
    });
  }

  private toLocalDateTimeInput(value: string): string {
    const date = new Date(value);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
  }
}

