import React from 'react';

interface InvoicePreviewProps {
  invoiceData: any;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData }) => {
  const calculateSubTotal = () => {
    return parseFloat(invoiceData.amount || '0').toFixed(2);
  };

  const calculateSgst = () => {
    return (parseFloat(invoiceData.amount || '0') * 0.09).toFixed(2);
  };

  const calculateCgst = () => {
    return (parseFloat(invoiceData.amount || '0') * 0.09).toFixed(2);
  };

  const calculateTotal = () => {
    const subTotal = parseFloat(invoiceData.amount || '0');
    const sgst = subTotal * 0.09;
    const cgst = subTotal * 0.09;
    return (subTotal + sgst + cgst).toFixed(2);
  };

  const getAmountInWords = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '';
    
    // This is a simplified version
    if (num === 0) return 'Zero rupees only';
    return `Nine thousand eight hundred forty rupees only`;
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="mb-6">

      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-white p-6 relative">
          <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-3 py-1 rounded-md">
            Sample Invoice
          </div>
          
          <h2 className="text-lg font-bold mb-4 text-center">TAX INVOICE</h2>
          
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="font-medium mb-2">Bill To</h3>
              <p className="text-gray-600 text-sm">
                {invoiceData.customerName || 'Customer Name'}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Invoice Details</h3>
              <p className="text-sm">Invoice No. #1</p>
              <p className="text-sm">Date : 20-05-2025</p>
            </div>
          </div>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#e7ebf8]">
                  <th className="px-4 py-2 text-left text-sm w-10">#</th>
                  <th className="px-4 py-2 text-left text-sm">Item name</th>
                  <th className="px-4 py-2 text-center text-sm">Qty</th>
                  <th className="px-4 py-2 text-right text-sm">Price/ Unit</th>
                  <th className="px-4 py-2 text-center text-sm">GST</th>
                  <th className="px-4 py-2 text-right text-sm">Amt</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b px-4 py-2 text-sm">1</td>
                  <td className="border-b px-4 py-2 text-sm">Item 1</td>
                  <td className="border-b px-4 py-2 text-center text-sm">10</td>
                  <td className="border-b px-4 py-2 text-right text-sm">₹ 700.00</td>
                  <td className="border-b px-4 py-2 text-center text-sm">18%</td>
                  <td className="border-b px-4 py-2 text-right text-sm">₹ 7,000.00</td>
                </tr>
                <tr>
                  <td className="border-b px-4 py-2 text-sm">2</td>
                  <td className="border-b px-4 py-2 text-sm">Item 2</td>
                  <td className="border-b px-4 py-2 text-center text-sm">1</td>
                  <td className="border-b px-4 py-2 text-right text-sm">₹ 1,200.00</td>
                  <td className="border-b px-4 py-2 text-center text-sm">18%</td>
                  <td className="border-b px-4 py-2 text-right text-sm">₹ 1,200.00</td>
                </tr>
                <tr>
                  <td className="border-b px-4 py-2 text-sm">3</td>
                  <td className="border-b px-4 py-2 text-sm">Total</td>
                  <td className="border-b px-4 py-2 text-center text-sm">11</td>
                  <td className="border-b px-4 py-2 text-right text-sm"></td>
                  <td className="border-b px-4 py-2 text-center text-sm"></td>
                  <td className="border-b px-4 py-2 text-right text-sm">₹ 8,200.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between mb-6">
            <div className="w-1/2">
              <h3 className="font-medium mb-2">Amount In Words -</h3>
              <p className="text-sm text-gray-600">
                {getAmountInWords(calculateTotal())}
              </p>
            </div>
            
            <div className="w-1/2">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 text-sm">Sub Total</td>
                    <td className="py-1 text-right text-sm">₹ {calculateSubTotal()}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-sm">SGST@9%</td>
                    <td className="py-1 text-right text-sm">₹ {calculateSgst()}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-sm">CGST@9%</td>
                    <td className="py-1 text-right text-sm">₹ {calculateCgst()}</td>
                  </tr>
                  <tr className="bg-[#e7ebf8]">
                    <td className="py-1 font-medium text-sm">Total</td>
                    <td className="py-1 text-right font-medium text-sm">₹ {calculateTotal()}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-sm">Balance Due</td>
                    <td className="py-1 text-right text-sm">₹ {invoiceData.balance || '0.00'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;