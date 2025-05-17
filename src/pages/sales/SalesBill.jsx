import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SalesBill = () => {
  // Function to print only the bill content
  const printBill = () => {
    const printContent = document.getElementById("tax-invoice-bill");
    const WindowPrint = window.open("", "", "width=800,height=600");
    WindowPrint.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .bill-container {
              width: 210mm;
              padding: 20px;
              margin: 0;
              border: 1px solid #ccc;
              font-size: 12px;
            }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    WindowPrint.document.close();
    WindowPrint.focus();
    WindowPrint.print();
    WindowPrint.close();
  };

  // Function to save the bill as PDF
  const saveAsPDF = () => {
    const billContent = document.getElementById("tax-invoice-bill");
    html2canvas(billContent).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("tax_invoice_bill.pdf");
    });
  };

  return (
    <div className="p-8">
      {/* Tax Invoice Bill container */}
      <div
        id="tax-invoice-bill"
        className="bill-container max-w-[210mm] mx-auto border border-gray-300 p-8 bg-white"
      >
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold">new business</h2>
            <p>Phone no.: 99992229992</p>
            <p>Email: harhshaa@gmail.com</p>
          </div>
          <div className="text-right">
            <img src="/logo.png" alt="logo" className="h-16 w-16" />{" "}
            {/* Logo placeholder */}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-purple-600">Tax Invoice</h2>
        </div>

        {/* Bill Details */}
        <div className="flex justify-between mb-8">
          <div>
            <p>
              <strong>Bill To:</strong> ha
            </p>
            <p>add 1</p>
            <p>
              <strong>Contact No.:</strong> 99922229922
            </p>
            <p>
              <strong>State:</strong> 37-Andhra Pradesh
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong>Ship To:</strong> add2
            </p>
            <p>
              <strong>Invoice No.:</strong> 5
            </p>
            <p>
              <strong>Date:</strong> 15-09-2024
            </p>
            <p>
              <strong>Place of supply:</strong> 37-Andhra Pradesh
            </p>
          </div>
        </div>

        {/* Item Table */}
        <table className="w-full mb-8 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-purple-100">
              <th className="border border-gray-300 px-4 py-2 text-left">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Item Name
              </th>
              {/* <th className="border border-gray-300 px-4 py-2 text-left">
                HSN/SAC
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Batch No.
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Exp. Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Mfg. Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Size
              </th> */}
              <th className="border border-gray-300 px-4 py-2 text-left">
                Quantity
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Unit
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Price/Unit
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Discount
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                GST
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">1</td>
              <td className="border border-gray-300 px-4 py-2">
                Paracod Tablet
              </td>
              {/* <td className="border border-gray-300 px-4 py-2">123</td>
              <td className="border border-gray-300 px-4 py-2">12/2024</td>
              <td className="border border-gray-300 px-4 py-2">07/08/2024</td>
              <td className="border border-gray-300 px-4 py-2">110</td> */}
              <td className="border border-gray-300 px-4 py-2">STRP</td>
              <td className="border border-gray-300 px-4 py-2">1</td>
              <td className="border border-gray-300 px-4 py-2">₹ 220.03</td>
              <td className="border border-gray-300 px-4 py-2">
                ₹ 60.40 (3.12%)
              </td>
              <td className="border border-gray-300 px-4 py-2">
                ₹ 770.88 (12%)
              </td>
              <td className="border border-gray-300 px-4 py-2">₹ 7,194.85</td>
            </tr>
          </tbody>
        </table>

        {/* Amount in Words */}
        {/* <div className="mb-8">
          <p>
            <strong>Invoice Amount In Words:</strong> Seven Thousand One Hundred
            Ninety Five Rupees only
          </p>
        </div> */}

        {/* Terms and Conditions */}
        <div className="mb-8">
          <p>
            <strong>Terms and Conditions:</strong>
          </p>
          <p>Thanks for doing business with us!</p>
        </div>

        {/* Amount Details */}
        <div className="flex justify-between mb-8">
          <div>
            <p>Description: payment descr</p>
            <p>Sub Total: ₹ 6,644.00</p>
            <p>Discount: ₹ 220.03</p>
            <p>SGST @6%: ₹ 385.44</p>
            <p>CGST @6%: ₹ 385.44</p>
            <p>Round off: ₹ 0.15</p>
          </div>
          <div className="text-right font-bold">
            <p>Total: ₹ 7,195.00</p>
          </div>
        </div>

        {/* You Saved and Points */}
        <div className="flex justify-between">
          <div>
            <p>You Saved: ₹ 246.43</p>
          </div>
          <div className="text-right">
            <p>Earned Points: 71.95</p>
            <p>Available Points: 71.95</p>
          </div>
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <p className="font-bold">Received By:</p>
            <p>Name:</p>
            <p>Comment:</p>
            <p>Date:</p>
            <p>Signature:</p>
          </div>
          <div className="text-right">
            <p className="font-bold">For new business</p>
            <p className="font-bold">Authorized Signatory</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="text-center mt-8 space-x-4">
        <button
          onClick={printBill}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          Print
        </button>
        <button
          onClick={saveAsPDF}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save as PDF
        </button>
      </div>
    </div>
  );
};

export default SalesBill;
