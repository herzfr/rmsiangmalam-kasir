import { Pipe, PipeTransform } from '@angular/core';
import { TimeUtil } from '../_utility/time.util';

@Pipe({
    name: 'milistodate'
})

export class MilisToDatePipe implements PipeTransform {
    constructor(private time: TimeUtil) { }
    transform(value: number, arg1: any): any {
        switch (arg1) {
            case 'full':
                return this.time.getDate(value)
            case 'date':
                return this.time.getJustDate(value)
            case 'time':
                return this.time.getJustTime(value)
            default:
                return;
        }

    }
}