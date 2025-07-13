import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeGeneratorProps {
  value: string;
  width?: number;
  height?: number;
  fontSize?: number;
  className?: string;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  value,
  width = 2,
  height = 50,
  fontSize = 12,
  className = ''
}) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && value) {
      try {
        JsBarcode(barcodeRef.current, value, {
          format: "CODE128",
          width: width,
          height: height,
          fontSize: fontSize,
          textAlign: "center",
          textPosition: "bottom",
          textMargin: 2,
          fontOptions: "",
          font: "monospace",
          background: "#ffffff",
          lineColor: "#000000",
          margin: 5,
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 5,
          marginRight: 5,
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [value, width, height, fontSize]);

  if (!value) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg ref={barcodeRef} className="max-w-full h-auto"></svg>
    </div>
  );
};

export default BarcodeGenerator;