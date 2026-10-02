import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of } from 'rxjs';
import { CalendarYearResponse } from '../models/calendar.models';


/** Mock API производственного календаря */
@Injectable({ providedIn: 'root' })
export class CalendarMockService {
  private readonly http = inject(HttpClient);

  /** Записи за год */
  getYear(year: number): Observable<CalendarYearResponse> {
    return this.http.get<CalendarYearResponse>(`mocks/calendar-${year}.json`).pipe(
      map((res) => ({ year, entries: res.entries ?? [] })),
      catchError(() => of({ year, entries: [] })),
    );
  }
}
