export class Checkout {
    tempSalesId: number | null = null;
    name: string = '';
    tableIds: number[] = []
    note: string = ''
    customerId: number | null = null;
    customerName: string | null = null;
    cashierUserName: string | null = null;
    cashierName: string | null = null;
    waiterName: string | null = null;
    waiterUserName: string | null = null;
    subTotal: number = 0;
    discount: number = 0;
    tax: number = 0;
    service: number = 0;
    total: number = 0;
    paymentMethod: string | null = null;
    paymentTypeId: number | null = null;
    cash: number = 0;
    change: number = 0;
    isDineIn: boolean = false;
    status: string = '';
    shiftId: number | null = null;
    isTax: boolean = false;
    deposit: number = 0;
    bookingId: number | null = null;
    transactionNo: string | null = null;
    merchantId: string | null = null;
    cardNo: string | null = null;
    cardName: string | null = null;
    batchNo: string | null = null;
    employeeUserName: string | null = null;
    adminFee: number = 0;
    image?: string | null = null;
}

export interface ResponCheckout {
    id: number
    name: string
    branchId: number
    subBranchId: number
    note: string
    customerId: number
    customerName: string
    cashierName: string
    cashierUserName: string
    waiterName: string
    waiterUserName: string
    subTotal: number
    total: number
    discount: number
    tax: number
    isDineIn: boolean
    status: string
    change: number
    cash: number
    service: number
    items: ItemCheckout[]
  }


  export interface ItemCheckout {
    id: number
    salesId: any
    menuId: string
    name: string
    amount: number
    unitPrice: number
    unit: string
    totalPrice: number
    isPackage: boolean
    createdBy: string
    stockId: string
    pic: string
    priceCat: string
    priceCatId: number
  }