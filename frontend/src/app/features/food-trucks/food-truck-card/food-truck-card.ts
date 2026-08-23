import {
  Component,
  input,
  output,
} from '@angular/core';

import { FoodTruck } from '../../../core/models/food-truck';

@Component({
  selector: 'app-food-truck-card',
  standalone: true,
  templateUrl: './food-truck-card.html',
  styleUrl: './food-truck-card.css',
})
export class FoodTruckCard {

  readonly foodTruck =
    input.required<FoodTruck>();

  readonly truckSelected =
    output<FoodTruck>();

  selectTruck(): void {
    console.log(
      'Food truck card selected:',
      this.foodTruck(),
    );

    this.truckSelected.emit(
      this.foodTruck(),
    );
  }


  onViewMap(event: Event): void {

    event.stopPropagation();

    console.log(
      'View on Map clicked:',
      this.foodTruck(),
    );

    this.truckSelected.emit(
      this.foodTruck(),
    );
  }
}