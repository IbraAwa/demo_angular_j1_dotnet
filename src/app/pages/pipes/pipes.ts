import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ToFahrenheitPipe } from '../../pipes/to-fahrenheit-pipe';

@Component({
  selector: 'app-pipes',
  imports: [UpperCasePipe, DatePipe, CurrencyPipe, ToFahrenheitPipe],
  templateUrl: './pipes.html',
  styleUrl: './pipes.scss',
})
export class Pipes {
  message = 'Salut les gars';
  today = new Date(2026, 9, 8);
  price = 1250.5;
}
