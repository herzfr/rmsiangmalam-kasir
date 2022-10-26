import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { map, Observable } from 'rxjs';
import { Pageable } from 'src/app/_model/general.model';
import { ShiftRepository } from '../../_model/shift/shift.repository';
import { CartLine } from './_model/cart.model';
import { CartRepository } from './_model/cart.repository';
import { DataProduct, Package, Price, Product, Shortcut } from './_model/menu.model';
import { PriceCategory } from './_model/order.model';
import { OrderRepository } from './_model/order.repository';

@Component({
    selector: 'order-apps',
    templateUrl: 'order.component.html',
    styleUrls: ['order.component.css']
})

export class OrderComponent implements OnInit {
    // filter$!: Observable<string | null>;
    selected = '';
    // tableSelected: number | null = null;
    // name = '';
    // note = '';


    customOptions: OwlOptions = {
        loop: false,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        navSpeed: 700,
        navText: ['', ''],
        autoHeight: true,
        autoWidth: true,
        margin: 5,
        items: 4,
        nav: false
    }


    constructor(private location: Location, private route: ActivatedRoute, private shiftRepo: ShiftRepository,
        private router: Router, public order: OrderRepository, public cartRepo: CartRepository) {
        order.getPriceCat().subscribe(res => this.selected = res[0].name)
    }

    async ngOnInit(): Promise<void> {
        // this.tableSelected = this.cartRepo.cart.tableIds[0] ?? null;
        // this.name = this.cartRepo.cart.name ?? "";
        // this.note = this.cartRepo.cart.note ?? "";
    }

    async categoryPrice(): Promise<PriceCategory | undefined> {
        let pc: PriceCategory | undefined;
        await this.order.getPriceCat().subscribe((res) => {
            pc = (res as PriceCategory[]).find(x => x.name == this.selected)
        })
        return pc;
    }




    get activeRoute(): string | null {
        // console.log(this.route.snapshot.queryParamMap.get('nav'));
        return this.route.snapshot.queryParamMap.get('nav');
    }

    back() {
        // this.location.back()
        this.router.navigate(['/'])
    }

    generateArray(total: number): number[] {
        let ttl = new Array<number>();
        for (let index = 0; index < total; index++) {
            ttl.push(index)
        }
        return ttl;
    }


    generatePosition(total: number): number[] {
        let ttl = new Array<number>();
        for (let index = 0; index < total; index++) {
            ttl.push(index)
        }
        return ttl;
    }

    get products() {
        return this.order.productList?.content;
    }

    get pagineProduct(): Pageable {
        return this.order.productList?.pageable as Pageable ?? new Pageable();
    }

    get disablePrevProd() {
        return ((this.pagineProduct.pageNumber ?? 0) === 0)
    }

    get disbaleNextProd() {
        return (this.pagineProduct.pageNumber ?? 0) === (this.pagineProduct.totalPage ?? 0)
    }

    get packages() {
        return this.order.packageList?.content;
    }

    get paginePackage(): Pageable {
        return this.order.packageList?.pageable as Pageable ?? new Pageable();
    }

    get disablePrevPack() {
        return ((this.paginePackage.pageNumber ?? 0) === 0)
    }

    get disbaleNextPack() {
        return (this.paginePackage.totalPage ?? 0) === (this.paginePackage.pageNumber ?? 0)
    }

    get shortcuts() {
        return this.order.shortcutList;
    }

    getShortcut(pos: number): Shortcut | undefined {
        return this.shortcuts.find(x => x.position === pos)
    }

    getPrice(p: Price[]): number {
        return p.find(x => x.priceCategory == this.selected)?.price ?? 0
    }

    // MASIH BELUM BENAR
    nextProd() {
        this.order.searchProduct.page = ((this.pagineProduct.pageNumber ?? 0) + 1)
        this.order.reCheckPackage(this.order.searchProduct)
    }

    prevProd() {
        this.order.searchProduct.page = ((this.pagineProduct.pageNumber ?? 0) - 1)
        this.order.reCheckPackage(this.order.searchProduct)
    }

    nextPack() {
        this.order.searchPackage.page = ((this.paginePackage.pageNumber ?? 0) + 1)
        this.order.reCheckPackage(this.order.searchPackage)
    }

    prevPack() {
        this.order.searchPackage.page = ((this.paginePackage.pageNumber ?? 0) - 1)
        this.order.reCheckPackage(this.order.searchPackage)
    }
    // ===================

    async addProductToCart(prodpack: Product | Package, isPackage: boolean) {
        this.cartRepo.addLineProduct(prodpack, 1, this.selected, await this.categoryPrice(), isPackage);
    }

    save() {
        this.cartRepo.cart.id = 0;
        this.cartRepo.cart.branchId = this.shiftRepo.onBranch;
        this.cartRepo.cart.subBranchId = this.shiftRepo.onSubBranch;
        // if (this.cartRepo.cart.tableIds.length > 0) {
        //     this.cartRepo.cart.tableIds = []
        // }
        // this.cartRepo.cart.tableIds.push(this.tableSelected ?? 0)
        // this.cartRepo.cart.note = this.note
        this.shiftRepo.getShiftObs().subscribe(res => this.cartRepo.cart.shiftId = res.id)
        console.log(this.cartRepo.cartComplete);

    }

    newOrder() {
        this.cartRepo.clear()
    }

    shortcutThis(id: string) {
        this.order.addShortcut(id)
    }

    deleteShortcut(id: string | undefined) {
        if (id) {
            this.order.deleteShortcut(id)
        }
    }

    getPosition(menuId: string) {
        return this.shortcuts.find(x => x.id == menuId)?.position ?? 0
    }




}