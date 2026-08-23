import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodTruckSearch } from './food-truck-search';

describe('FoodTruckSearch', () => {
  let component: FoodTruckSearch;
  let fixture: ComponentFixture<FoodTruckSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodTruckSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodTruckSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
