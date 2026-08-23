import {
  Component,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-food-truck-search',
  templateUrl: './food-truck-search.html',
  styleUrl: './food-truck-search.css',
})
export class FoodTruckSearch {

  readonly searchValue = signal('');

  readonly searchRequested = output<string>();

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchValue.set(input.value);
  }

  onSearch(): void {
    const search = this.searchValue().trim();

    this.searchRequested.emit(search);
  }

  clearSearch(): void {
    this.searchValue.set('');

    this.searchRequested.emit('');
  }
}