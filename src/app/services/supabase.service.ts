import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  Session,
  User,
  createClient,
  SupabaseClient
} from '@supabase/supabase-js';
import { Observable, asyncScheduler, from, observeOn } from 'rxjs';
import { Smoking } from '../models/smoking';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabasePublishableKey);
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data.session;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      throw error;
    }
    return data.user;
  }

  onAuthStateChange(): Observable<{ event: AuthChangeEvent; session: Session | null }> {
    return new Observable<{ event: AuthChangeEvent; session: Session | null }>(observer => {
      const { data: { subscription } } = this.supabase.auth.onAuthStateChange((event, session) => {
        observer.next({ event, session });
      });

      return () => subscription.unsubscribe();
    }).pipe(observeOn(asyncScheduler));
  }

  createfumate(fumate: Pick<Smoking, 'data_inserimento' | 'tiri' | 'luogo'>): Observable<Smoking> {
    return from(
      this.supabase
        .from('smoking')
        .insert([fumate])
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Smoking;
        })
    );
  }

  getsmoking(): Observable<Smoking[]> {
    return from((async () => {
      const records: Smoking[] = [];
      let count: number;

      do {
        const { data, error, count: rowCount } = await this.supabase
          .from('smoking')
          .select('*', { count: 'exact' })
          .order('id', { ascending: false })
          .range(records.length, records.length + 999);

        if (error) throw error;
        if (rowCount === null || (data.length === 0 && records.length < rowCount)) {
          throw new Error('Impossibile completare il caricamento delle registrazioni.');
        }

        records.push(...data as Smoking[]);
        count = rowCount;
      } while (records.length < count);

      return records;
    })());
  }

  getDailyTiri(date: string): Observable<number> {
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return from((async () => {
      let total = 0;
      let offset = 0;
      let count: number;

      do {
        const { data, error, count: rowCount } = await this.supabase
          .from('smoking')
          .select('tiri', { count: 'exact' })
          .gte('data_inserimento', start.toISOString())
          .lt('data_inserimento', end.toISOString())
          .order('id')
          .range(offset, offset + 999);

        if (error) throw error;
        if (rowCount === null || (data.length === 0 && offset < rowCount)) {
          throw new Error('Impossibile completare il conteggio giornaliero.');
        }

        total += data.reduce((sum, record) => sum + record.tiri, 0);
        offset += data.length;
        count = rowCount;
      } while (offset < count);

      return total;
    })());
  }

  getSmokingById(id: number): Observable<Smoking> {
    return from(
      this.supabase
        .from('smoking')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Smoking;
        })
    );
  }

  updatefumate(id: number, fumate: Pick<Smoking, 'data_inserimento' | 'tiri' | 'luogo'>): Observable<Smoking> {
    return from(
      this.supabase
        .from('smoking')
        .update(fumate)
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Smoking;
        })
    );
  }

  deletefumate(id: number): Observable<void> {
    return from(
      this.supabase
        .from('smoking')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }
}
