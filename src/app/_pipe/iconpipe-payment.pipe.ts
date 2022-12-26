import { Pipe, PipeTransform } from '@angular/core';
import { TimeUtil } from '../_utility/time.util';

@Pipe({
    name: 'paymentcode'
})

export class PaymentCode implements PipeTransform {
    // constructor(private time: string) { }
    _bca = [
        'bca',
        'bank central asia',
        'bank bca',
        'bca bank',
        'debit bca',
        'bca debit',
        'bca qris',
        'bca kredit',
        'kredit bca'
    ]
    _bri = [
        'bri',
        'bank rakyat indonesia',
        'bank bri',
        'bri bank',
        'debit bri',
        'bri debit',
        'bri qris',
        'bri kredit',
        'kredit bri'
    ]
    _mandiri = [
        'mandiri',
        'bank mandiri',
        'mandiri bank',
        'debit mandiri',
        'mandiri debit',
        'mandiri qris',
        'mandiri kredit',
        'kredit mandiri'
    ]
    _bni = [
        'bni',
        'bank negara indonesia',
        'bni bank',
        'debit bni',
        'bni debit',
        'bni qris',
        'bni kredit',
        'kredit bni'
    ]
    _bsi = [
        'bsi',
        'bank syariah indonesia',
        'bsi bank',
        'debit bsi',
        'bsi debit',
        'bsi qris',
        'bsi kredit',
        'kredit bsi'
    ]
    _shopee = [
        'shopee',
        'shopee pay',
        'shopee qris',
        'qris shopee',
        'pay shopee',
        'shopeepay',
    ]
    _gopay = [
        'gopay',
        'gopay pay',
        'gopay qris',
        'qris gopay',
        'pay gopay',
    ]
    transform(values: string): any {
        let value = values.toLowerCase()

        if (this._bca.indexOf(value) === 0) {
            return 'assets/images/payment-image/bca.png'
        }
        if (this._bri.indexOf(value) === 0) {
            return 'assets/images/payment-image/bri.png'
        }
        if (this._mandiri.indexOf(value) === 0) {
            return 'assets/images/payment-image/mandiri.png'
        }
        if (this._bni.indexOf(value) === 0) {
            return 'assets/images/payment-image/bni.png'
        }
        if (this._bsi.indexOf(value) === 0) {
            return 'assets/images/payment-image/bsi.png'
        }
        if (this._gopay.indexOf(value) === 0) {
            return 'assets/images/payment-image/gopay.png'
        }
        if (this._shopee.indexOf(value) === 0) {
            return 'assets/images/payment-image/shopee.png'
        }

    }
}