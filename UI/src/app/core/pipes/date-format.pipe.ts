import { Pipe, PipeTransform } from '@angular/core';
import { DateFormatService } from '../services/date-format.service';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  constructor(private dateFormatService: DateFormatService) {}

  transform(value: string | Date | null | undefined, format?: string): string {
    return this.dateFormatService.formatForDisplay(value, format);
  }
}
