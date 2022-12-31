import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import * as _ from "lodash";
import { DialogService } from "src/app/shared/dialogs/dialog.service";
import { SettingService } from "../../_service/settings.service";
import { ShiftRepository } from "../shift/shift.repository";
import { DataSetting, Setting, UpserSetting } from "./setting.model";

@Injectable()
export class SettingRepository {
    public page = 0;
    public size = 40;
    public setting_list?: DataSetting;
    public upsert_setting: UpserSetting = new UpserSetting();

    public settingIndex = 0

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(private shiftRepo: ShiftRepository, public _setting_service: SettingService,
        private dlg: DialogService, private _snackBar: MatSnackBar) {

        // this.setting_list?.content = s
        this.findSettingAll()
    }

    findSettingAll() {
        this._setting_service.getAllSetting(this.shiftRepo.onBranch, this.shiftRepo.onSubBranch, this.size, this.page)
            .subscribe(res => {
                console.log(res);
                this.setting_list = res.data
                this.setting_index = 0
            })
    }

    get settings(): Setting[] {
        return this.setting_list?.content ?? []
    }

    get setting(): Setting | undefined {
        return this.setting_list?.content.at(this.settingIndex)
    }

    get setting_length(): number {
        return this.setting_list?.content.length ?? 0
    }

    set setting_index(idx: number) {
        this.settingIndex = idx

        this.upsert_setting.id = this.setting?.id ?? null
        this.upsert_setting.headerTitle = this.setting?.headerTitle ?? ''
        this.upsert_setting.description = this.setting?.description ?? ''
        this.upsert_setting.phone = this.setting?.phone ?? ''
        this.upsert_setting.headerAddress1 = this.setting?.headerAddress1 ?? ''
        this.upsert_setting.headerAddress2 = this.setting?.headerAddress2 ?? ''
        this.upsert_setting.other = this.setting?.other ?? ''
        this.upsert_setting.paperSize = this.setting?.paperSize ?? ''
        this.upsert_setting.widthSize = this.setting?.widthSize ?? ''
        this.upsert_setting.fontSize = this.setting?.fontSize ?? ''
        this.upsert_setting.image = this.setting?.image ?? ''
    }

    new_setting() {
        this.upsert_setting = new UpserSetting();
    }


    save(is_new: boolean) {
        if (is_new) {
            this.save_setting()
        } else {
            this.update_setting()
        }
    }

    set_prepare_value(): UpserSetting {
        let up: UpserSetting = new UpserSetting();
        up.branchId = this.shiftRepo.onBranch
        up.subBranchId = this.shiftRepo.onSubBranch
        up.id = this.upsert_setting.id
        up.headerTitle = this.upsert_setting.headerTitle
        up.description = this.upsert_setting.description
        up.phone = this.upsert_setting.phone
        up.headerAddress1 = this.upsert_setting.headerAddress1
        up.headerAddress2 = this.upsert_setting.headerAddress2
        up.other = this.upsert_setting.other
        up.image = this.upsert_setting.image
        up.paperSize = this.upsert_setting.paperSize.toString()
        up.widthSize = this.upsert_setting.widthSize.toString()
        up.fontSize = this.upsert_setting.fontSize.toString()
        return up;
    }

    save_setting() {
        this._setting_service.createSetting(this.set_prepare_value())
            .subscribe(res => {
                console.log(res);
                if (_.isEqual(res.statusCode, 0)) {
                    this.dlg.showSWEDialog('Berhasil!', `Penyimpanan setting berhasil`, 'success')
                    this.findSettingAll()
                }
            }, (err: HttpErrorResponse) => {
                if (err.error.statusCode == 413) {
                    this.dlg.showSWEDialog('Opps!', `Ukuran gambar terlalu besar`, 'error')
                } else {
                    this.dlg.showSWEDialog('Opps!', `Penyimpanan setting gagal`, 'error')
                }

            })
    }

    update_setting() {
        this._setting_service.updateSetting(this.set_prepare_value())
            .subscribe(res => {
                console.log(res);
                if (_.isEqual(res.statusCode, 0)) {
                    this.dlg.showSWEDialog('Berhasil!', `Pembaharuan setting berhasil`, 'success')
                    this.findSettingAll()
                }
            }, (err: HttpErrorResponse) => {
                if (err.error.statusCode == 413) {
                    this.dlg.showSWEDialog('Opps!', `Ukuran gambar terlalu besar`, 'error')
                } else {
                    this.dlg.showSWEDialog('Opps!', `Penyimpanan setting gagal`, 'error')
                }
            })
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

}