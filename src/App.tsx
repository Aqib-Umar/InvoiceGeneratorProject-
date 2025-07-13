import React, { useState, useCallback } from 'react';
import { InvoiceData, InvoiceItem, InvoiceFormat } from './types/invoice';
import { 
  calculateItemAmount, 
  calculateSubtotal, 
  calculateTaxAmount, 
  calculateTotal
} from './utils/calculations';
import { generateFBRInvoiceNumber } from './utils/fbrCompliance';
import { generateInvoicePDF } from './utils/pdfGenerator';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';

function App() {
  const [isDark, setIsDark] = useLocalStorage('invoice-theme', false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [format, setFormat] = useLocalStorage<InvoiceFormat>('invoice-format', 'standard');

  const initialInvoiceData = React.useMemo<InvoiceData>(() => ({
    invoiceNumber: generateFBRInvoiceNumber(),
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    
    companyName: '',
    companyNTN: '',
    companySTRN: '',
    companyAddress: '',
    companyCity: '',
    companyPhone: '',
    companyEmail: '',
    
    clientName: '',
    clientNTN: '',
    clientAddress: '',
    clientCity: '',
    clientPhone: '',
    clientEmail: '',
    
    items: [],
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    taxRate: 17, // Default GST rate for the invoice
    
    notes: '',
    terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.',
    cashReceived: 0,
  }), []);

  const [invoiceData, setInvoiceData] = useLocalStorage('invoice-data', initialInvoiceData);

  const updateCalculations = useCallback((data: InvoiceData) => {
    const subtotal = calculateSubtotal(data.items);
    const taxAmount = calculateTaxAmount(data.items); // Per-item tax calculation
    const total = calculateTotal(subtotal, taxAmount);
    
    return {
      ...data,
      subtotal,
      taxAmount,
      total,
    };
  }, []);

  const handleUpdateInvoice = useCallback((updates: Partial<InvoiceData>) => {
    setInvoiceData(prev => {
      const updated = { ...prev, ...updates };
      return updateCalculations(updated);
    });
  }, [setInvoiceData, updateCalculations]);

  const handleUpdateItem = useCallback((id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          
          // Recalculate amount and tax if quantity or rate changes
          if (field === 'quantity' || field === 'rate') {
            updated.amount = calculateItemAmount(updated.quantity, updated.rate);
            updated.taxAmount = calculateItemAmount(updated.quantity, updated.rate) * (updated.taxRate / 100);
          }
          
          return updated;
        }
        return item;
      });
      
      const updated = { ...prev, items: updatedItems };
      return updateCalculations(updated);
    });
  }, [setInvoiceData, updateCalculations]);

  const handleAddItem = useCallback(() => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
      taxRate: 17, // Default GST rate
      taxAmount: 0,
    };

    setInvoiceData(prev => {
      const updated = { ...prev, items: [...prev.items, newItem] };
      return updateCalculations(updated);
    });
  }, [setInvoiceData, updateCalculations]);

  const handleDeleteItem = useCallback((id: string) => {
    setInvoiceData(prev => {
      const updated = { ...prev, items: prev.items.filter(item => item.id !== id) };
      return updateCalculations(updated);
    });
  }, [setInvoiceData, updateCalculations]);

  const handleClearAll = useCallback(() => {
    setInvoiceData(initialInvoiceData);
  }, [initialInvoiceData, setInvoiceData]);

  const handleGeneratePDF = useCallback(async () => {
    setIsGeneratingPDF(true);
    try {
      await generateInvoicePDF(invoiceData, format);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [invoiceData, format]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, [setIsDark]);

  const handleFormatChange = useCallback((newFormat: InvoiceFormat) => {
    setFormat(newFormat);
  }, [setFormat]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header 
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onGeneratePDF={handleGeneratePDF}
        isGeneratingPDF={isGeneratingPDF}
        format={format}
        onFormatChange={handleFormatChange}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Form Section - Top Priority */}
        <div className="mb-8">
          <InvoiceForm
            invoiceData={invoiceData}
            isDark={isDark}
            onUpdate={handleUpdateInvoice}
            onUpdateItem={handleUpdateItem}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onClearAll={handleClearAll}
          />
        </div>
        
        {/* Preview Section - Below Form */}
        <div>
          <InvoicePreview
            invoiceData={invoiceData}
            isDark={isDark}
            format={format}
          />
        </div>
      </main>
    </div>
  );
}

export default App;