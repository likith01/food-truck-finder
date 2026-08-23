import { Component } from '@angular/core';

import { FoodTruckPage } from './features/food-trucks/food-truck-page/food-truck-page';

@Component({
  selector: 'app-root',
  imports: [FoodTruckPage],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}