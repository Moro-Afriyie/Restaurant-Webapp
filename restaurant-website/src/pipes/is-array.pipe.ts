import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isarray',
})
export class IsArrayPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return !!value?.filter;
  }
}
