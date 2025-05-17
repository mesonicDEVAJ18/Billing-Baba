import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

const SaleOrderBill = ({ data, setData, change, setChange }) => {
  // Print only the bill content

  let [pData, setPData] = useState();
  let Navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  let index = params.get("index");
  useEffect(() => {
    try {
      setPData(data.Transactions[index]);
      console.log(data.Transactions[index]);
    } catch (err) {
      console.log(err);
      alert("data not found");
    }
  }, []);

  const printBill = () => {
    const printContent = document.getElementById("sale-order-bill");
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

  // Save the bill as PDF
  const saveAsPDF = () => {
    const billContent = document.getElementById("sale-order-bill");
    html2canvas(billContent).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("sale_order.pdf");
    });
  };

  if (!pData)
    return <div className="text-center mt-20 text-2xl">data not found</div>;
  return (
    <div className="p-8">
      {/* Sale Order Bill container */}
      <div
        id="sale-order-bill"
        className="bill-container max-w-[210mm] mx-auto border border-gray-300 p-8 bg-white"
      >
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold">{data.BusinessName}</h2>
            <p>Phone no.: {data.mobile}</p>
            <p>Email: {data.email}</p>
          </div>
          <div className="text-right">
            <img src="/logo.png" alt="logo" className="h-16 w-16" />{" "}
            {/* Logo placeholder */}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-purple-600">Sale Order</h2>
        </div>

        {/* Order Details */}
        <div className="flex justify-between mb-8">
          <div>
            <p>
              <strong>Order From:</strong> {pData.name}
            </p>
            <p>
              <strong>Contact No.:</strong> {pData.phone_no}
            </p>
            <p>
              <strong>State:</strong> {pData.state_of_supply}
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong>Order No.:</strong> 1
            </p>
            <p>
              <strong>Date:</strong> {pData.invoice_date}
            </p>
            <p>
              <strong>Place of supply:</strong> {pData.state_of_supply}
            </p>
            <p>
              <strong>Due Date:</strong> {pData.due_date}
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
              <th className="border border-gray-300 px-4 py-2 text-left">
                HSN/SAC
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Quantity
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
            {console.log(pData)}
            {pData.items?.map((item, index) => (
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.item}
                </td>
                <td className="border border-gray-300 px-4 py-2">{item.hsn}</td>
                <td className="border border-gray-300 px-4 py-2">{item.qty}</td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹ {item.price_per_unit}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹ {item.discount}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹ {item.tax}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹ {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Amount in Words */}
        <div className="mb-8">
          <p>
            <strong>Order Amount In Words:</strong>
          </p>
        </div>

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
            <p>Sub Total: ₹ {pData.total + pData.discount - pData.total_tax}</p>
            <p>Discount: ₹ {pData.discount}</p>
            <p>Tax: ₹ {pData.total_tax}</p>
          </div>
          <div className="text-right font-bold">
            <p>Total: ₹ {pData.total}</p>
            <p>Advance: ₹ {pData.paid}</p>
            <p>Balance: ₹ {pData.pending}</p>
          </div>
        </div>

        <div className="font-bold">
          <p>You Saved: ₹ {pData.discount}</p>
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
            <p className="font-bold">For {data.BusinessName}</p>
            <p className="font-bold">Authorized Signatory</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="text-center mt-8 space-x-4">
        <button
          onClick={() => Navigate("/sales-order")}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          Go to sales order
        </button>
        <button
          onClick={saveAsPDF}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save as PDF
        </button>
      </div>

      {/* Print Styling */}
      <style jsx>{`
        @media print {
          .non-printable {
            display: none;
          }
          .bill-container {
            max-width: 210mm;
            padding: 20mm;
            margin: 0;
            font-size: 12px;
            color: black;
          }
        }
      `}</style>
    </div>
  );
};

export default SaleOrderBill;
