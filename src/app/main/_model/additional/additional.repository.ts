import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { AdditionalService } from "../../_service/additional.service";
import { DataAdditional, FindAdditional } from "./additional.model";


@Injectable()
export class AdditionalRepository {

    public findAdditional: FindAdditional = new FindAdditional()
    public dataAdditional: DataAdditional | undefined;

    addSubs?: Subscription;
    constructor(private additionalService: AdditionalService) {
        this.getAdditional()
    }

    getAdditional() {
        this.addSubs = this.additionalService.getAdditional(this.findAdditional).subscribe(res => {
            this.dataAdditional = res.data;
        })
    }

    get additional() {
        return this.dataAdditional?.content ?? []
    }

    get additionalPagine() {
        return this.dataAdditional?.pageable
    }

    getAdditionalBySearchAndType(search: string, type: string) {
        this.findAdditional.search = search;
        this.findAdditional.type = type;
        this.getAdditional()
    }
}