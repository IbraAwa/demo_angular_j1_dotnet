import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFahrenheit',
})
export class ToFahrenheitPipe implements PipeTransform {
  transform(value: number, decimals = 1): string {
    const f = (value * 9) / 5 + 32;
    return f.toFixed(decimals) + ' °F';
  }
}
