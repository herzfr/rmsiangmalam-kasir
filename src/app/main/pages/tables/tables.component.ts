import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtil } from 'src/app/_utility/form.util';
import { ShiftRepository } from '../../_model/shift/shift.repository';
import { CreateTable, Table, UpdateTable } from './_model/table.model';
import { TablesRepository } from './_model/tables.repository';

@Component({
    selector: 'tables-app',
    templateUrl: 'tables.component.html',
    styleUrls: ['tables.component.css']
})

export class TablesComponent implements OnInit {

    public isOptUpdate = false;
    public isLoading: boolean = false;

    public createForm: FormGroup = new FormGroup({})
    public updateForm: FormGroup = new FormGroup({})

    public fieldsCreate: any[] = [];
    public fieldsUpdate: any[] = [];

    public unsubcribe: any;
    public unsubcribe2: any;

    constructor(public tablesRepo: TablesRepository, private router: Router, public formUtil: FormUtil, private shiftRepo: ShiftRepository) {
        this.generateFieldCreate()
    }

    ngOnInit() { }

    generateFieldCreate() {
        this.createForm = new FormGroup({})
        this.isOptUpdate = true;
        setTimeout(() => {
            this.fieldsCreate = []
            this.fieldsCreate = [
                this.formUtil.generateObjectForm('name', 'text', 'Nama Meja', 'Cth. Meja 1', 'note_alt', null, true, true, {}),
                this.formUtil.generateObjectForm('description', 'text', 'Deskripsi Meja', 'Meja VVIP', 'description', null, true, true, {}),
                this.formUtil.generateObjectForm('branchId', 'text', '', '', '', this.shiftRepo.onBranch, false, false, {}),
                this.formUtil.generateObjectForm('subBranchId', 'text', '', '', '', this.shiftRepo.onSubBranch, false, false, {}),
            ]
            this.createForm = new FormGroup({
                fields: new FormControl(JSON.stringify(this.fieldsCreate)),
            });
            this.isOptUpdate = false
            this.unsubcribe = this.createForm.valueChanges.subscribe((update) => {
                this.fieldsCreate = JSON.parse(update.fields);
            });
        }, 1)

    }

    generateFieldUpdate(table: Table) {
        this.updateForm = new FormGroup({})
        this.isOptUpdate = false;
        setTimeout(() => {
            this.fieldsUpdate = []
            this.fieldsUpdate = [
                this.formUtil.generateObjectForm('id', 'text', '', '', '', table.id, false, false, {}),
                this.formUtil.generateObjectForm('name', 'text', 'Nama Meja', 'Cth. Meja 1', 'note_alt', table.name, true, true, {}),
                this.formUtil.generateObjectForm('description', 'text', 'Deskripsi Meja', 'Meja VVIP', 'description', table.description, true, true, {}),
                this.formUtil.generateObjectForm('branchId', 'text', '', '', '', this.shiftRepo.onBranch, false, false, {}),
                this.formUtil.generateObjectForm('subBranchId', 'text', '', '', '', this.shiftRepo.onSubBranch, false, false, {}),
                this.formUtil.generateObjectForm('isOccupied', 'text', '', '', '', false, false, false, {}),
            ]
            this.updateForm = new FormGroup({
                fields: new FormControl(JSON.stringify(this.fieldsCreate)),
            });
            this.isOptUpdate = true
            this.unsubcribe2 = this.updateForm.valueChanges.subscribe((update) => {
                this.updateForm = JSON.parse(update.fields);
            });
        }, 1)


    }

    get formFieldCreate() {
        return this.fieldsCreate;
    }

    get formFieldUpdate() {
        return this.fieldsUpdate;
    }

    async onSubmitDataCreate(data: any) {
        this.isLoading = true
        this.tablesRepo.createTable = data as CreateTable
        await this.tablesRepo.createT()
        this.isLoading = false;
        this.generateFieldCreate()
    }

    async onSubmitDataUpdate(data: any) {
        console.log(data);

        this.isLoading = true
        this.tablesRepo.updateTable = data as UpdateTable
        await this.tablesRepo.updateT()
        this.isLoading = false;
        this.generateFieldUpdate(data)
    }

    changeForm() {
        if (this.isOptUpdate) {
            this.isOptUpdate = !this.isOptUpdate
        }
    }


    generateArray(total: number): number[] {
        let ttl = new Array<number>();
        for (let index = 0; index < total; index++) {
            ttl.push(index)
        }
        return ttl;
    }

    back() {
        this.router.navigate(['/'])
    }



    ngDistroy() {
        this.unsubcribe();
        this.unsubcribe2();
    }
}