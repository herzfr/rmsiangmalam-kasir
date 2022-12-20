import { Pageable } from "src/app/_model/general.model"

export interface DataProduct {
    content: Product[]
    pageable: Pageable
}

export interface Product {
    id: string
    active: boolean
    branchId: number
    branchName: string
    productId: number
    name: string
    description: string
    size: string
    unit: string
    pic: string
    quantity: number
    stockId: number
    prices: Price[]
}

export interface Price {
    price: number
    priceCategory: string
}

export interface DataPackage {
    content: Package[]
    pageable: Pageable
}

export interface Package {
    id: string
    active: boolean
    name: string
    packageId: number
    description: string
    pic: string
    prices: Price[]
    products: ProductPackage[]
    stockIds: number[]
}

export interface ProductPackage {
    name: string
    quantity: number
}

export interface ProductCategory {
    id: number
    name: string
    description: string
    picPath: string
    pic: string
}

export interface DataShortcut {
    content: Shortcut[]
    pageable: Pageable
}

export interface Shortcut {
    id: string
    active: boolean
    branchId: number
    branchName: string
    productId?: number
    name: string
    description: string
    size?: string
    unit?: string
    pic?: string
    quantity?: number
    stockId?: number
    prices: Price[]
    position: number
    packageId?: number
    shorcutId?: number
}
