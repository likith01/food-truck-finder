export interface FoodTruck {
  id: string;
  name: string;

  locationDescription?: string;
  address?: string;
  permit?: string;
  foodItems?: string;

  latitude: number;
  longitude: number;

  daysHours?: string;
}

export interface FoodTruckApiResponse {
  objectid: string | number;
  applicant?: string;

  locationdescription?: string;
  address?: string;
  permit?: string;
  fooditems?: string;

  latitude: string | number;
  longitude: string | number;

  dayshours?: string | null;
}