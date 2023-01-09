import { Pageable } from "src/app/_model/general.model";


export class GetReportSales {
    size: number = 10;
    page: number = 0;
    branchId: number | null = null
    subBranchId: number | null = null
    search: string = ''
    status: 'PAID' | 'DEBT' = 'PAID'; // 'type:number. status data checkout (PAID & DEBT)',
    option: 'name' | 'customer' | 'cashier' = 'name';
    // 'type:string. opsi pencarian data (name, customer, cashier). 
    // name (berdasarkan sale name), customer (berdasarkan nama customerName), cashier (berdasarkan username cashierName) ', 
    startDate: number = 0;
    endDate: number = 0;
}

export interface RespReportSales {
    content: ReportSales[];
    pageable: Pageable;
}

export interface ReportSales {
    id: number;
    name: string;
    branchId: number;
    subBranchId: number;
    note: string;
    customerId?: number;
    customerName?: string;
    waiterName?: string;
    waiterUserName?: string;
    cashierName: string;
    cashierUserName: string;
    subTotal: number;
    discount: number;
    tax: number;
    service: number;
    deposit: number;
    refund: any;
    total: number;
    isDineIn: boolean;
    status: string;
    paymentMethod: string;
    paymentTypeId: any;
    cash: number;
    change: number;
    createdAt: number;
    updatedAt: number;
    createdBy: string;
    updatedBy: any;
    tempSalesId: number;
    shiftId: number;
    imageProof: any;
    cardNo: any;
    merchantId: any;
    transactionNo: any;
    cardName: any;
    batchNo: any;
    adminFee: number;
    items: ItemReportSales[];
}

export interface ItemReportSales {
    menuId: string;
    name: string;
    amount: number;
    unitPrice: number;
    unit: string;
    isPackage: boolean;
    totalPrice: number;
    pic: string;
    priceCat: string;
}

export interface ReportShiftSales {
    totalOrder: number;
    startCash: number;
    endOperationalCash: number;
    cashPayment: number;
    customPaymentList: CustomPaymentList[];
    totalDiscount: number;
    totalDeposit: number;
    totalService: number;
    totalRefund: number;
    tax: Tax;
    debt: Debt;
    soldItems: SoldItem[];
    otherIncome: OtherIncome[];
    expense: ExpenseReport[];
}

export interface CustomPaymentList {
    name: string;
    amount: number;
}

export interface Tax {
    totalCountedTax: number;
    totalNotCountedTax: number;
}

export interface Debt {
    customerDebt: number;
    employeeFoodDebt: number;
}

export interface ExpenseReport {
    note: string;
    amount: number;
}

export interface OtherIncome {
    note: string;
    amount: number;
    method: string;
}

export interface SoldItem {
    menuId: string;
    name: string;
    amount: number;
    total: number;
}