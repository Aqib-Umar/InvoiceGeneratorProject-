import React from 'react';
import { Download, Receipt, FileImage } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { InvoiceFormat } from '../types/invoice';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onGeneratePDF: () => void;
  isGeneratingPDF: boolean;
  format: InvoiceFormat;
  onFormatChange: (format: InvoiceFormat) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isDark, 
  onToggleTheme, 
  onGeneratePDF, 
  isGeneratingPDF,
  format,
  onFormatChange
}) => {
  return (
    <header className={`
      border-b transition-colors duration-200
      ${isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-4 sm:space-y-0">
          {/* Left Section */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className={`
              p-2 rounded-lg flex items-center justify-center self-start sm:self-auto
              ${isDark ? 'bg-gradient-to-br from-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-100 to-purple-100'}
            `}>
              <img 
                src="companylogo1.png" 
                alt="Averon Digital Logo" 
                className="w-11 h-10 rounded-full "
              />
            </div>
            <div>
              <h1 className={`
                text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
                ${isDark ? 'text-white' : 'text-gray-900'}
              `}>
                Invoice Generator By Averon Digital
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Professional invoicing solutions for Pakistan
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            {/* Format Buttons */}
            <div className="flex space-x-2 justify-start sm:justify-center">
              <button
                onClick={() => onFormatChange('standard')}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${format === 'standard'
                    ? 'bg-blue-600 text-white'
                    : isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
                `}
              >
                <FileImage className="w-4 h-4" />
                <span>Standard</span>
              </button>
              <button
                onClick={() => onFormatChange('receipt')}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${format === 'receipt'
                    ? 'bg-blue-600 text-white'
                    : isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
                `}
              >
                <Receipt className="w-4 h-4" />
                <span>Receipt</span>
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={onGeneratePDF}
              disabled={isGeneratingPDF}
              className={`
                flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium
                transition-all duration-200 ease-in-out
                ${isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400'}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
                disabled:cursor-not-allowed w-full sm:w-auto
              `}
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
            </button>

            {/* Theme Toggle */}
            <div className="flex justify-start sm:justify-center">
              <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
