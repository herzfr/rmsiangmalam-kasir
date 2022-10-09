import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'field-builder',
  template: `
    <div class="form-group row" [formGroup]="form">

      <div [ngSwitch]="field.type">
        <!-- Textbox -->
        <ng-container *ngSwitchCase="'text'">
          <textbox
            *ngIf="field.visibility"
            [field]="field"
            [form]="form"
          ></textbox>
        </ng-container>

        <ng-container *ngSwitchCase="'tel'">
          <textbox
            *ngIf="field.visibility"
            [field]="field"
            [form]="form"
          ></textbox>
        </ng-container>

        <ng-container *ngSwitchCase="'password'">
          <textbox
            *ngIf="field.visibility"
            [field]="field"
            [form]="form"
          ></textbox>
        </ng-container>

        <ng-container *ngSwitchCase="'currency'">
          <textbox
            *ngIf="field.visibility"
            [field]="field"
            [form]="form"
          ></textbox>
        </ng-container>
        <!-- Textbox -->

        <!-- Dropdown -->
        <ng-container *ngSwitchCase="'dropdown'">
          <dropdown
            *ngIf="field.visibility"
            [field]="field"
            [form]="form"
          ></dropdown>
        </ng-container>
        <!-- Dropdown -->


        <ul class="text-danger list-unstyled my-1">
          <li *validationErrors="form; control: field.name; let err" class="text-start">
            {{ err }}
          </li>
        </ul>
        <!-- <div
          class="alert alert-danger my-1 p-2 fadeInDown animated"
          *ngIf="!isValid && isDirty"
        >
          {{ field.label }} is required
        </div> -->
      </div>
    </div>
  `,
})
export class FieldBuilderComponent implements OnInit {
  @Input() field: any;
  @Input() form: any;

  get isValid() {
    return this.form.controls[this.field.name].valid;
  }
  get isDirty() {
    return this.form.controls[this.field.name].dirty;
  }

  constructor() { }

  ngOnInit() { }
}
