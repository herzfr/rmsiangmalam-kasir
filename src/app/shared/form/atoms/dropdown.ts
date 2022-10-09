import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'dropdown',
    template: `
     <div [formGroup]="form">
        <mat-form-field appearance="outline">
            <mat-label>{{ field.label }}</mat-label>
            <mat-select  [id]="field.name" [formControlName]="field.name">
                <mat-option *ngFor="let opt of field.option" [value]="opt.key">
                    {{ opt.label }}
                </mat-option>
            </mat-select>
        </mat-form-field>

      </div> 
  `,
})
export class DropDownComponent {
    @Input() field: any = {};
    @Input() form: FormGroup = new FormGroup({});

    hide: boolean = true;

    get isValid() {
        return this.form.controls[this.field.name].valid;
    }
    get isDirty() {
        return this.form.controls[this.field.name].dirty;
    }

    constructor() { }
}
