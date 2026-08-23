import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodTruckCard } from './food-truck-card';

describe('FoodTruckCard', () => {
  let component: FoodTruckCard;
  let fixture: ComponentFixture<FoodTruckCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodTruckCard],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodTruckCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
