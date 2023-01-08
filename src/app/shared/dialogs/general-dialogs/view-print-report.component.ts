import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExpenseReport, OtherIncome, ReportShiftSales, SoldItem } from 'src/app/main/pages/report/_model/report.model';
import { Setting } from 'src/app/main/_model/setting/setting.model';
import { ShiftRepository } from 'src/app/main/_model/shift/shift.repository';
import { SettingService } from 'src/app/main/_service/settings.service';
import { TimeUtil } from 'src/app/_utility/time.util';

@Component({
    selector: 'view-print-report',
    template: `
        <h1 mat-dialog-title class="text-center">
        <mat-icon svgIcon="print"></mat-icon>
        </h1>
        <div mat-dialog-content>
        <div class="printContainer" [style.width]="settingPrint?.paperSize ?? '77mm'">
            <div
            class="receipt"
            [style.width]="settingPrint?.widthSize ?? '70mm'"
            [style.font-size]="settingPrint?.fontSize ?? '5mm'"
            >
            <div #areaprint class="print-area">
                <div style="text-align: center">
                <img class="logo" [src]="getImage" class="imageStyle" />
                </div>

                <div id="printDiv" class="title center" style="text-align: center">
                <span>{{ settingPrint?.headerTitle }}</span>
                <br />
                <span>{{ settingPrint?.headerAddress1 }}</span>
                <br />
                <span>{{ settingPrint?.headerAddress2 }}</span>
                <br />
                <span>{{ settingPrint?.phone }}</span>
                <br />
                </div>
                <hr />
                <table style="width: 100%">
                <thead>
                    <tr>
                    <th class="description" style="text-align: left !important">Kasir.</th>
                    <th class="price" style="text-align: right !important">{{ shiftRepo.shift?.name }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr valign="top">
                    <td class="description">Kas Kasir</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(reportSales?.startCash ?? 0) }}
                    </td>
                    </tr>
                    <tr valign="top">
                    <td class="description">Kas Sebenarnya</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(reportSales?.endOperationalCash ?? 0) }}
                    </td>
                    </tr>
                    <tr valign="top">
                    <td class="description">Total Terjual</td>
                    <td class="price" style="text-align: right !important">
                        {{ reportSales?.totalOrder ?? 0 }}
                    </td>
                    </tr>
                </tbody>
                </table>
                <hr *ngIf="(reportSales?.customPaymentList)!.length > 0" />
                <table *ngIf="(reportSales?.customPaymentList)!.length > 0" style="width: 100%">
                <thead>
                    <tr>
                    <th class="description" style="text-align: left !important">Pembayaran.</th>
                    <th class="price" style="text-align: right !important"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr valign="top">
                    <td class="description">Tunai</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(reportSales?.cashPayment ?? 0) }}
                    </td>
                    </tr>
                    <tr valign="top" *ngFor="let py of reportSales?.customPaymentList">
                    <td class="description">{{ py.name }}</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(py?.amount ?? 0) }}
                    </td>
                    </tr>
                </tbody>
                </table>
                <hr *ngIf="reportSales?.debt !== undefined" />
                <table *ngIf="reportSales?.debt !== undefined" style="width: 100%">
                <thead>
                    <tr>
                    <th class="description" style="text-align: left !important">Hutang.</th>
                    <th class="price" style="text-align: right !important"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr valign="top">
                    <td class="description">Pelanggan</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(reportSales?.debt?.customerDebt ?? 0) }}
                    </td>
                    </tr>
                    <tr valign="top">
                    <td class="description">Karyawan</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(reportSales?.debt?.employeeFoodDebt ?? 0) }}
                    </td>
                    </tr>
                </tbody>
                </table>

                <hr *ngIf="(reportSales?.otherIncome)!.length > 0" />
                <table style="width: 100%" *ngIf="(reportSales?.otherIncome)!.length > 0">
                <thead>
                    <tr valign="top" style="text-align: left !important">
                    <th class="quantity">M</th>
                    <th class="description">Deskripsi</th>
                    <th class="price" style="text-align: right !important">Rp</th>
                    </tr>
                </thead>
                <tbody>
                    <tr valign="top" *ngFor="let it of reportSales?.otherIncome">
                    <td class="quantity">{{ it.method }}</td>
                    <td class="description">{{ it.note }}</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(it.amount) }}
                    </td>
                    </tr>
                </tbody>
                </table>

                <hr *ngIf="(reportSales?.expense)!.length > 0" />
                <table *ngIf="(reportSales?.expense)!.length > 0" style="width: 100%">
                <thead>
                    <tr>
                    <th class="description" style="text-align: left !important">Pengeluaran</th>
                    <th class="price" style="text-align: right !important">Rp</th>
                    </tr>
                </thead>
                <tbody>
                    <tr valign="top" *ngFor="let ex of reportSales?.expense">
                    <td class="description">{{ ex.note }}</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(ex?.amount ?? 0) }}
                    </td>
                    </tr>
                </tbody>
                </table>

                <hr *ngIf="(reportSales?.soldItems)!.length > 0" />
                <table style="width: 100%" *ngIf="(reportSales?.soldItems)!.length > 0">
                <thead>
                    <tr valign="top" style="text-align: left !important">
                    <th class="quantity">Q</th>
                    <th class="description">Deskripsi</th>
                    <th class="price" style="text-align: right !important">Rp</th>
                    </tr>
                </thead>
                <tbody>
                    <tr valign="top" *ngFor="let it of reportSales?.soldItems">
                    <td class="quantity">{{ it.amount }}</td>
                    <td class="description">{{ it.name }}</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(it.total) }}
                    </td>
                    </tr>
                </tbody>
                </table>

                <hr *ngIf="(reportSales?.soldItems)!.length > 0" />
                <table style="width: 100%" *ngIf="(reportSales?.soldItems)!.length > 0">
                <thead *ngIf="show">
                    <tr>
                    <th class="description" style="text-align: left !important">Total.</th>
                    <th class="price" style="text-align: right !important">
                        {{ getAllItemTotal(reportSales?.soldItems ?? []) }}
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr valign="top">
                    <td class="description">Diskon</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(reportSales?.totalDiscount ?? 0) }}
                    </td>
                    </tr>
                    <tr valign="top">
                    <td class="description">Service</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(reportSales?.totalService ?? 0) }}
                    </td>
                    </tr>
                    <tr valign="top">
                    <td class="description">Refund</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(reportSales?.totalRefund ?? 0) }}
                    </td>
                    </tr>
                    <tr valign="top">
                    <td class="description">Pajak</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(reportSales?.tax?.totalCountedTax ?? 0) }}
                    </td>
                    </tr>
                    <tr valign="top">
                    <td class="description">Non Pajak</td>
                    <td class="price" style="text-align: right !important">
                        {{ convertCurrency(reportSales?.tax?.totalNotCountedTax ?? 0) }}
                    </td>
                    </tr>
                </tbody>
                </table>

                <hr />

                <table *ngIf="show" style="width: 100%">
                <thead>
                    <tr>
                    <th class="description" style="text-align: left !important">G.Total.</th>
                    <th class="price" style="text-align: right !important">
                        {{ convertCurrency(getGrandTotal()) }}
                    </th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                    <th class="description" style="text-align: left !important">T.Pengeluaran</th>
                    <th class="price" style="text-align: right !important">
                        {{ getGrandExpense() }}
                    </th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                    <th class="description" style="text-align: left !important">Pendapatan Lainnya</th>
                    <th class="price" style="text-align: right !important">
                        {{ getGrandOtherIncome() }}
                    </th>
                    </tr>
                </thead>
                </table>

                <hr />
                <div id="printDiv" class="title center" style="text-align: center">
                <span>Laporan Shift</span>
                </div>
                <hr />
            </div>
            </div>
        </div>
        </div>

        <div mat-dialog-actions class="justify-content-center">
            <button class="btn-exit" mat-button (click)="onNoClick()">Tutup</button>
            <button class="btn-print" mat-button (click)="printNow()">Print</button>
        </div>
    `,
    styleUrls: ['./../dialog-style/print-style.component.css']
})

export class ViewPrintReportComponent implements OnInit, AfterViewChecked {

    reportSales!: ReportShiftSales | undefined;
    settingPrint!: Setting | undefined;

    getImage: string | ArrayBuffer | null = '';
    paperSize = '';
    widthSize = '';
    fontSize = '';

    totalAll = 0;
    gTotal = 0;

    show = false;

    @ViewChild('areaprint') areaprint!: ElementRef<HTMLDivElement>;

    constructor(public dialogRef: MatDialogRef<ViewPrintReportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ReportShiftSales,
        private http: HttpClient,
        private _setting: SettingService,
        private cdref: ChangeDetectorRef,
        public shiftRepo: ShiftRepository,
        private time: TimeUtil
    ) {
        this.reportSales = data;
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

    getAllItemTotal(val: SoldItem[]) {
        let sub = val.reduce((a, b) => +a + +b.total, 0);
        this.totalAll = sub;
        this.getGrandTotal();
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(sub);
    }

    getGrandTotal() {
        let calc = this.totalAll - (this.reportSales?.totalDiscount ?? 0) - (this.reportSales?.totalRefund ?? 0);
        let total =
            calc +
            (this.reportSales?.totalService ?? 0) +
            (this.reportSales?.tax.totalCountedTax ?? 0) +
            (this.reportSales?.tax.totalNotCountedTax ?? 0);
        return total;
    }

    getGrandExpense() {
        let re: ExpenseReport[] = this.reportSales?.expense ?? [];
        let sub = re.reduce((a, b) => +a + +b.amount, 0);
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(sub);
    }

    getGrandOtherIncome() {
        let re: OtherIncome[] = this.reportSales?.otherIncome ?? [];
        let sub = re.reduce((a, b) => +a + +b.amount, 0);
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(sub);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


}