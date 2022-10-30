import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOpt, OptTempSales } from '../../_const/options';
import { ShiftRepository } from '../../_model/shift/shift.repository';
import { TablesRepository } from '../tables/_model/tables.repository';
import { TempSalesRepository } from './_model/tempsales.repository';

@Component({
    selector: 'cashier-apps',
    templateUrl: 'cashier.component.html',
    styleUrls: ['cashier.component.css']
})

export class CashierComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        public tempRepo: TempSalesRepository,
        private router: Router,
        public tableRepo: TablesRepository,
        public shiftRepo: ShiftRepository,
    ) { }
    ngOnInit() { }


    get activeRoute(): string | null {
        // console.log(this.route.snapshot.queryParamMap.get('nav'));
        let onDuty = this.route.snapshot.queryParamMap.get('nav')
        switch (onDuty) {
            case 'list':
                return 'Daftar Pesanan'
            case 'split':
                return 'Pisah Tagihan'
            case 'payment':
                return 'Pembayaran'
            default:
                return '';
        }
    }



    applyFilter(event: any) {
        console.log(event);

    }

    back() {
        // this.location.back()
        this.router.navigate(['/'])
    }
}