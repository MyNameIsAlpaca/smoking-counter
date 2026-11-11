import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuthErrorMessage } from '../auth/auth-error';
import { SupabaseService } from '../services/supabase.service';
import { Smoking } from '../models/smoking';
import { getDailySmokingStatus, getLocalDateKey } from '../models/daily-smoking';

interface DailySmokingGroup {
  dateKey: string;
  dateLabel: string;
  records: Smoking[];
  totalTiri: number;
}

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: []
})
export class fumateListComponent implements OnInit {
  readonly getDailySmokingStatus = getDailySmokingStatus;
  smoking: Smoking[] = [];
  dailyGroups: DailySmokingGroup[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadsmoking();
  }

  loadsmoking(): void {
    this.loading = true;
    this.error = null;
    this.supabaseService.getsmoking().subscribe({
      next: (smoking) => {
        this.smoking = smoking;
        this.groupByDay();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.error = 'Errore durante il caricamento: ' + getAuthErrorMessage(error);
        this.loading = false;
        console.error(error);
      }
    });
  }

  deletefumate(id: number): void {
    if (confirm('Vuoi davvero eliminare questa fumata?')) {
      this.loading = true;
      this.error = null;
      this.supabaseService.deletefumate(id).subscribe({
        next: () => {
          this.loadsmoking();
        },
        error: (error: unknown) => {
          this.error = 'Errore durante l’eliminazione: ' + getAuthErrorMessage(error);
          this.loading = false;
          console.error(error);
        }
      });
    }
  }

  editfumate(fumate: Smoking): void {
    void this.router.navigate(['/censimento', fumate.id]);
  }

  private groupByDay(): void {
    const recordsByDay = new Map<string, Smoking[]>();

    for (const record of this.smoking) {
      const dateKey = getLocalDateKey(record.data_inserimento);
      const records = recordsByDay.get(dateKey) ?? [];
      records.push(record);
      recordsByDay.set(dateKey, records);
    }

    this.dailyGroups = Array.from(recordsByDay.entries())
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([dateKey, records]) => {
        records.sort((recordA, recordB) =>
          Date.parse(recordB.data_inserimento) - Date.parse(recordA.data_inserimento)
        );
        const [year, month, day] = dateKey.split('-').map(Number);
        const date = new Date(year, month - 1, day, 12);

        return {
          dateKey,
          dateLabel: new Intl.DateTimeFormat('it-IT', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }).format(date),
          records,
          totalTiri: records.reduce((total, record) => total + record.tiri, 0)
        };
      });
  }
}

