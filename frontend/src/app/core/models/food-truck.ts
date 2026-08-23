export interface FoodTruck {
  id: string;
  name: string;
  location_description: string | null;
  address: string | null;
  permit: string | null;
  food_items: string | null;
  latitude: number;
  longitude: number;
  days_hours: string | null;
}