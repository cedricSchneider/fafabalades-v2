import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance',
  standalone: true
})
export class DistancePipe implements PipeTransform {

  transform(value: number): string {
    return (value < 1000 ? (Math.round(value) + ' m') : ((Math.round(value / 100) / 10) + ' km'));
  }

}
