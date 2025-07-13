import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData, InvoiceFormat } from '../types/invoice';


export const generateInvoicePDF = async (invoiceData: InvoiceData, format: InvoiceFormat = 'standard'): Promise<void> => {
  const element = document.getElementById('invoice-preview');
  if (!element) return;

  try {
    const isReceipt = format === 'receipt';
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Use different page sizes based on format
    const pdf = isReceipt 
      ? new jsPDF('p', 'mm', [80, 200]) // Thermal receipt size (80mm width)
      : new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = isReceipt ? 80 : 210;
    const pageHeight = isReceipt ? 200 : 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // For receipts, we might need multiple pages if content is long
    while (heightLeft >= 0 && !isReceipt) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = isReceipt 
      ? `receipt-${invoiceData.invoiceNumber}.pdf`
      : `invoice-${invoiceData.invoiceNumber}.pdf`;
    
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};