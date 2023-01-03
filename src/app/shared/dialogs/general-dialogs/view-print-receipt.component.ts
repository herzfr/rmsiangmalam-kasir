import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportSales } from 'src/app/main/pages/report/_model/report.model';
import { Setting } from 'src/app/main/_model/setting/setting.model';
import { ShiftRepository } from 'src/app/main/_model/shift/shift.repository';
import { SettingService } from 'src/app/main/_service/settings.service';
import { TimeUtil } from 'src/app/_utility/time.util';

@Component({
    selector: 'view-print-receipt',
    templateUrl: './../dialog-component/view-print-receipt.component.html',
    styleUrls: ['./../dialog-style/view-print-receipt.component.css']
})

export class ViewPrintReceiptComponent implements OnInit {
    selectListSales: ReportSales;
    settingPrint!: Setting | undefined;
    paymentType = '';
    isChoose = false;
    getImage: string | ArrayBuffer | null = '';
    paperSize = '';
    widthSize = '';
    fontSize = '';

    totalAll = 0;
    gTotal = 0;

    show = false;

    @ViewChild('areaprint') areaprint!: ElementRef<HTMLDivElement>;
    constructor(
        public dialogRef: MatDialogRef<ViewPrintReceiptComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ReportSales,
        private http: HttpClient,
        private _setting: SettingService,
        private cdref: ChangeDetectorRef,
        public shiftRepo: ShiftRepository,
        private time: TimeUtil
    ) {
        this.selectListSales = data
    }

    ngOnInit() {
        this.get_image()
    }

    ngAfterViewChecked(): void {
        setTimeout(() => {
            this.show = true;
            this.cdref.detectChanges();
        }, 1000);
    }

    get_image() {
        this.http.get('/assets/images/sm_logo_bw.png', { responseType: 'blob' }).subscribe((res) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                let base64data = reader.result;
                // console.log(base64data);
                this.getImage = base64data;
            };

            reader.readAsDataURL(res);
            // console.log(res);
        });
    }

    getSettingPrint() {
        this._setting.getSetting(this.shiftRepo.onBranch, this.shiftRepo.onSubBranch).subscribe((res) => {
            if (res['statusCode'] === 0) {
                this.settingPrint = res['data'];
                this.paperSize = this.settingPrint?.paperSize ?? '77mm';
                this.widthSize = this.settingPrint?.widthSize ?? '70mm';
                this.fontSize = this.settingPrint?.fontSize ?? '5mm';
            }
        });
    }

    convertCurrency(val: number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    }

    getDate(val: number) {
        if (val !== undefined) {
            let dt = new Date(val);
            return this.time.getJustDateLocale(dt)
        } else {
            let dt = new Date();
            return this.time.getJustDateLocale(dt)
        }
    }

    getTime(val: number) {
        if (val !== undefined) {
            let dt = new Date(val);
            return this.time.getJustTimeLocal(dt)
        } else {
            let dt = new Date();
            return this.time.getJustTimeLocal(dt)
        }
    }

    printNow() {
        let printContents, popupWin;
        printContents = this.areaprint.nativeElement.innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin?.document.open();
        popupWin?.document.write(
            `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Testing Out</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css">
            <link rel="stylesheet" href="paper.css">
            <style>
              @page {  
                width: ${this.paperSize};
                height: auto;
                border: initial;
                border-radius: initial;
                // width: initial;
                min-height: initial;
                box-shadow: initial;
                background: initial;
                page-break-after: always; 
              }
             
              // body.receipt .sheet { width:  ${this.widthSize}; height: auto }
              /** Padding area **/
              .sheet.padding-5mm { padding: 5mm }
              .sheet.padding-10mm { padding: 10mm }
              .sheet.padding-15mm { padding: 15mm }
              .sheet.padding-20mm { padding: 20mm }
              .sheet.padding-25mm { padding: 25mm }
              /** For screen preview **/
              @media screen {
                body { background: #e0e0e0 }
                img {
                  width: auto;
                  height: 30mm;
                }
                .img-logo {
                  display: none;
                }
                // .sheet {
                //   background: white;
                //   box-shadow: 0 .5mm 2mm rgba(0,0,0,.3);
                //   margin: 3mm auto;
                // }
              }
              @media print {
                html, body {
                  width:  ${this.paperSize};
                  height: auto;
                  border: initial;
                  border-radius: initial;
                  // width: initial;
                  min-height: initial;
                  box-shadow: initial;
                  background: initial;
                  page-break-after: always;
                  margin: 0mm;
                }
                img {
                  width: auto;
                  height: 30mm;
                }
                // body.receipt {
                //    width:  ${this.paperSize}
                //    margin: 0mm;
                //   //  overflow: hidden;
                //   //  position: relative;
                //   //  box-sizing: border-box;
                //    page-break-after: always;
                // } 
                // .img-logo {
                //   display: none;
                // }
              } 
            </style>
          </head>
          
          <body onload="window.print();window.close()">
            ${printContents}
          </body>
          </html>`
        );
        popupWin?.document.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
