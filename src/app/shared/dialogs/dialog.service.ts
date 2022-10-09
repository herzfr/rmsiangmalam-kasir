import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormDialog, FormDialogComponent } from './form-dialogs/form-dynamic.component';
import { InfoDialog, InfoDialogComponent } from './general-dialogs/info-dialog.component';
import { VerifyDialog, VerifyDialogComponent } from './general-dialogs/verification-dialog.component';

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

    showFormDialog(title: string, subtitle: string, fields: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { title: title, subtitle: subtitle, fields: fields } as FormDialog;
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


}