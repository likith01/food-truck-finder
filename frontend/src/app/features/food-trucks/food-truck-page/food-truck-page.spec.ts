import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodTruckPage } from './food-truck-page';

describe('FoodTruckPage', () => {
  let component: FoodTruckPage;
  let fixture: ComponentFixture<FoodTruckPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodTruckPage],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodTruckPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
