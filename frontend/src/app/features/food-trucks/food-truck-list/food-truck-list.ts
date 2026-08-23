import {
  Component,
  input,
  output,
} from '@angular/core';

import { FoodTruck } from '../../../core/models/food-truck';

import { FoodTruckCard } from '../food-truck-card/food-truck-card';

@Component({
  selector: 'app-food-truck-list',
  standalone: true,
  imports: [
    FoodTruckCard,
  ],
  templateUrl: './food-truck-list.html',
  styleUrl: './food-truck-list.css',
})
export class FoodTruckList {

  readonly foodTrucks =
    input<FoodTruck[]>([]);

  readonly isLoading =
    input<boolean>(false);

  readonly errorMessage =
    input<string>('');

  readonly isLoadingMore =
    input<boolean>(false);

  readonly hasMore =
    input<boolean>(true);

  readonly truckSelected =
    output<FoodTruck>();

  readonly loadMore =
    output<void>();

  onTruckSelected(
    truck: FoodTruck,
  ): void {

    console.info(
      'Food truck selected from list:',
      {
        id: truck.id,
        name: truck.name,
      },
    );

    this.truckSelected.emit(truck);
  }

  onLoadMore(): void {

    console.info(
      'Load more requested.',
    );

    this.loadMore.emit();
  }
}