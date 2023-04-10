import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductPackage } from 'src/app/main/pages/order/_model/menu.model';
import { ReportSales, ReportShiftSales } from 'src/app/main/pages/report/_model/report.model';
import { FormDialog, FormDialogComponent } from './form-dialogs/form-dynamic.component';
import { CropImageComponent } from './general-dialogs/crop-image-dialog.component';
import { InfoAnimatedDialog, InfoAnimatedDialogComponent } from './general-dialogs/info-animation-dialog.component';
import { InfoDialog, InfoDialogComponent } from './general-dialogs/info-dialog.component';
import { InputDialog, InputDialogComponent } from './general-dialogs/input-dialog.component';
import { StockListComponent } from './general-dialogs/stock-list.component';
import { StopShiftComponent } from './general-dialogs/stop-shift-form.component';
import { VerifyDialog, VerifyDialogComponent } from './general-dialogs/verification-dialog.component';
import { ViewPrintReceiptComponent } from './general-dialogs/view-print-receipt.component';
import { ViewPrintReportComponent } from './general-dialogs/view-print-report.component';
import { WebCamComponent, WebcamDialog } from './general-dialogs/webcam.component';

@Injectable()
export class DialogService {
    constructor(private dialog: MatDialog) { }

    showInfoDialog(title: string, subtitle: string, message: string, icon: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { title: title, subtitle: subtitle, message: message, icon: icon } as InfoDialog;
        dialogConfig.backdropClass = 'backdropBackground';
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '400px';
        dialogConfig.panelClass = 'panel-dialog-x';

        const dialogCustom = this.dialog.open(
            InfoDialogComponent,
            dialogConfig
        );
        
        return dialogCustom.afterClosed();
    }

    showSWEDialog(title: string, message: string, type: 'success' | 'warning' | 'error') {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { title: title, message: message, type: type } as InfoAnimatedDialog;
        dialogConfig.backdropClass = 'backdropBackground';
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '400px';
        dialogConfig.panelClass = 'panel-dialog-x';

        const dialogCustom = this.dialog.open(
            InfoAnimatedDialogComponent,
            dialogConfig
        );
        return dialogCustom.afterClosed();
    }

    showConfirmationDialog(title: string, subtitle: string, message: string, icon: string, confirm: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { title: title, message: message, icon: icon, confirm: confirm } as VerifyDialog;
        dialogConfig.backdropClass = 'backdropBackground';
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '400px';
        dialogConfig.panelClass = 'panel-dialog-x';

        const dialogCustom = this.dialog.open(
            VerifyDialogComponent,
            dialogConfig
        );
        return dialogCustom.afterClosed();
    }

    showFormDialog(title: string, subtitle: string, fields: any, confirm: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { title: title, subtitle: subtitle, fields: fields, confirm: confirm } as FormDialog;
        dialogConfig.backdropClass = 'backdropBackground';
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '600px';
        dialogConfig.panelClass = 'panel-dialog-x';

        const dialogCustom = this.dialog.open(
            FormDialogComponent,
            dialogConfig
        );
        return dialogCustom.afterClosed();
    }

    showInputDialog(title: string, subtitle: string, message: string, icon: string, confirm: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { title: title, message: message, icon: icon, confirm: confirm } as InputDialog;
        dialogConfig.backdropClass = 'backdropBackground';
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '400px';
        dialogConfig.panelClass = 'panel-dialog-x';

        const dialogCustom = this.dialog.open(
            InputDialogComponent,
            dialogConfig
        );
        return dialogCustom.afterClosed();
    }

    showWebcam(title: string, message: string, icon: string, confirm: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { title: title, message: message, icon: icon, confirm: confirm } as WebcamDialog;
        dialogConfig.backdropClass = 'backdropBackground';
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '400px';
        dialogConfig.panelClass = 'panel-dialog-x';

        const dialogCustom = this.dialog.open(
            WebCamComponent,
            dialogConfig
        );
        return dialogCustom.afterClosed();
    }

    showStockList(dataproduct: ProductPackage[]) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = dataproduct
        dialogConfig.backdropClass = 'backdropBackground';
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '400px';
        dialogConfig.panelClass = 'panel-dialog-x';

        const dialogCustom = this.dialog.open(
            StockListComponent,
            dialogConfig
        );
        return dialogCustom.afterClosed();
    }


    showCropImage(file: File) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.backdropClass = 'backdropBackground';
        dialogConfig.data = file;
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '400px';
        dialogConfig.panelClass = 'panel-dialog-x';

        const dialogCustom = this.dialog.open(
            CropImageComponent,
            dialogConfig
        );
        return dialogCustom.afterClosed();
    }

    showEndShiftDialog(title: string, subtitle: string, message: string, icon: string, confirm: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { title: title, message: message, icon: icon, confirm: confirm } as InputDialog;
        dialogConfig.backdropClass = 'backdropBackground';
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '400px';
        dialogConfig.panelClass = 'panel-dialog-x';

        const dialogCustom = this.dialog.open(
            StopShiftComponent,
            dialogConfig
        );
        return dialogCustom.afterClosed();
    }

    showViewPrint(dataReport: ReportShiftSales) {
        const dialogRef = this.dialog.open(ViewPrintReportComponent, {
            width: 'auto',
            disableClose: true,
            data: dataReport,
        });

        return dialogRef.afterClosed()
    }

    showViewReceipt(dataReport: ReportSales) {
        const dialogRef = this.dialog.open(ViewPrintReceiptComponent, {
            width: 'auto',
            disableClose: true,
            data: dataReport,
        });

        return dialogRef.afterClosed()
    }



}