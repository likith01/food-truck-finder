import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';

import { Observable, map } from 'rxjs';

import {
  FoodTruck,
  FoodTruckApiResponse,
} from '../models/food-truck';

@Injectable({
  providedIn: 'root',
})
export class FoodTruckService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8000/api/v1/food-trucks';

  getFoodTrucks(
    search?: string,
    latitude?: number,
    longitude?: number,
    radius?: number,
    limit: number = 50,
    offset: number = 0,
  ): Observable<FoodTruck[]> {

    let params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset);

    if (search?.trim()) {
      params = params.set(
        'search',
        search.trim(),
      );
    }

    if (latitude !== undefined) {
      params = params.set(
        'latitude',
        latitude,
      );
    }

    if (longitude !== undefined) {
      params = params.set(
        'longitude',
        longitude,
      );
    }

    if (radius !== undefined) {
      params = params.set(
        'radius',
        radius,
      );
    }

    return this.http
      .get<FoodTruckApiResponse[]>(
        this.apiUrl,
        { params },
      )
      .pipe(
        map((trucks) =>
          trucks.map(
            (truck) =>
              this.mapFoodTruck(truck),
          ),
        ),
      );
  }

  private mapFoodTruck(
    truck: FoodTruckApiResponse,
  ): FoodTruck {

    return {
      id: String(truck.objectid),

      name:
        truck.applicant ??
        'Food Truck',

      locationDescription:
        truck.locationdescription,

      address:
        truck.address,

      permit:
        truck.permit,

      foodItems:
        truck.fooditems,

      latitude:
        Number(truck.latitude),

      longitude:
        Number(truck.longitude),

      daysHours:
        truck.dayshours ??
        undefined,
    };
  }
}