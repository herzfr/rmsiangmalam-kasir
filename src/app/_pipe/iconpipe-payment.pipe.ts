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
        'kredit bca',
        'giro bca',
        'bca giro',
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
        'kredit bri',
        'giro bri',
        'bri giro',
    ]
    _mandiri = [
        'mandiri',
        'bank mandiri',
        'mandiri bank',
        'debit mandiri',
        'mandiri debit',
        'mandiri qris',
        'mandiri kredit',
        'kredit mandiri',
        'giro mandiri',
        'mandiri giro',
    ]
    _bni = [
        'bni',
        'bank negara indonesia',
        'bni bank',
        'debit bni',
        'bni debit',
        'bni qris',
        'bni kredit',
        'kredit bni',
        'giro bni',
        'bni giro',
    ]
    _bsi = [
        'bsi',
        'bank syariah indonesia',
        'bsi bank',
        'debit bsi',
        'bsi debit',
        'bsi qris',
        'bsi kredit',
        'kredit bsi',
        'giro bsi',
        'bsi giro',
    ]

    _permata = [
        'permata',
        'bank permata',
        'permata bank',
        'debit permata',
        'permata debit',
        'permata qris',
        'permata kredit',
        'kredit permata',
        'giro permata',
        'permata giro',
    ]

    _cimb = [
        'cimb',
        'cimb niaga',
        'cimb niaga ',
        'cimb niaga',
        'bank cimb niaga',
        'bank cimb',
        'cimb bank',
        'debit cimb',
        'cimb debit',
        'cimb qris',
        'cimb kredit',
        'kredit cimb',
        'giro cimb',
        'cimb giro',
    ]

    _muamalat = [
        'muamalat',
        'muamalat syariah',
        'bank syariah muamalat',
        'bank muamalat syariah',
        'syariah bank muamalat',
        'bank muamalat',
        'muamalat bank',
        'debit muamalat',
        'muamalat debit',
        'muamalat qris',
        'muamalat kredit',
        'kredit muamalat',
        'giro muamalat',
        'muamalat giro',
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

    _jago = [
        'jago',
        'jago pay',
        'jago qris',
        'qris jago',
        'pay jago',
        'bank jago',
        'jago bank',
        'debit jago',
        'jago debit',
        'jago qris',
        'jago kredit',
        'kredit jago',
        'giro jago',
        'jago giro',
    ]

    _mega = [
        'mega',
        'mega finance',
        'mega pay',
        'mega qris',
        'qris mega',
        'pay mega',
        'bank mega',
        'mega bank',
        'debit mega',
        'mega debit',
        'mega qris',
        'mega kredit',
        'kredit mega',
        'giro mega',
        'mega giro',
    ]

    _dana = [
        'dana',
        'saldo dana',
        'dana pay',
        'dana qris',
        'qris dana',
        'pay dana',
    ]

    _linkaja = [
        'linkaja',
        'saldo linkaja',
        'linkaja pay',
        'linkaja qris',
        'qris linkaja',
        'pay linkaja',
        'link aja',
        'linkaja bank',
        'bank linkaja',
        'link aja bank',
        'bank link aja',
        'giro linkaja',
        'linkaja giro',
    ]

    _ovo = [
        'ovo',
        'saldo ovo',
        'ovo pay',
        'ovo qris',
        'qris ovo',
        'pay ovo',
    ]

    _jenius = [
        'jenius',
        'jenius pay',
        'jenius qris',
        'qris jenius',
        'pay jenius',
        'bank jenius',
        'jenius bank',
        'debit jenius',
        'jenius debit',
        'jenius qris',
        'jenius kredit',
        'kredit jenius',
        'giro jenius',
        'jenius giro',
    ]




    transform(values: string): any {
        let value = values.toLowerCase()

        if (this._bca.indexOf(value) >= 0) {
            return 'assets/images/payment-image/bca.png'
        }
        if (this._bri.indexOf(value) >= 0) {
            return 'assets/images/payment-image/bri.png'
        }
        if (this._mandiri.indexOf(value) >= 0) {
            return 'assets/images/payment-image/mandiri.png'
        }
        if (this._bni.indexOf(value) >= 0) {
            return 'assets/images/payment-image/bni.png'
        }
        if (this._bsi.indexOf(value) >= 0) {
            return 'assets/images/payment-image/bsi.png'
        }
        if (this._gopay.indexOf(value) >= 0) {
            return 'assets/images/payment-image/gopay.png'
        }
        if (this._shopee.indexOf(value) >= 0) {
            return 'assets/images/payment-image/shopee.png'
        }
        if (this._permata.indexOf(value) >= 0) {
            return 'assets/images/payment-image/permata.png'
        }
        if (this._muamalat.indexOf(value) >= 0) {
            return 'assets/images/payment-image/muamalat.png'
        }
        if (this._jago.indexOf(value) >= 0) {
            return 'assets/images/payment-image/jago.png'
        }
        if (this._linkaja.indexOf(value) >= 0) {
            return 'assets/images/payment-image/linkaja.png'
        }
        if (this._ovo.indexOf(value) >= 0) {
            return 'assets/images/payment-image/ovo.png'
        }
        if (this._dana.indexOf(value) >= 0) {
            return 'assets/images/payment-image/dana.png'
        }
        if (this._jenius.indexOf(value) >= 0) {
            return 'assets/images/payment-image/jenius.png'
        }
        if (this._cimb.indexOf(value) >= 1) {
            return 'assets/images/payment-image/cimb.png'
        }
        if (this._mega.indexOf(value) >= 1) {
            return 'assets/images/payment-image/mega.png'
        }
        return 'assets/images/payment-image/bank-default.svg'

    }
}