import React from 'react';
import { Plus, User, Shield, Trash2 } from 'lucide-react';
import { InvoiceData, InvoiceItem } from '../types/invoice';
import { generateFBRInvoiceNumber } from '../utils/fbrCompliance';
import ItemRow from './ItemRow';

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  isDark: boolean;
  onUpdate: (data: Partial<InvoiceData>) => void;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: string | number) => void;
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceData,
  isDark,
  onUpdate,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onClearAll,
}) => {
  const inputClasses = `
    w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border transition-colors duration-200
    text-sm sm:text-base
    ${isDark 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
    }
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
  `;

  const textareaClasses = `
    w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-colors duration-200 resize-none
    text-sm sm:text-base
    ${isDark 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
    }
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
  `;

  const sectionClasses = `
    p-4 sm:p-6 rounded-xl border transition-colors duration-200
    ${isDark 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200'
    }
  `;

  const labelClasses = `
    block text-xs sm:text-sm font-medium mb-1 sm:mb-2
    ${isDark ? 'text-gray-300' : 'text-gray-700'}
  `;

  const headingClasses = `
    text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center space-x-2
    ${isDark ? 'text-white' : 'text-gray-900'}
  `;

  const buttonClasses = `
    px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium 
    transition-colors duration-200 flex items-center justify-center
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
  `;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header with Clear Button */}
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Create Invoice
        </h1>
        <button
          onClick={onClearAll}
          className={`
            ${buttonClasses} px-4 py-2 flex items-center space-x-2
            ${isDark 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
            }
          `}
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Invoice Details */}
      <div className={sectionClasses}>
        <h2 className={headingClasses}>
          <span>Invoice Details</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={labelClasses}>Invoice Number</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={invoiceData.invoiceNumber}
                onChange={(e) => onUpdate({ invoiceNumber: e.target.value })}
                placeholder="INV-001"
                className={inputClasses}
              />
              <button
                onClick={() => onUpdate({ invoiceNumber: generateFBRInvoiceNumber() })}
                className={`
                  ${buttonClasses}
                  min-w-[60px] sm:min-w-[70px]
                  ${isDark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                  focus:ring-blue-500 focus:ring-offset-2
                `}
              >
                FBR
              </button>
            </div>
          </div>
          <div>
            <label className={labelClasses}>Invoice Date</label>
            <input
              type="date"
              value={invoiceData.invoiceDate}
              onChange={(e) => onUpdate({ invoiceDate: e.target.value })}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Due Date</label>
            <input
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => onUpdate({ dueDate: e.target.value })}
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className={sectionClasses}>
        <h2 className={headingClasses}>
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          <span>Your Company Details</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          <div className="sm:col-span-2 xl:col-span-1">
            <label className={labelClasses}>Company Name</label>
            <input
              type="text"
              value={invoiceData.companyName}
              onChange={(e) => onUpdate({ companyName: e.target.value })}
              placeholder="Your Company Name"
              className={inputClasses}
              autoComplete="organization"
            />
          </div>
          <div>
            <label className={labelClasses}>Company NTN</label>
            <input
              type="text"
              value={invoiceData.companyNTN}
              onChange={(e) => onUpdate({ companyNTN: e.target.value })}
              placeholder="1234567-8"
              className={inputClasses}
              maxLength={9}
              autoComplete="off"
            />
          </div>
          <div>
            <label className={labelClasses}>Company STRN</label>
            <input
              type="text"
              value={invoiceData.companySTRN}
              onChange={(e) => onUpdate({ companySTRN: e.target.value })}
              placeholder="12345678901"
              className={inputClasses}
              maxLength={11}
              autoComplete="off"
            />
          </div>
          <div>
            <label className={labelClasses}>Email</label>
            <input
              type="email"
              value={invoiceData.companyEmail}
              onChange={(e) => onUpdate({ companyEmail: e.target.value })}
              placeholder="company@example.com"
              className={inputClasses}
              autoComplete="email"
            />
          </div>
          <div>
            <label className={labelClasses}>Phone</label>
            <input
              type="tel"
              value={invoiceData.companyPhone}
              onChange={(e) => onUpdate({ companyPhone: e.target.value })}
              placeholder="+92-XXX-XXXXXXX"
              className={inputClasses}
              autoComplete="tel"
            />
          </div>
          <div>
            <label className={labelClasses}>Address</label>
            <input
              type="text"
              value={invoiceData.companyAddress}
              onChange={(e) => onUpdate({ companyAddress: e.target.value })}
              placeholder="123 Business St, Lahore"
              className={inputClasses}
              autoComplete="street-address"
            />
          </div>
          <div className="sm:col-span-2 xl:col-span-1">
            <label className={labelClasses}>City, State ZIP</label>
            <input
              type="text"
              value={invoiceData.companyCity}
              onChange={(e) => onUpdate({ companyCity: e.target.value })}
              placeholder="Lahore, Punjab 54000"
              className={inputClasses}
              autoComplete="address-level2"
            />
          </div>
        </div>
      </div>

      {/* Client Details */}
      <div className={sectionClasses}>
        <h2 className={headingClasses}>
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Bill To (Client Details)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          <div className="sm:col-span-2 xl:col-span-1">
            <label className={labelClasses}>Client Name</label>
            <input
              type="text"
              value={invoiceData.clientName}
              onChange={(e) => onUpdate({ clientName: e.target.value })}
              placeholder="Client Company Name"
              className={inputClasses}
              autoComplete="organization"
            />
          </div>
          <div>
            <label className={labelClasses}>Client NTN (Optional)</label>
            <input
              type="text"
              value={invoiceData.clientNTN}
              onChange={(e) => onUpdate({ clientNTN: e.target.value })}
              placeholder="1234567-8"
              className={inputClasses}
              maxLength={9}
              autoComplete="off"
            />
          </div>
          <div>
            <label className={labelClasses}>Email</label>
            <input
              type="email"
              value={invoiceData.clientEmail}
              onChange={(e) => onUpdate({ clientEmail: e.target.value })}
              placeholder="client@example.com"
              className={inputClasses}
              autoComplete="email"
            />
          </div>
          <div>
            <label className={labelClasses}>Phone</label>
            <input
              type="tel"
              value={invoiceData.clientPhone}
              onChange={(e) => onUpdate({ clientPhone: e.target.value })}
              placeholder="+92-XXX-XXXXXXX"
              className={inputClasses}
              autoComplete="tel"
            />
          </div>
          <div>
            <label className={labelClasses}>Address</label>
            <input
              type="text"
              value={invoiceData.clientAddress}
              onChange={(e) => onUpdate({ clientAddress: e.target.value })}
              placeholder="456 Client Ave, Karachi"
              className={inputClasses}
              autoComplete="street-address"
            />
          </div>
          <div className="sm:col-span-2 xl:col-span-1">
            <label className={labelClasses}>City, State ZIP</label>
            <input
              type="text"
              value={invoiceData.clientCity}
              onChange={(e) => onUpdate({ clientCity: e.target.value })}
              placeholder="Karachi, Sindh 75000"
              className={inputClasses}
              autoComplete="address-level2"
            />
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className={sectionClasses}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h2 className={headingClasses}>
            <span>Invoice Items</span>
          </h2>
          <button
            onClick={onAddItem}
            className={`
              ${buttonClasses}
              space-x-2
              ${isDark 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
              }
              focus:ring-green-500 focus:ring-offset-2
            `}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Add Item</span>
          </button>
        </div>

        {invoiceData.items.length === 0 ? (
          <div className={`
            text-center py-8 sm:py-12 border-2 border-dashed rounded-lg
            ${isDark 
              ? 'border-gray-600 text-gray-400' 
              : 'border-gray-300 text-gray-500'
            }
          `}>
            <p className="text-base sm:text-lg font-medium mb-2">No items added yet</p>
            <p className="text-sm sm:text-base">Click "Add Item" to get started</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-0">
            {invoiceData.items.map((item, index) => (
              <ItemRow
                key={item.id}
                item={item}
                isDark={isDark}
                onUpdate={(id, updates) => {
                  // Only handle single-field updates for compatibility
                  const field = Object.keys(updates)[0] as keyof InvoiceItem;
                  const value = updates[field] as string | number;
                  onUpdateItem(id, field, value);
                }}
                onDelete={onDeleteItem}
                isLastRow={index === invoiceData.items.length - 1}
              />
            ))}
          </div>
        )}

        {/* Tax Rate */}
        <div className="mt-4 sm:mt-6">
          <div className={`
            p-3 sm:p-4 rounded-lg border-2
            ${isDark 
              ? 'bg-green-900/20 border-green-700' 
              : 'bg-green-50 border-green-200'
            }
          `}>
            <h4 className={`
              font-medium mb-2 flex items-center space-x-2
              ${isDark ? 'text-green-300' : 'text-green-700'}
            `}>
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>🇵🇰</span>
              <span className="text-sm sm:text-base">FBR Compliant Tax System</span>
            </h4>
            <div className={`
              text-xs sm:text-sm
              ${isDark ? 'text-green-200' : 'text-green-600'}
            `}>
              <p className="mb-2">Tax rates are automatically applied based on FBR product categories:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <div>• Basic Food: 0% GST</div>
                <div>• Packaged Food: 18% GST</div>
                <div>• Luxury Items: 25% GST</div>
                <div>• Electronics: 17% GST</div>
                <div>• Clothing: 17% GST</div>
                <div>• Services: 17% GST</div>
                <div className="sm:col-span-3">
                  <strong>• NTN & STRN required for FBR compliance</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className={sectionClasses}>
        <h2 className={headingClasses}>
          <span>Additional Information</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className={labelClasses}>Notes</label>
            <textarea
              rows={4}
              value={invoiceData.notes}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder="Additional notes or special instructions..."
              className={textareaClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Terms & Conditions</label>
            <textarea
              rows={4}
              value={invoiceData.terms}
              onChange={(e) => onUpdate({ terms: e.target.value })}
              placeholder="Payment terms and conditions..."
              className={textareaClasses}
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className={sectionClasses}>
        <h2 className={headingClasses}>
          <span>Payment Information</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className={labelClasses}>Cash Received (PKR)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={invoiceData.cashReceived || 0}
              onChange={(e) => onUpdate({ cashReceived: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Change Due (PKR)</label>
            <div className={`
              w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border font-semibold
              ${isDark 
                ? 'bg-gray-700 border-gray-600 text-green-400' 
                : 'bg-gray-100 border-gray-300 text-green-600'
              }
            `}>
              {((invoiceData.cashReceived || 0) - (invoiceData.total || 0)).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;