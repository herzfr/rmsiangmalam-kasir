
export interface ProductStockInfo {
    id: number
    productId: number
    quantity: number
    warehouseId: number
    updatedAt?: string
    createdAt: string
    product: ProductStock
    warehouse: WarehouseProduct
}

export interface ProductStock {
    id: number
    name: string
    unit: string
}

export interface WarehouseProduct {
    name: string
}
