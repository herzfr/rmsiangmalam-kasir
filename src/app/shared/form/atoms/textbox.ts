import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'textbox',
    template: `
    <div [formGroup]="form">

    <div [ngSwitch]="field.type">
        <div *ngSwitchCase="'password'">
            <mat-form-field appearance="outline">
                <mat-label>{{ field.label }}  <strong class="text-danger" *ngIf="field.required">*</strong></mat-label>
                <input matInput *ngIf="!field.multiline" [type]="hide ? 'password' : 'text'" placeholder="{{ field.placeholder }}" [attr.type]="field.type" [id]="field.name" [formControlName]="field.name">
                <button type="button" mat-icon-button matSuffix (click)="hide = !hide" 
                    [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hide" >
                    <mat-icon>{{hide ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
            </mat-form-field>
        </div>
        <div *ngSwitchCase="'currency'">
            <mat-form-field appearance="outline">
                <mat-label>{{ field.label }}  <strong class="text-danger" *ngIf="field.required">*</strong></mat-label>
                <input [high]="100000000" [low]="100" currencyMask [options]="{ prefix: 'Rp ', thousands: '.', decimal: ',', precision: 0 }" matInput *ngIf="!field.multiline" placeholder="{{ field.placeholder }}" [attr.type]="field.type" [id]="field.name" [formControlName]="field.name">
                <mat-icon *ngIf="field.icon !== undefined" [svgIcon]="field.icon" matSuffix></mat-icon>
            </mat-form-field>
        </div>
        <div *ngSwitchDefault>
            <mat-form-field appearance="outline">
                <mat-label>{{ field.label }}  <strong class="text-danger" *ngIf="field.required">*</strong></mat-label>
                <input matInput *ngIf="!field.multiline" placeholder="{{ field.placeholder }}" [attr.type]="field.type" [id]="field.name" [formControlName]="field.name">
                <mat-icon style="margin-left: 10px !important;" *ngIf="field.icon !== undefined"  [svgIcon]="field.icon" matSuffix></mat-icon>
            </mat-form-field>
        </div>
    </div>
      <textarea
        *ngIf="field.multiline"
        [class.is-invalid]="isDirty && !isValid"
        [formControlName]="field.name"
        [id]="field.name"
        rows="9"
        class="form-control"
        [placeholder]="field.placeholder"
      ></textarea>
    </div>
  `,
})
export class TextBoxComponent {
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
