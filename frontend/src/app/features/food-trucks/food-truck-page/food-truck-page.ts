import {
  Component,
  OnInit,
  inject,
  signal,
  ViewChild
} from '@angular/core';

import { FoodTruck } from '../../../core/models/food-truck';
import { FoodTruckService } from '../../../core/services/food-truck';

import { FoodTruckList } from '../food-truck-list/food-truck-list';
import { FoodTruckSearch } from '../food-truck-search/food-truck-search';
import { FoodTruckMap } from '../food-truck-map/food-truck-map';
@Component({
  selector: 'app-food-truck-page',
  imports: [
    FoodTruckList,
    FoodTruckSearch,
    FoodTruckMap
  ],
  templateUrl: './food-truck-page.html',
  styleUrl: './food-truck-page.css',
})
export class FoodTruckPage implements OnInit {
  @ViewChild(FoodTruckMap)
  private foodTruckMap?: FoodTruckMap;

  private readonly foodTruckService =
    inject(FoodTruckService);

  readonly foodTrucks = signal<FoodTruck[]>([]);

  readonly isLoading = signal(true);

  readonly errorMessage = signal('');

  readonly userLatitude =
    signal<number | undefined>(undefined);

  readonly userLongitude =
    signal<number | undefined>(undefined);

  readonly searchRadius =
    signal<number>(5);

  readonly locationLoading =
    signal(false);

  readonly locationError =
    signal('');

  readonly isLoadingMore =
    signal(false);

  readonly hasMore =
    signal(true);

  private readonly pageSize = 50;

  private currentOffset = 0;

  private currentSearch = '';

  ngOnInit(): void {
    this.loadFoodTrucks();
  }

  /**
   * Load initial food truck data.
   */
  private loadFoodTrucks(): void {

    this.isLoading.set(true);
    this.isLoadingMore.set(false);
    this.errorMessage.set('');

    this.currentOffset = 0;
    this.hasMore.set(true);

    this.foodTruckService
      .getFoodTrucks(
        undefined,
        undefined,
        undefined,
        undefined,
        this.pageSize,
        this.currentOffset,
      )
      .subscribe({

        next: (foodTrucks) => {

          console.info(
            'Food trucks loaded:',
            {
              count: foodTrucks.length,
              offset: this.currentOffset,
            },
          );

          this.foodTrucks.set(foodTrucks);

          this.hasMore.set(
            foodTrucks.length === this.pageSize,
          );

          this.isLoading.set(false);
        },

        error: (error: unknown) => {

          console.error(
            'Food truck loading failed:',
            error,
          );

          this.errorMessage.set(
            'Unable to load food trucks. Please try again later.',
          );

          this.isLoading.set(false);
        },

      });
  }

  /**
   * Search food trucks by name or food item.
   */
  // onSearch(search: string): void {

  //   console.info(
  //     'Searching food trucks:',
  //     search,
  //   );

  //   this.isLoading.set(true);
  //   this.isLoadingMore.set(false);
  //   this.errorMessage.set('');

  //   this.currentOffset = 0;
  //   this.hasMore.set(true);

  //   this.foodTruckService
  //     .getFoodTrucks(
  //       search || undefined,
  //       undefined,
  //       undefined,
  //       undefined,
  //       this.pageSize,
  //       this.currentOffset,
  //     )
  //     .subscribe({

  //       next: (foodTrucks) => {

  //         console.info(
  //           'Search results loaded:',
  //           {
  //             count: foodTrucks.length,
  //             offset: this.currentOffset,
  //           },
  //         );

  //         this.foodTrucks.set(foodTrucks);

  //         this.hasMore.set(
  //           foodTrucks.length === this.pageSize,
  //         );

  //         this.isLoading.set(false);
  //       },

  //       error: (error: unknown) => {

  //         console.error(
  //           'Food truck search failed:',
  //           error,
  //         );

  //         this.errorMessage.set(
  //           'Unable to search food trucks. Please try again.',
  //         );

  //         this.isLoading.set(false);
  //       },

  //     });
  // }

  onSearch(search: string): void {

    this.currentSearch = search.trim();

    console.info(
      'Searching food trucks:',
      this.currentSearch,
    );

    this.isLoading.set(true);
    this.isLoadingMore.set(false);
    this.errorMessage.set('');

    // Reset pagination for a new search
    this.currentOffset = 0;
    this.hasMore.set(true);

    this.foodTruckService
      .getFoodTrucks(
        this.currentSearch || undefined,
        undefined,
        undefined,
        undefined,
        this.pageSize,
        this.currentOffset,
      )
      .subscribe({

        next: (foodTrucks) => {

          console.info(
            'Search results loaded:',
            {
              count: foodTrucks.length,
              search: this.currentSearch,
              offset: this.currentOffset,
            },
          );

          this.foodTrucks.set(foodTrucks);

          this.hasMore.set(
            foodTrucks.length === this.pageSize,
          );

          this.isLoading.set(false);
        },

        error: (error: unknown) => {

          console.error(
            'Food truck search failed:',
            error,
          );

          this.errorMessage.set(
            'Unable to search food trucks. Please try again.',
          );

          this.isLoading.set(false);
        },

      });
  }

  loadMoreFoodTrucks(): void {

    if (
      this.isLoadingMore() ||
      !this.hasMore()
    ) {
      console.warn(
        'Load more skipped:',
        {
          isLoadingMore: this.isLoadingMore(),
          hasMore: this.hasMore(),
        },
      );

      return;
    }

    this.isLoadingMore.set(true);

    const nextOffset =
      this.currentOffset + this.pageSize;

    console.info(
      'Loading more food trucks:',
      {
        limit: this.pageSize,
        offset: nextOffset,
      },
    );

    this.foodTruckService
      .getFoodTrucks(
        undefined,
        this.userLatitude(),
        this.userLongitude(),
        this.userLatitude() !== undefined &&
          this.userLongitude() !== undefined
          ? this.searchRadius()
          : undefined,
        this.pageSize,
        nextOffset,
      )
      .subscribe({

        next: (foodTrucks) => {

          console.info(
            'More food trucks loaded:',
            {
              count: foodTrucks.length,
              offset: nextOffset,
            },
          );

          this.foodTrucks.update(
            (currentTrucks) => [
              ...currentTrucks,
              ...foodTrucks,
            ],
          );

          this.currentOffset = nextOffset;

          this.hasMore.set(
            foodTrucks.length === this.pageSize,
          );

          this.isLoadingMore.set(false);
        },

        error: (error: unknown) => {

          console.error(
            'Failed to load more food trucks:',
            error,
          );

          this.errorMessage.set(
            'Unable to load more food trucks. Please try again.',
          );

          this.isLoadingMore.set(false);
        },

      });
  }

  /**
   * Get the user's current browser location.
   */

  useMyLocation(): void {
    if (!navigator.geolocation) {
      this.locationError.set(
        'Geolocation is not supported by your browser.',
      );
      return;
    }

    this.locationLoading.set(true);
    this.locationError.set('');

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.info('User location:', {
          latitude,
          longitude,
        });

        // Store user's location
        this.userLatitude.set(latitude);
        this.userLongitude.set(longitude);

        // Load trucks around user's location
        this.loadNearbyFoodTrucks(
          latitude,
          longitude,
        );
      },

      (error: GeolocationPositionError) => {

        console.error(
          'Geolocation error:',
          error,
        );

        this.locationLoading.set(false);

        switch (error.code) {

          case error.PERMISSION_DENIED:
            this.locationError.set(
              'Location permission was denied.',
            );
            break;

          case error.POSITION_UNAVAILABLE:
            this.locationError.set(
              'Unable to determine your location.',
            );
            break;

          case error.TIMEOUT:
            this.locationError.set(
              'Location request timed out.',
            );
            break;

          default:
            this.locationError.set(
              'Unable to get your location.',
            );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }
  // useMyLocation(): void {

  //   if (!navigator.geolocation) {

  //     console.error(
  //       'Geolocation is not supported by this browser.',
  //     );

  //     this.locationError.set(
  //       'Geolocation is not supported by your browser.',
  //     );

  //     return;
  //   }

  //   this.locationLoading.set(true);
  //   this.locationError.set('');

  //   navigator.geolocation.getCurrentPosition(

  //     (position: GeolocationPosition) => {

  //       const latitude =
  //         position.coords.latitude;

  //       const longitude =
  //         position.coords.longitude;

  //       console.log(
  //         'User location received:',
  //         {
  //           latitude,
  //           longitude,
  //         },
  //       );

  //       this.userLatitude.set(latitude);
  //       this.userLongitude.set(longitude);

  //       this.loadNearbyFoodTrucks(
  //         latitude,
  //         longitude,
  //       );
  //     },

  //     (error: GeolocationPositionError) => {

  //       console.error(
  //         'Failed to get user location:',
  //         {
  //           code: error.code,
  //           message: error.message,
  //         },
  //       );

  //       this.locationLoading.set(false);

  //       switch (error.code) {

  //         case error.PERMISSION_DENIED:

  //           this.locationError.set(
  //             'Location permission was denied.',
  //           );

  //           break;

  //         case error.POSITION_UNAVAILABLE:

  //           this.locationError.set(
  //             'Unable to determine your location.',
  //           );

  //           break;

  //         case error.TIMEOUT:

  //           this.locationError.set(
  //             'Location request timed out.',
  //           );

  //           break;

  //         default:

  //           this.locationError.set(
  //             'Unable to get your location.',
  //           );
  //       }
  //     },
  //   );
  // }

  /**
   * Load food trucks near the user's location.
   */
  // private loadNearbyFoodTrucks(
  //   latitude: number,
  //   longitude: number,
  // ): void {

  //   this.isLoading.set(true);
  //   this.errorMessage.set('');

  //   const radius = this.searchRadius();

  //   console.log(
  //     'Loading nearby food trucks:',
  //     {
  //       latitude,
  //       longitude,
  //       radius,
  //     },
  //   );

  //   this.foodTruckService
  //     .getFoodTrucks(
  //       undefined,
  //       latitude,
  //       longitude,
  //       radius,
  //       50,
  //       0,
  //     )
  //     .subscribe({

  //       next: (foodTrucks) => {

  //         console.log(
  //           'Nearby food trucks loaded:',
  //           foodTrucks,
  //         );

  //         this.foodTrucks.set(foodTrucks);

  //         this.isLoading.set(false);
  //         this.locationLoading.set(false);
  //       },

  //       error: (error: unknown) => {

  //         console.error(
  //           'Failed to load nearby food trucks:',
  //           error,
  //         );

  //         this.errorMessage.set(
  //           'Unable to load nearby food trucks. Please try again.',
  //         );

  //         this.isLoading.set(false);
  //         this.locationLoading.set(false);
  //       },

  //     });
  // }

  private loadNearbyFoodTrucks(
    latitude: number,
    longitude: number,
  ): void {

    this.isLoading.set(true);
    this.isLoadingMore.set(false);
    this.errorMessage.set('');

    this.currentOffset = 0;
    this.hasMore.set(true);

    const radius =
      this.searchRadius();

    console.info(
      'Loading nearby food trucks:',
      {
        latitude,
        longitude,
        radius,
      },
    );

    this.foodTruckService
      .getFoodTrucks(
        undefined,
        latitude,
        longitude,
        radius,
        this.pageSize,
        0,
      )
      .subscribe({

        next: (foodTrucks) => {

          console.info(
            'Nearby food trucks loaded:',
            {
              count: foodTrucks.length,
            },
          );

          this.foodTrucks.set(
            foodTrucks,
          );

          this.hasMore.set(
            foodTrucks.length === this.pageSize,
          );

          this.isLoading.set(false);
          this.locationLoading.set(false);
        },

        error: (error: unknown) => {

          console.error(
            'Failed to load nearby food trucks:',
            error,
          );

          this.errorMessage.set(
            'Unable to load nearby food trucks. Please try again.',
          );

          this.isLoading.set(false);
          this.locationLoading.set(false);
        },

      });
  }

  /**
   * Change the search radius.
   */
  // onRadiusChange(event: Event): void {

  //   const select =
  //     event.target as HTMLSelectElement;

  //   const radius = Number(select.value);

  //   if (
  //     !Number.isFinite(radius) ||
  //     radius <= 0
  //   ) {

  //     console.warn(
  //       'Invalid radius selected:',
  //       select.value,
  //     );

  //     return;
  //   }

  //   this.searchRadius.set(radius);

  //   console.log(
  //     'Search radius changed:',
  //     radius,
  //   );

  //   const latitude =
  //     this.userLatitude();

  //   const longitude =
  //     this.userLongitude();

  //   /*
  //    * Only reload nearby trucks when
  //    * the user has already selected a location.
  //    */
  //   if (
  //     latitude !== undefined &&
  //     longitude !== undefined
  //   ) {

  //     this.loadNearbyFoodTrucks(
  //       latitude,
  //       longitude,
  //     );
  //   }
  // }

  onRadiusChange(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    const radius =
      Number(select.value);

    if (
      !Number.isFinite(radius) ||
      radius <= 0
    ) {
      console.warn(
        'Invalid radius selected:',
        select.value,
      );

      return;
    }

    this.searchRadius.set(radius);

    console.info(
      'Search radius changed:',
      radius,
    );

    const latitude =
      this.userLatitude();

    const longitude =
      this.userLongitude();

    /*
     * If location has not been selected yet,
     * just remember the radius.
     */
    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return;
    }

    /*
     * New radius = new query.
     * Start pagination from the beginning.
     */
    this.currentOffset = 0;
    this.hasMore.set(true);
    this.currentSearch = '';

    this.loadNearbyFoodTrucks(
      latitude,
      longitude,
    );
  }

  onTruckSelected(truck: FoodTruck): void {

    console.info(
      'Truck selected:',
      {
        id: truck.id,
        name: truck.name,
        latitude: truck.latitude,
        longitude: truck.longitude,
      },
    );

    this.foodTruckMap?.focusOnTruck(truck);
  }


  // onLoadMore(): void {

  //   if (
  //     this.isLoadingMore() ||
  //     !this.hasMore()
  //   ) {
  //     return;
  //   }

  //   console.info(
  //     'Loading next page...',
  //     {
  //       offset: this.currentOffset,
  //       limit: this.pageSize,
  //     },
  //   );

  //   this.isLoadingMore.set(true);

  //   this.foodTruckService
  //     .getFoodTrucks(
  //       undefined,
  //       this.userLatitude(),
  //       this.userLongitude(),
  //       this.userLatitude() !== undefined &&
  //         this.userLongitude() !== undefined
  //         ? this.searchRadius()
  //         : undefined,
  //       this.pageSize,
  //       this.currentOffset,
  //     )
  //     .subscribe({

  //       next: (trucks) => {

  //         console.info(
  //           'More food trucks received:',
  //           trucks.length,
  //         );

  //         this.foodTrucks.update(
  //           current => [
  //             ...current,
  //             ...trucks,
  //           ],
  //         );

  //         this.currentOffset += trucks.length;

  //         /*
  //          * If fewer than 50 records came back,
  //          * there are no more records.
  //          */
  //         if (trucks.length < this.pageSize) {
  //           this.hasMore.set(false);
  //         }

  //         this.isLoadingMore.set(false);
  //       },

  //       error: (error: unknown) => {

  //         console.error(
  //           'Failed to load more food trucks:',
  //           error,
  //         );

  //         this.isLoadingMore.set(false);
  //       },

  //     });
  // }
  onLoadMore(): void {

    if (
      this.isLoadingMore() ||
      !this.hasMore()
    ) {
      console.info(
        'Load more skipped.',
      );

      return;
    }

    const nextOffset =
      this.currentOffset + this.pageSize;

    console.info(
      'Loading next page:',
      {
        search: this.currentSearch,
        latitude: this.userLatitude(),
        longitude: this.userLongitude(),
        radius: this.searchRadius(),
        limit: this.pageSize,
        offset: nextOffset,
      },
    );

    this.isLoadingMore.set(true);

    const latitude = this.userLatitude();
    const longitude = this.userLongitude();

    const radius =
      latitude !== undefined &&
        longitude !== undefined
        ? this.searchRadius()
        : undefined;

    this.foodTruckService
      .getFoodTrucks(
        this.currentSearch || undefined,
        latitude,
        longitude,
        radius,
        this.pageSize,
        nextOffset,
      )
      .subscribe({

        next: (trucks) => {

          console.info(
            'More food trucks received:',
            {
              count: trucks.length,
              offset: nextOffset,
            },
          );

          this.foodTrucks.update(
            current => [
              ...current,
              ...trucks,
            ],
          );

          this.currentOffset = nextOffset;

          /*
           * If fewer than 50 records were returned,
           * we reached the end.
           */
          this.hasMore.set(
            trucks.length === this.pageSize,
          );

          this.isLoadingMore.set(false);
        },

        error: (error: unknown) => {

          console.error(
            'Failed to load more food trucks:',
            error,
          );

          this.errorMessage.set(
            'Unable to load more food trucks. Please try again.',
          );

          this.isLoadingMore.set(false);
        },

      });
  }
}