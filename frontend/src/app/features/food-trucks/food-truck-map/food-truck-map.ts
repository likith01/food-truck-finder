import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
  input,
  output,
} from '@angular/core';

import * as L from 'leaflet';

import { FoodTruck } from '../../../core/models/food-truck';

@Component({
  selector: 'app-food-truck-map',
  standalone: true,
  templateUrl: './food-truck-map.html',
  styleUrl: './food-truck-map.css',
})
export class FoodTruckMap implements AfterViewInit, OnChanges {

  readonly foodTrucks = input<FoodTruck[]>([]);

  readonly userLatitude =
    input<number | undefined>(undefined);

  readonly userLongitude =
    input<number | undefined>(undefined);

  readonly truckSelected =
    output<FoodTruck>();

  @ViewChild('mapContainer')
  private mapContainer?: ElementRef<HTMLDivElement>;

  private map?: L.Map;

  private truckLayer?: L.LayerGroup;

  private userMarker?: L.Marker;

  private mapInitialized = false;

  private truckMarkers =
    new Map<string, L.Marker>();

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.mapInitialized) {
      return;
    }

    if (
      changes['foodTrucks'] ||
      changes['userLatitude'] ||
      changes['userLongitude']
    ) {
      this.updateMap();
    }
  }

  private initializeMap(): void {

    if (
      this.mapInitialized ||
      !this.mapContainer
    ) {
      return;
    }

    try {

      this.map = L.map(
        this.mapContainer.nativeElement,
        {
          center: [37.7749, -122.4194],
          zoom: 12,
        },
      );

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; OpenStreetMap contributors',
        },
      ).addTo(this.map);

      this.truckLayer =
        L.layerGroup().addTo(this.map);

      this.mapInitialized = true;

      console.info(
        'Food truck map initialized.',
      );

      this.updateMap();

    } catch (error: unknown) {

      console.error(
        'Failed to initialize food truck map:',
        error,
      );
    }
  }

  private updateMap(): void {

    if (!this.map) {
      console.warn(
        'Map update skipped because map is not initialized.',
      );

      return;
    }

    this.updateTruckMarkers();

    this.updateUserLocation();
  }

  private updateTruckMarkers(): void {

    if (!this.truckLayer) {
      console.warn(
        'Truck marker layer is not initialized.',
      );

      return;
    }

    this.truckLayer.clearLayers();

    this.truckMarkers.clear();

    const trucks = this.foodTrucks();

    console.info(
      `Rendering ${trucks.length} food truck(s) on map.`,
    );

    for (const truck of trucks) {

      if (!this.hasValidCoordinates(truck)) {

        console.warn(
          'Skipping food truck with invalid coordinates:',
          truck,
        );

        continue;
      }

      try {

        const marker = L.marker([
          truck.latitude,
          truck.longitude,
        ]);

        /*
         * Create the popup ONCE and attach it
         * to this exact marker.
         */
        const popupContent =
          this.createPopupContent(truck);

        marker.bindPopup(
          popupContent,
          {
            closeButton: true,
            autoClose: true,
            closeOnClick: true,
            autoPan: true,
            maxWidth: 300,
          },
        );

        /*
         * Important:
         *
         * Clicking the marker should ONLY open
         * the popup.
         *
         * Do not emit truckSelected here.
         *
         * Otherwise the parent may change the
         * selected state and recreate the map.
         */
        marker.on(
          'click',
          () => {

            console.info(
              'Map marker clicked:',
              {
                id: truck.id,
                name: truck.name,
              },
            );

            marker.openPopup();
          },
        );

        /*
         * Log whenever the popup actually opens.
         */
        marker.on(
          'popupopen',
          () => {

            console.info(
              'Popup opened for food truck:',
              {
                id: truck.id,
                name: truck.name,
                address: truck.address,
              },
            );
          },
        );

        marker.addTo(
          this.truckLayer,
        );

        /*
         * Always use String() so the lookup
         * works even if the backend sends a
         * numeric ID.
         */
        this.truckMarkers.set(
          String(truck.id),
          marker,
        );

      } catch (error: unknown) {

        console.error(
          'Failed to create marker for food truck:',
          {
            truck,
            error,
          },
        );
      }
    }
  }

  private hasValidCoordinates(
    truck: FoodTruck,
  ): boolean {

    if (
      !Number.isFinite(truck.latitude) ||
      !Number.isFinite(truck.longitude)
    ) {
      return false;
    }

    if (
      truck.latitude === 0 &&
      truck.longitude === 0
    ) {
      return false;
    }

    return true;
  }

  private createPopupContent(
    truck: FoodTruck,
  ): string {

    const name =
      this.escapeHtml(
        truck.name || 'Food Truck',
      );

    const address =
      this.escapeHtml(
        truck.address || 'Address unavailable',
      );

    const foodItems =
      this.escapeHtml(
        truck.foodItems ||
        'Food information unavailable',
      );

    const daysHours =
      this.escapeHtml(
        truck.daysHours ||
        'Hours unavailable',
      );

    return `
      <div class="truck-popup">

        <div class="truck-popup-name">
          ${name}
        </div>

        <div class="truck-popup-row">
          📍 ${address}
        </div>

        <div class="truck-popup-row">
          🍴 ${foodItems}
        </div>

        <div class="truck-popup-row">
          🕐 ${daysHours}
        </div>

      </div>
    `;
  }

  // private updateUserLocation(): void {

  //   if (!this.map) {
  //     return;
  //   }

  //   const latitude =
  //     this.userLatitude();

  //   const longitude =
  //     this.userLongitude();

  //   if (
  //     latitude === undefined ||
  //     longitude === undefined
  //   ) {
  //     return;
  //   }

  //   if (
  //     !Number.isFinite(latitude) ||
  //     !Number.isFinite(longitude)
  //   ) {
  //     console.warn(
  //       'Invalid user coordinates:',
  //       {
  //         latitude,
  //         longitude,
  //       },
  //     );

  //     return;
  //   }

  //   try {

  //     if (this.userMarker) {
  //       this.userMarker.remove();
  //     }

  //     this.userMarker =
  //       L.marker([
  //         latitude,
  //         longitude,
  //       ])
  //         .addTo(this.map)
  //         .bindPopup(
  //           'Your current location',
  //         );

  //     console.info(
  //       'User location marker updated:',
  //       {
  //         latitude,
  //         longitude,
  //       },
  //     );

  //   } catch (error: unknown) {

  //     console.error(
  //       'Failed to update user location:',
  //       error,
  //     );
  //   }
  // }

  private updateUserLocation(): void {

    if (!this.map) {
      return;
    }

    const latitude = this.userLatitude();
    const longitude = this.userLongitude();

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return;
    }

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    try {

      if (this.userMarker) {
        this.userMarker.remove();
      }

      this.userMarker = L.marker([
        latitude,
        longitude,
      ])
        .addTo(this.map)
        .bindPopup(
          '<strong>Your Current Location</strong>',
        );

      /*
       * Move map to user's location.
       */
      this.map.flyTo(
        [latitude, longitude],
        14,
        {
          animate: true,
          duration: 1,
        },
      );

      console.info(
        'Map moved to user location:',
        {
          latitude,
          longitude,
        },
      );

    } catch (error: unknown) {

      console.error(
        'Failed to update user location:',
        error,
      );
    }
  }

  focusOnTruck(
    truck: FoodTruck,
  ): void {

    if (!this.map) {

      console.warn(
        'Cannot focus on truck because map is not initialized.',
      );

      return;
    }

    if (!this.hasValidCoordinates(truck)) {

      console.warn(
        'Cannot focus on truck with invalid coordinates:',
        truck,
      );

      return;
    }

    try {

      const latitude =
        Number(truck.latitude);

      const longitude =
        Number(truck.longitude);

      console.info(
        'Focusing map on truck:',
        {
          id: truck.id,
          name: truck.name,
          latitude,
          longitude,
        },
      );

      /*
       * Move to the truck.
       */
      this.map.flyTo(
        [
          latitude,
          longitude,
        ],
        16,
        {
          animate: true,
          duration: 0.8,
        },
      );

      /*
       * Find the EXISTING marker.
       */
      const marker =
        this.truckMarkers.get(
          String(truck.id),
        );

      if (!marker) {

        console.warn(
          'Marker not found for selected truck:',
          {
            id: truck.id,
            name: truck.name,
            availableMarkerIds:
              Array.from(
                this.truckMarkers.keys(),
              ),
          },
        );

        return;
      }

      /*
       * Open the popup attached to this marker.
       */
      setTimeout(
        () => {

          try {

            marker.openPopup();

            console.info(
              'Popup opened after focusing truck:',
              {
                id: truck.id,
                name: truck.name,
              },
            );

          } catch (error: unknown) {

            console.error(
              'Failed to open truck popup:',
              error,
            );
          }

        },
        850,
      );

    } catch (error: unknown) {

      console.error(
        'Failed to focus map on food truck:',
        {
          truck,
          error,
        },
      );
    }
  }

  private escapeHtml(
    value: string,
  ): string {

    return value
      .replaceAll(
        '&',
        '&amp;',
      )
      .replaceAll(
        '<',
        '&lt;',
      )
      .replaceAll(
        '>',
        '&gt;',
      )
      .replaceAll(
        '"',
        '&quot;',
      )
      .replaceAll(
        "'",
        '&#039;',
      );
  }
}