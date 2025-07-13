import React from 'react';
import { Trash2 } from 'lucide-react';
import { InvoiceItem } from '../types/invoice';
import { formatCurrency } from '../utils/calculations';
import { getFBRTaxRateForProduct } from '../utils/fbrCompliance';

interface ItemRowProps {
  item: InvoiceItem;
  isDark: boolean;
  onUpdate: (id: string, updates: Partial<InvoiceItem>) => void;
  onDelete: (id: string) => void;
  isLastRow?: boolean;
}

const measurementUnits = ['kg', 'litre', 'pcs', 'meter', 'box', 'pack', 'dozen', 'set', 'carton'];

const ItemRow: React.FC<ItemRowProps> = ({
  item,
  isDark,
  onUpdate,
  onDelete,
  isLastRow = false,
}) => {
  const inputClasses = `
    w-full px-3 py-2 rounded-lg border transition-colors duration-200 text-sm
    ${isDark
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'}
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
  `;

  const labelClasses = `block text-sm font-medium mb-1 ${
    isDark ? 'text-gray-300' : 'text-gray-700'
  }`;

  return (
    <div
      className={`
        p-4 rounded-lg border transition-colors duration-200
        ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}
        ${!isLastRow ? 'mb-4' : ''}
      `}
    >
      {/* Row 1: Description, Quantity, Rate */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-4">
        {/* Description */}
        <div className="sm:col-span-6">
          <label className={labelClasses}>Description</label>
          <input
            type="text"
            value={item.description}
            onChange={(e) => {
              const newDescription = e.target.value;
              const newTaxRate = getFBRTaxRateForProduct(newDescription);
              onUpdate(item.id, {
                description: newDescription,
                taxRate: newTaxRate,
              });
            }}
            placeholder="e.g. Sugar, Milk"
            className={inputClasses}
            autoComplete="off"
          />
        </div>

        {/* Quantity */}
        <div className="sm:col-span-3">
          <label className={labelClasses}>Quantity</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.quantity}
            onChange={(e) =>
              onUpdate(item.id, { quantity: parseFloat(e.target.value) || 0 })
            }
            placeholder="0"
            className={inputClasses}
          />
        </div>

        {/* Rate */}
        <div className="sm:col-span-3">
          <label className={labelClasses}>Rate ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.rate}
            onChange={(e) =>
              onUpdate(item.id, { rate: parseFloat(e.target.value) || 0 })
            }
            placeholder="0.00"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Row 2: Amount, Tax, Measurement, Delete */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Amount */}
        <div className="sm:col-span-3">
          <label className={labelClasses}>Amount</label>
          <div
            className={`
              px-3 py-2 rounded-lg border font-medium text-sm
              ${isDark
                ? 'bg-gray-600 border-gray-500 text-green-400'
                : 'bg-gray-100 border-gray-200 text-green-600'}
            `}
          >
            {formatCurrency(item.amount)}
          </div>
        </div>

        {/* Tax */}
        <div className="sm:col-span-3">
          <label className={labelClasses}>Tax (%)</label>
          <div
            className={`
              text-center px-3 py-2 rounded-lg border font-semibold text-sm
              ${isDark
                ? 'bg-gray-600 border-gray-500 text-blue-400'
                : 'bg-blue-50 border-blue-200 text-blue-600'}
            `}
          >
            {item.taxRate || 0}%
          </div>
        </div>

        {/* Measurement */}
        <div className="sm:col-span-3">
          <label className={labelClasses}>Measurement Unit</label>
          <select
            value={item.measurementUnit || ''}
            onChange={(e) =>
              onUpdate(item.id, { measurementUnit: e.target.value })
            }
            className={inputClasses}
          >
            <option value="">Select unit</option>
            {measurementUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        {/* Delete */}
        <div className="sm:col-span-3 flex items-end">
          <button
            onClick={() => onDelete(item.id)}
            className={`
              w-full sm:w-auto p-2 rounded-lg transition-colors duration-200
              ${isDark
                ? 'bg-red-900 hover:bg-red-800 text-red-400'
                : 'bg-red-100 hover:bg-red-200 text-red-600'}
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              ${isDark ? 'focus:ring-offset-gray-700' : 'focus:ring-offset-white'}
            `}
            aria-label="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemRow;