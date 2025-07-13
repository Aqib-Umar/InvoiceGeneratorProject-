export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  taxRate: number;
  amount: number;
  taxAmount: number;
  measurementUnit?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  companyNTN: string;
  companySTRN: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyCity: string;
  clientName: string;
  clientNTN?: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientCity: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  terms: string;
  cashReceived?: number;
}

export interface Theme {
  isDark: boolean;
}

export type InvoiceFormat = 'standard' | 'receipt';