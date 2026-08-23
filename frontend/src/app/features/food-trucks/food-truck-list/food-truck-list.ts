import { Component } from '@angular/core';
import { FoodTruckCard } from '../food-truck-card/food-truck-card';
@Component({
  imports: [FoodTruckCard],
  selector: 'app-food-truck-list',
  styleUrl: './food-truck-list.css',
  templateUrl: './food-truck-list.html',
})
export class FoodTruckList {}
