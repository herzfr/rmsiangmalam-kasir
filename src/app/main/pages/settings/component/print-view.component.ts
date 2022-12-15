import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SettingRepository } from 'src/app/main/_model/setting/setting.repository';
import { generateArray } from 'src/app/_utility/arraygenerator';
import { TimeUtil } from 'src/app/_utility/time.util';

@Component({
    selector: 'print-view',
    templateUrl: 'print-view.component.html',
    styleUrls: ['print-view.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class PrintViewComponent implements OnInit {
    public today: Date = new Date()
    constructor(public settingRepo: SettingRepository, public timeUtil: TimeUtil) {
        this.today = timeUtil.convertDateTimeLocale(new Date())
        console.log(this.today);

    }

    ngOnInit() { }

    get _date() {
        return this.timeUtil.getJustDateLocale(this.today)
    }

    get _time() {
        return this.timeUtil.getJustTimeLocal(this.today)
    }

    get_count(c: number): number[] {
        return generateArray(c)
    }
}