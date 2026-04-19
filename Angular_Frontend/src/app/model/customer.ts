export interface Customer {
  customerId: number;
  customerName: string;
  mobile: string;
  email?: string;
  address?: string;
  isActive: boolean;
}
