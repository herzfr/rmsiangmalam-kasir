import { Pageable } from "src/app/_model/general.model"

export interface DataCustomer {
    content: Customer[]
    pageable: Pageable
}

export interface Customer {
    id: number
    name: string
    address1: string
    address2: string
    address3: string
    phone: string
    email?: string
    pic: any
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt?: string
}