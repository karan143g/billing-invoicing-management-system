export interface InvoiceItem {
  productId: number;
  productName: string;
  qty: number;
  rate: number;
  gstPercent: number;
  amount: number;
  gstAmount: number;
  total: number;
}

export interface Invoice {
  customerId: number;
  invoiceDate: Date;
  items: InvoiceItem[];
  subTotal: number;
  gstTotal: number;
  grandTotal: number;
}

export interface InvoiceSaveResponse {
  invoiceId: number;
  invoiceNo: string;
}


export interface InvoiceHeader {
  invoiceId: number;
  invoiceNo: string;
  invoiceDate: string;
  customerName: string;
  mobile: string;
  email?: string;
  address?: string;
  subTotal: number;
  gstTotal: number;
  grandTotal: number;
}


export interface InvoiceViewModel {
  header: InvoiceHeader;
  items: InvoiceItem[];
}
