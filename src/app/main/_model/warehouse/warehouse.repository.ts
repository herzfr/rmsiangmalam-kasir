import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { WarehouseService } from "../../_service/warehouse.service";
import { DataWarehouse, Warehouse } from "./warehouse.model";

@Injectable()
export class WarehouseRepository {

    _data_warehouse: Warehouse[] = [];
    _warehouseSubs?: Subscription;
    constructor(private _warehouseService: WarehouseService) {
        this.fetchWarehouse()
    }

    async fetchWarehouse() {
        this._warehouseSubs = await this._warehouseService.getAllWarehousev2("")
            .subscribe(res => {
                this._data_warehouse = res.data
            })
    }

    get warehouse(): Warehouse[] {
        return this._data_warehouse
    }

    ngOnDestroy() {
        this._warehouseSubs?.unsubscribe()
    }
}