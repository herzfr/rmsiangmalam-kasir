import { Directive, ElementRef, HostListener } from '@angular/core';
import * as _ from 'lodash';

@Directive({ selector: '[cardmask]' })
export class CardMaskDirective {
    constructor(public ref: ElementRef) { }

    @HostListener('input')
    masking() {
        let str = this.ref.nativeElement.value;
        // console.log(str.length);
        if (str.length > 0) {
            let str_split = str.split('-')
            // console.log(str_split);
            str_split.forEach((_el: any) => {
                // console.log(Number(_el));
                if (_.isNaN(Number(_el))) {
                    // console.log('ini nan');
                    return this.ref.nativeElement.value = null
                }
                return
            });
        }

        if (str.length <= 19) {
            if (this.ref.nativeElement.value.length == 4) {
                return this.ref.nativeElement.value = str + '-'
            } else if (this.ref.nativeElement.value.length == 9) {
                return this.ref.nativeElement.value = str + '-'
            } else if (this.ref.nativeElement.value.length == 14) {
                return this.ref.nativeElement.value = str + '-'
            }

            else {
                return this.ref.nativeElement.value
            }
        } else {
            return
        }



    }
}