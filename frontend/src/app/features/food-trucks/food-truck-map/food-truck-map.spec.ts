import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodTruckMap } from './food-truck-map';

describe('FoodTruckMap', () => {
  let component: FoodTruckMap;
  let fixture: ComponentFixture<FoodTruckMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodTruckMap],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodTruckMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
