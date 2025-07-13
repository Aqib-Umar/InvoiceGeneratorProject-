import { InvoiceItem } from '../types/invoice';

export const calculateItemAmount = (quantity: number, rate: number): number => {
  return quantity * rate;
};

export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.amount, 0);
};

export const calculateTaxAmount = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + calculateItemTax(item), 0);
};
export const calculateItemTax = (item: InvoiceItem): number => {
  const itemAmount = item.quantity * item.rate;
  return (itemAmount * item.taxRate) / 100;
};

export const calculateTotal = (subtotal: number, taxAmount: number): number => {
  return subtotal + taxAmount;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PKR',
  }).format(amount);
};

export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}-${random}`;
};

// Pakistan tax rates for different product categories
export const PAKISTAN_TAX_RATES: Record<string, number> = {
  // Food items - 0% GST
  'milk': 0,
  'bread': 0,
  'rice': 0,
  'wheat': 0,
  'sugar': 0,
  'tea': 0,
  'coffee': 0,
  'flour': 0,
  'oil': 0,
  'ghee': 0,
  'butter': 0,
  'cheese': 0,
  'yogurt': 0,
  'eggs': 0,
  'chicken': 0,
  'beef': 0,
  'mutton': 0,
  'fish': 0,
  'vegetables': 0,
  'fruits': 0,
  'spices': 0,
  
  // Beverages - 17% GST
  'soft drink': 17,
  'juice': 17,
  'energy drink': 17,
  'water bottle': 17,
  
  // Electronics - 17% GST
  'mobile': 17,
  'laptop': 17,
  'computer': 17,
  'tablet': 17,
  'tv': 17,
  'refrigerator': 17,
  'washing machine': 17,
  'air conditioner': 17,
  'fan': 17,
  'iron': 17,
  'microwave': 17,
  
  // Clothing - 17% GST
  'shirt': 17,
  'pants': 17,
  'dress': 17,
  'shoes': 17,
  'jacket': 17,
  'jeans': 17,
  'suit': 17,
  
  // Services - 17% GST
  'service': 17,
  'consultation': 17,
  'repair': 17,
  'maintenance': 17,
  
  // Luxury items - 17% GST
  'perfume': 17,
  'cosmetics': 17,
  'jewelry': 17,
  'watch': 17,
  
  // Default rate for unlisted items
  'default': 17
};

export const getTaxRateForProduct = (productName: string): number => {
  const normalizedName = productName.toLowerCase().trim();
  
  // Check for exact matches first
  if (PAKISTAN_TAX_RATES[normalizedName] !== undefined) {
    return PAKISTAN_TAX_RATES[normalizedName];
  }
  
  // Check for partial matches
  for (const [key, rate] of Object.entries(PAKISTAN_TAX_RATES)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return rate;
    }
  }
  
  // Return default rate if no match found
  return PAKISTAN_TAX_RATES.default;
};