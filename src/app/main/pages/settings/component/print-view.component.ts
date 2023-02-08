import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
    @ViewChild('areaprint') areaprint!: ElementRef<HTMLDivElement>;
    constructor(public settingRepo: SettingRepository, public timeUtil: TimeUtil) {
        this.today = timeUtil.convertDateTimeLocale(new Date())
        // console.log(this.today);

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
                width: ${this.settingRepo.setting?.paperSize};
                height: auto;
                border: initial;
                border-radius: initial;
                // width: initial;
                min-height: initial;
                box-shadow: initial;
                background: initial;
                page-break-after: always; 
              }
             
              // body.receipt .sheet { width:  ${this.settingRepo.setting?.widthSize}; height: auto }
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
                  width:  ${this.settingRepo.setting?.paperSize};
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
                //    width:  ${this.settingRepo.setting?.paperSize}
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
}