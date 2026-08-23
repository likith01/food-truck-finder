import { TestBed } from '@angular/core/testing';
import { FoodTruck } from './food-truck';

describe('FoodTruck', () => {
  let service: FoodTruck;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodTruck);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
