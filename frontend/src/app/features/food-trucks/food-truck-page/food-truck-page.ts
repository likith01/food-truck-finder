// import { Component } from '@angular/core';

// @Component({
//   imports: [],
//   selector: 'app-food-truck-page',
//   styleUrl: './food-truck-page.css',
//   templateUrl: './food-truck-page.html',
// })
// export class FoodTruckPage {}



import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { FoodTruckService } from '../../../core/services/food-truck';
import { FoodTruck } from '../../../core/models/food-truck';
import { FoodTruckSearch } from '../food-truck-search/food-truck-search';
import { FoodTruckList } from '../food-truck-list/food-truck-list';

@Component({
  selector: 'app-food-truck-page',
  standalone: true,
  imports: [
    FoodTruckSearch,
    FoodTruckList,
  ],
  templateUrl: './food-truck-page.html',
  styleUrl: './food-truck-page.css',
})
export class FoodTruckPage implements OnInit {
  private readonly foodTruckService =
    inject(FoodTruckService);

  foodTrucks: FoodTruck[] = [];

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadFoodTrucks();
  }

  private loadFoodTrucks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.foodTruckService
      .getFoodTrucks()
      .subscribe({
        next: (foodTrucks) => {
          this.foodTrucks = foodTrucks;
          this.isLoading = false;
        },

        error: (error: Error) => {
          console.error(
            'Food truck loading failed:',
            error
          );

          this.errorMessage =
            'Unable to load food trucks. Please try again later.';

          this.isLoading = false;
        },
      });
  }
}