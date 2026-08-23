import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodTruckList } from './food-truck-list';

describe('FoodTruckList', () => {
  let component: FoodTruckList;
  let fixture: ComponentFixture<FoodTruckList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodTruckList],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodTruckList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
