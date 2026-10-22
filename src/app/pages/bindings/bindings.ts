import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bindings',
  imports: [FormsModule],
  templateUrl: './bindings.html',
  styleUrl: './bindings.scss',
})
export class Bindings {
  productName = 'Clavier mécanique';
  imageUrl = 'https://picsum.photos/seed/clavier/200/120';
  stock = signal(0);
  quantity = signal(1);
  secondsWrong = 0;
  secondsRight = signal(0);

  restock(amount: number) {
    this.stock.update((s) => s + amount);
  }

  onKey(event: Event) {
    console.log((event.target as HTMLInputElement).value);
  }

  startWrong() {
    setInterval(() => {
      this.secondsWrong++;
      console.log('secondsWrong =', this.secondsWrong);
    }, 1000);
  }

  startRight() {
    setInterval(() => {
      this.secondsRight.update((s) => s + 1);
    }, 1000);
  }
}
