import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { FoodTruck } from '../models/food-truck';

@Injectable({
  providedIn: 'root',
})
export class FoodTruckService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8000/api/v1/food-trucks';

  getFoodTrucks(): Observable<FoodTruck[]> {
    return this.http
      .get<FoodTruck[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(
            'Failed to fetch food trucks',
            error
          );

          return throwError(
            () =>
              new Error(
                'Unable to load food trucks. Please try again later.'
              )
          );
        })
      );
  }
}