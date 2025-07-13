// FBR (Federal Board of Revenue) Pakistan Compliance Utilities

export interface FBRInvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  companyNTN: string;
  companySTRN: string;
  clientNTN?: string;
  totalAmount: number;
  taxAmount: number;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    taxRate: number;
    amount: number;
    measurementUnit?: string;
  }>;
}

// Generate FBR compliant invoice number
export const generateFBRInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const time = String(date.getTime()).slice(-6); // Last 6 digits of timestamp
  return `FBR-${year}${month}${day}-${time}`;
};

// Generate FBR verification code for barcode
export const generateFBRVerificationCode = (invoiceData: FBRInvoiceData): string => {
  const {
    invoiceNumber,
    invoiceDate,
    companyNTN,
    totalAmount,
    taxAmount
  } = invoiceData;
  
  // Create a verification string based on invoice data
  const verificationString = `${invoiceNumber}|${invoiceDate}|${companyNTN}|${totalAmount.toFixed(2)}|${taxAmount.toFixed(2)}`;
  
  // Simple hash function for verification code (in real implementation, use proper encryption)
  let hash = 0;
  for (let i = 0; i < verificationString.length; i++) {
    const char = verificationString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to positive number and format as FBR code
  const positiveHash = Math.abs(hash);
  return `FBR${positiveHash.toString().slice(0, 8).padStart(8, '0')}`;
};

// Generate QR code data for FBR compliance
export const generateFBRQRData = (invoiceData: FBRInvoiceData): string => {
  const verificationCode = generateFBRVerificationCode(invoiceData);
  
  // FBR QR Code format (simplified version)
  const qrData = {
    seller: invoiceData.companyNTN,
    invoice: invoiceData.invoiceNumber,
    date: invoiceData.invoiceDate,
    total: invoiceData.totalAmount,
    tax: invoiceData.taxAmount,
    verification: verificationCode,
    fbr_portal: "https://iris.fbr.gov.pk"
  };
  
  return JSON.stringify(qrData);
};

// Validate NTN format (Pakistan National Tax Number)
export const validateNTN = (ntn: string): boolean => {
  // NTN format: 7 digits followed by 1 digit (check digit)
  const ntnRegex = /^\d{7}-\d{1}$/;
  return ntnRegex.test(ntn);
};

// Validate STRN format (Sales Tax Registration Number)
export const validateSTRN = (strn: string): boolean => {
  // STRN format: 11 digits
  const strnRegex = /^\d{11}$/;
  return strnRegex.test(strn);
};

// Pakistan GST rates by category (updated for FBR compliance 2024)
export const PAKISTAN_FBR_TAX_RATES: Record<string, number> = {
  // Zero-rated items (0% GST) - Basic unpackaged food
  'milk': 0,
  'bread': 0,
  'rice': 0,
  'wheat': 0,
  'sugar': 0,
  'flour': 0,
  'vegetables': 0,
  'fruits': 0,
  'eggs': 0,
  'chicken': 0,
  'beef': 0,
  'mutton': 0,
  'fish': 0,
  'pulses': 0,
  'lentils': 0,

  // Packaged food items (18% GST)
  'biscuits': 18,
  'candy': 18,
  'chocolate': 18,
  'snacks': 18,
  'canned food': 18,
  'packaged milk': 18,
  'packaged juice': 18,
  'packaged water': 18,
  'bottled sauce': 18,
  'ketchup': 18,
  'mayonnaise': 18,
  'ice cream': 18,
  'yogurt': 18,
  'cheese': 18,
  'butter': 18,
  'cereals': 18,
  'noodles': 18,
  'pasta': 18,

  // Luxury items (25% GST)
  'jewelry': 25,
  'watches': 25,
  'perfumes': 25,
  'designer clothing': 25,
  'luxury cars': 25,
  'yachts': 25,
  'private jets': 25,
  'expensive art': 25,
  'high-end electronics': 25,
  'premium cosmetics': 25,
  'diamonds': 25,
  'gems': 25,
  'gold jewelry': 25,
  'luxury handbags': 25,

  // Standard rate items (17% GST)
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
  'soft drink': 17,
  'shirt': 17,
  'pants': 17,
  'dress': 17,
  'shoes': 17,
  'service': 17,
  'furniture': 17,
  'appliances': 17,
  'building materials': 17,
  
  // Default rate for unlisted items
  'default': 17
};

// Enhanced tax detection with category awareness
export const getFBRTaxRateForProduct = (productName: string): number => {
  if (!productName) return 17;
  
  const normalizedName = productName.toLowerCase().trim();
  
  // First check for luxury items (25%)
  const luxuryKeywords = ['luxury', 'designer', 'premium', 'high-end', 'expensive', 'diamond', 'gold', 'platinum', 'gems'];
  if (luxuryKeywords.some(keyword => normalizedName.includes(keyword))) {
    return 25;
  }
  
  // Check for packaged food indicators (18%)
  const packagedKeywords = ['packaged', 'canned', 'bottled', 'jar', 'tin', 'boxed', 'processed', 'sealed', 'wrapped'];
  if (packagedKeywords.some(keyword => normalizedName.includes(keyword))) {
    return 18;
  }
  
  // Check exact matches
  if (PAKISTAN_FBR_TAX_RATES[normalizedName] !== undefined) {
    return PAKISTAN_FBR_TAX_RATES[normalizedName];
  }
  
  // Check partial matches
  for (const [key, rate] of Object.entries(PAKISTAN_FBR_TAX_RATES)) {
    if (normalizedName.includes(key)) {
      return rate;
    }
  }
  
  return PAKISTAN_FBR_TAX_RATES.default;
};