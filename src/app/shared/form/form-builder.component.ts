import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'form-apps',
  template: `
    <form
      (ngSubmit)="onSubmit.emit(this.form.value)"
      [formGroup]="form"
      class="form-horizontal px-5 py-2"
    >
      <div *ngFor="let field of fields">
        <field-builder [field]="field" [form]="form"></field-builder>
      </div>
      <div class="form-group row px-5">
        <!-- <button type="submit" [disabled]="!form.valid" class="btn btn-primary">Save</button> -->
        <button [disabled]="!form.valid" class="btn-submit" mat-button>
            <div class="d-flex align-items-center justify-content-center">
                {{ isLoading? 'Memuat...' : confirm}}
                <ng-container *ngIf="isLoading">
                    <mat-spinner [diameter]="20"></mat-spinner>
                </ng-container>
            </div>
        </button>
      </div>
      <!-- <div class="form-group row">
        <div class="col-md-3"></div>
        <div class="col-md-9">
          <button
            type="submit"
            [disabled]="!form.valid"
            class="btn btn-primary"
          >
            Save
          </button>
          <strong>Saved all values</strong>
        </div>
      </div> -->
    </form>
  `,
})
export class DynamicFormComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Input() fields: any[] = [];
  @Input() isLoading?: boolean;
  @Input() submitName?: string;
  @Input() confirm?: string;
  form: FormGroup = new FormGroup({});

  constructor() {
    // console.log(this.fields);
    // console.log(this.form);
  }

  ngOnInit() {
    let fieldsCtrls: any = {};
    for (let f of this.fields) {
      if (f.type != 'checkbox') {
        fieldsCtrls[f.name] = new FormControl(
          f.value,
          Validators.required
        );
      } else {
        let opts: any = {};
        for (let opt of f.options) {
          opts[opt.key] = new FormControl(opt.value);
        }
        fieldsCtrls[f.name] = new FormGroup(opts);
      }
    }
    this.form = new FormGroup(fieldsCtrls);
  }
}
