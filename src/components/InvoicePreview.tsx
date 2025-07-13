import React from 'react';
import { Printer } from 'lucide-react';
import { InvoiceData, InvoiceFormat } from '../types/invoice';
import { formatCurrency } from '../utils/calculations';
import { generateFBRVerificationCode, generateFBRQRData } from '../utils/fbrCompliance';
import BarcodeGenerator from './BarcodeGenerator';
import QRCodeGenerator from './QRCodeGenerator';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  isDark: boolean;
  format: InvoiceFormat;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData, isDark, format }) => {
  // Custom date formatting function
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const month = months[date.getMonth()];
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${month} ${day}, ${year}`;
    } catch {
      return dateString;
    }
  };

  // Print the invoice
  const handlePrint = () => {
    const printContent = document.getElementById('invoice-preview');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Invoice - ${invoiceData.invoiceNumber}</title>
            <style>
              body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
              .print-container { max-width: 1000px; margin: 0 auto; padding: 20px; }
              .print-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .print-logo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
              .print-title { font-size: 24px; font-weight: bold; }
              .print-section { margin-bottom: 15px; }
              .print-table { width: 100%; border-collapse: collapse; }
              .print-table th, .print-table td { padding: 8px; border: 1px solid #ddd; text-align: left; }
              .print-table th { background-color: #f5f5f5; font-weight: bold; }
              .print-totals { width: 300px; margin-left: auto; margin-top: 20px; }
              .print-totals div { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .print-break { page-break-inside: avoid; }
              .print-qr { width: 120px; height: 120px; }
              @media print {
                body { padding: 0.5in; }
                .no-print { display: none; }
                .print-container { padding: 0; }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContent.innerHTML}
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 1000);
              }
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  // Use white background for PDF generation regardless of theme
  const previewBg = 'bg-white';
  const previewText = 'text-gray-900';
  const previewBorder = 'border-gray-200';

  // Generate FBR compliance data
  const fbrData = {
    invoiceNumber: invoiceData.invoiceNumber,
    invoiceDate: invoiceData.invoiceDate,
    companyNTN: invoiceData.companyNTN || '0000000-0',
    companySTRN: invoiceData.companySTRN || '00000000000',
    clientNTN: invoiceData.clientNTN,
    totalAmount: invoiceData.total,
    taxAmount: invoiceData.taxAmount,
    items: invoiceData.items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      taxRate: item.taxRate,
      amount: item.amount,
      measurementUnit: item.measurementUnit
    }))
  };

  const verificationCode = generateFBRVerificationCode(fbrData);
  const qrData = generateFBRQRData(fbrData);
  
  if (format === 'receipt') {
    return (
      <div className={`
        rounded-xl border transition-colors duration-200 overflow-hidden max-w-sm mx-auto lg:max-w-none
        ${isDark ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <div className={`
          p-4 border-b flex justify-between items-center
          ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}
        `}>
          <div>
            <h2 className={`
              text-lg font-semibold
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}>
              Receipt Preview
            </h2>
            <p className={`
              text-sm mt-1
              ${isDark ? 'text-gray-400' : 'text-gray-500'}
            `}>
              FBR Compliant - Optimized for 80mm thermal printers
            </p>
          </div>
          <button
            onClick={handlePrint}
            className={`
              flex items-center space-x-1 px-3 py-1.5 rounded text-sm
              ${isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>

        <div id="invoice-preview" className={`${previewBg} ${previewText} p-4 print:p-2 w-full max-w-[80mm] mx-auto`}>
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <img 
                src="companylogo1.png" 
                alt="Logo" 
                className="w-6 h-6 rounded-full"
              />
              <h1 className="text-lg font-bold text-gray-900">
                {invoiceData.companyName || 'Averon Digital'}
              </h1>
            </div>
            <div className="text-xs text-gray-600 space-y-0.5">
              {invoiceData.companyAddress && <p>{invoiceData.companyAddress}</p>}
              {invoiceData.companyCity && <p>{invoiceData.companyCity}</p>}
              {invoiceData.companyPhone && <p>Tel: {invoiceData.companyPhone}</p>}
              {invoiceData.companyNTN && <p>NTN: {invoiceData.companyNTN}</p>}
              {invoiceData.companySTRN && <p>STRN: {invoiceData.companySTRN}</p>}
            </div>
          </div>

          <div className="border-t border-dashed border-gray-400 my-3"></div>

          {/* Invoice Details */}
          <div className="text-xs text-gray-700 mb-3 space-y-1">
            <div className="flex justify-between">
              <span>Invoice:</span>
              <span className="font-medium">{invoiceData.invoiceNumber || 'INV-001'}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formatDate(invoiceData.invoiceDate) || new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>FBR Code:</span>
              <span className="font-mono text-xs">{verificationCode}</span>
            </div>
            <div className="flex justify-between">
              <span>Table:</span>
              <span>01</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-400 my-3"></div>

          {/* Items */}
          <div className="mb-3">
            {invoiceData.items.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-xs">
                No items added yet
              </div>
            ) : (
              invoiceData.items.map((item, index) => (
                <div key={item.id} className="mb-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-gray-900">
                      {item.description || `Item ${index + 1}`} 
                      {item.measurementUnit && ` (${item.measurementUnit})`}
                    </span>
                    <span className="text-gray-700">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 ml-2">
                    <span>
                      {item.quantity} x {formatCurrency(item.rate)}
                      {item.taxRate > 0 && ` + ${item.taxRate}% GST`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-dashed border-gray-400 my-3"></div>

          {/* Totals */}
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoiceData.subtotal)}</span>
            </div>
            {invoiceData.taxAmount > 0 && (
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatCurrency(invoiceData.taxAmount)}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-1 mt-2">
              <div className="flex justify-between font-bold text-sm">
                <span>Total:</span>
                <span>{formatCurrency(invoiceData.total)}</span>
              </div>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span>Cash Received:</span>
              <span>{formatCurrency(invoiceData.cashReceived || 0)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Change Due:</span>
              <span>{formatCurrency((invoiceData.cashReceived || 0) - (invoiceData.total || 0))}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-400 my-3"></div>

          {/* FBR Compliance Section */}
          <div className="text-center mb-3">
            <div className="mb-2">
              <BarcodeGenerator 
                value={verificationCode} 
                width={1}
                height={30}
                fontSize={8}
                className="mx-auto"
              />
            </div>
            <div className="mb-2">
              <QRCodeGenerator 
                value={qrData} 
                size={60}
                className="mx-auto"
              />
            </div>
            <p className="text-xs text-gray-600">
              FBR Verified Invoice
            </p>
          </div>

          <div className="border-t border-dashed border-gray-400 my-3"></div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-600 space-y-1">
            <p>Thank you for your business!</p>
            <p>Visit us again for quality products and services!</p>
            {invoiceData.companyEmail && (
              <p>{invoiceData.companyEmail}</p>
            )}
            <div className="border-t border-dashed border-gray-400 my-2 pt-2">
              <p className="font-medium">Averon Digital</p>
              <p>Professional Business Solutions</p>
              <p>www.averondigital.pk | +92-XXX-XXXXXXX</p>
              <p className="text-xs text-gray-500 mt-1">
                This is a computer generated invoice
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      rounded-xl border transition-colors duration-200 overflow-hidden w-full
      ${isDark ? 'border-gray-700' : 'border-gray-200'}
    `}>
      <div className={`
        p-4 border-b flex justify-between items-center
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}
      `}>
        <div>
          <h2 className={`
            text-lg font-semibold
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}>
            Invoice Preview
          </h2>
          <p className={`
            text-sm mt-1
            ${isDark ? 'text-gray-400' : 'text-gray-500'}
          `}>
            FBR Compliant - Professional invoice format for business use
          </p>
        </div>
        <button
          onClick={handlePrint}
          className={`
            flex items-center space-x-1 px-3 py-1.5 rounded text-sm
            ${isDark 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>
      </div>

      <div id="invoice-preview" className={`${previewBg} ${previewText} p-4 sm:p-6 print:p-0`}>
        {/* Header - Compact version */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-4 sm:mb-6 print:mb-4 space-y-3 md:space-y-0">
          <div className="w-full md:w-auto">
            <div className="flex items-center space-x-3 mb-3">
              <img 
                src="companylogo1.png" 
                alt="Averon Digital Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-xs sm:text-sm text-gray-600">Averon Digital</p>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p><strong>Invoice #:</strong> {invoiceData.invoiceNumber || 'Not specified'}</p>
              <p><strong>Date:</strong> {formatDate(invoiceData.invoiceDate) || 'Not specified'}</p>
              <p><strong>Due Date:</strong> {formatDate(invoiceData.dueDate) || 'Not specified'}</p>
              <p><strong>FBR Code:</strong> <span className="font-mono text-xs">{verificationCode}</span></p>
            </div>
          </div>
          <div className="text-left md:text-right w-full md:w-auto">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h2 className="text-sm sm:text-base font-bold text-blue-900 mb-1">
                {invoiceData.companyName || 'Averon Digital'}
              </h2>
              <div className="text-xs sm:text-sm text-blue-700 space-y-0.5">
                {invoiceData.companyAddress && <p>{invoiceData.companyAddress}</p>}
                {invoiceData.companyCity && <p>{invoiceData.companyCity}</p>}
                {invoiceData.companyPhone && <p>{invoiceData.companyPhone}</p>}
                {invoiceData.companyEmail && <p>{invoiceData.companyEmail}</p>}
                {invoiceData.companyNTN && <p><strong>NTN:</strong> {invoiceData.companyNTN}</p>}
                {invoiceData.companySTRN && <p><strong>STRN:</strong> {invoiceData.companySTRN}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Bill To - Compact version */}
        <div className="mb-4 sm:mb-6 print:mb-4">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Bill To:</h3>
          <div className={`p-3 rounded-lg border ${previewBorder} bg-gray-50`}>
            <h4 className="font-semibold text-gray-900 mb-1">
              {invoiceData.clientName || 'Client Name'}
            </h4>
            <div className="text-xs sm:text-sm text-gray-600 space-y-0.5">
              {invoiceData.clientAddress && <p>{invoiceData.clientAddress}</p>}
              {invoiceData.clientCity && <p>{invoiceData.clientCity}</p>}
              {invoiceData.clientPhone && <p>{invoiceData.clientPhone}</p>}
              {invoiceData.clientEmail && <p>{invoiceData.clientEmail}</p>}
              {invoiceData.clientNTN && <p><strong>NTN:</strong> {invoiceData.clientNTN}</p>}
            </div>
          </div>
        </div>

        {/* Items Table - Compact version */}
        <div className="mb-4 sm:mb-6 print:mb-4">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[500px] sm:min-w-0 text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left py-2 px-2 font-semibold text-gray-900">Description</th>
                  <th className="text-center py-2 px-1 font-semibold text-gray-900 w-12">Qty</th>
                  <th className="text-right py-2 px-1 font-semibold text-gray-900 w-16">Rate</th>
                  <th className="text-center py-2 px-1 font-semibold text-gray-900 w-12">Tax %</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-900 w-20">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500 text-sm">
                      No items added yet
                    </td>
                  </tr>
                ) : (
                  invoiceData.items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-2 px-2 text-gray-900">
                        {item.description || 'Item description'} 
                        {item.measurementUnit && ` (${item.measurementUnit})`}
                      </td>
                      <td className="py-2 px-1 text-center text-gray-900">{item.quantity || 0}</td>
                      <td className="py-2 px-1 text-right text-gray-900">{formatCurrency(item.rate || 0)}</td>
                      <td className="py-2 px-1 text-center text-gray-900">{item.taxRate || 0}%</td>
                      <td className="py-2 px-2 text-right text-gray-900 font-medium">{formatCurrency(item.amount || 0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals - Compact version */}
        <div className="flex flex-col sm:flex-row justify-end mb-4 sm:mb-6 print:mb-4">
          <div className="w-full sm:w-auto max-w-xs">
            <div className="space-y-1 bg-gray-50 p-3 rounded-lg text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-medium text-gray-900">{formatCurrency(invoiceData.subtotal)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-700">GST/Tax:</span>
                <span className="font-medium text-gray-900">{formatCurrency(invoiceData.taxAmount)}</span>
              </div>
              <div className={`flex justify-between py-2 border-t ${previewBorder}`}>
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-blue-600">{formatCurrency(invoiceData.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information - Compact version */}
        <div className="mb-4 sm:mb-6 print:mb-4">
          <div className="w-full sm:w-auto max-w-xs ml-auto">
            <div className="space-y-1 bg-gray-50 p-3 rounded-lg text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-700">Cash Received:</span>
                <span className="font-medium text-gray-900">{formatCurrency(invoiceData.cashReceived || 0)}</span>
              </div>
              <div className={`flex justify-between py-1 border-t ${previewBorder}`}>
                <span className="font-semibold text-gray-700">Change Due:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency((invoiceData.cashReceived || 0) - (invoiceData.total || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FBR Compliance Section - Compact version */}
        <div className="mb-4 sm:mb-6 print:mb-4 border-t border-gray-200 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">FBR Verification</h4>
              <BarcodeGenerator 
                value={verificationCode} 
                width={1.5}
                height={40}
                fontSize={10}
              />
              <p className="text-xs text-gray-600 mt-1">Code: {verificationCode}</p>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">QR Code</h4>
              <QRCodeGenerator 
                value={qrData} 
                size={80}
              />
              <p className="text-xs text-gray-600 mt-1">Scan for verification</p>
            </div>
          </div>
        </div>

        {/* Notes and Terms - Compact version */}
        {(invoiceData.notes || invoiceData.terms) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-gray-200 text-xs sm:text-sm">
            {invoiceData.notes && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Notes:</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{invoiceData.notes}</p>
              </div>
            )}
            {invoiceData.terms && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Terms & Conditions:</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{invoiceData.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer - Compact version */}
        <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200 text-xs sm:text-sm">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <img 
              src="companylogo1.png" 
              alt="Averon Digital Logo" 
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="text-center">
              <h4 className="font-bold text-gray-900">Averon Digital</h4>
              <p className="text-gray-600">Professional Business Solutions</p>
            </div>
          </div>
          <div className="text-center text-gray-600 space-y-0.5">
            <p>📧 info@averondigital.pk | 📞 +92-XXX-XXXXXXX</p>
            <p>🌐 www.averondigital.pk</p>
            <p className="text-xs text-gray-500 mt-1">
              This is a computer generated FBR compliant invoice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;