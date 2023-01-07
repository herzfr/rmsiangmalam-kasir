import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
import { SettingRepository } from '../../_model/setting/setting.repository';

@Component({
    selector: 'setting-app',
    templateUrl: 'setting.component.html',
    styleUrls: ['setting.component.css']
})

export class SettingComponent implements OnInit {
    constructor(public location: Location, public settingRepo: SettingRepository, private dlg: DialogService) { }

    ngOnInit() { }

    openDialog() {
        this.dlg.showCropImage
    }

    fileChangeEvent(event: any): void {
        this.dlg.showCropImage(event).subscribe(res => {
            // console.log(res);
            if (res.response) {
                let strImage = res.result.replace(/^data:image\/[a-z]+;base64,/, "");
                this.settingRepo.upsert_setting.image = strImage
                // console.log(this.settingRepo.upsert_setting);

            }

        })
    }

    removeImage() {
        this.settingRepo.upsert_setting.image = ''
    }
}