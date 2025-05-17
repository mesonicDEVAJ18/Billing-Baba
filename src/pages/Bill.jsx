import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

const BillComponent = ({ data, setData, change, setChange }) => {
  // Print only the bill content

  let [pData, setPData] = useState();
  let Navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  let index = params.get("index");
  useEffect(() => {
    try {
      setPData(
        data.Transactions.filter((ele) => ele.type === "Delivery chalan")[index]
      );
    } catch (err) {
      console.log(err);
      alert("data not found");
    }
  }, []);

  const printBill = () => {
    const printContent = document.getElementById("bill-content");
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
    const billContent = document.getElementById("bill-content");
    html2canvas(billContent).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("bill.pdf");
    });
  };

  if (!pData)
    return <div className="text-center mt-20 text-2xl">data not found</div>;
  return (
    <div className="p-8">
      {/* Bill container */}
      <div
        id="bill-content"
        className="bill-container max-w-[210mm] mx-auto border border-gray-300 p-8 bg-white"
      >
        {/* Header */}

        <div className="mb-8 border-b-2 border-purple-600">
          <h2 className="text-2xl font-bold">{data.BusinessName}</h2>
          <h2 className="text-2xl">{data.mobile}</h2>
          <h2 className="text-2xl">{data.email}</h2>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-purple-600">
            Delivery Challan
          </h2>
        </div>

        {/* Delivery Details */}
        <div className="mb-8">
          <p>
            <strong>Delivery Challan For:</strong> {pData.name}
          </p>
          <p>
            <strong>Contact No.:</strong> {pData.phone_no}
          </p>
          <p>
            <strong>State:</strong> {pData.state_of_supply}
          </p>
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
            </tr>
          </thead>
          <tbody>
            {pData.items.map((item, index) => (
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.item}
                </td>
                <td className="border border-gray-300 px-4 py-2">{item.hsn}</td>
                <td className="border border-gray-300 px-4 py-2">{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Terms and Conditions */}
        <div className="mb-8">
          <p>
            <strong>Terms and Conditions:</strong>
          </p>
          <p>Thanks for doing business with us!</p>
        </div>

        {/* Signature Section */}
        <div className="flex flex-col">
          <div className="mb-10">
            <p className="font-bold">Received By:</p>
            <p>Name:</p>
            <p>Comment:</p>
            <p>Date:</p>
            <p>Signature:</p>
          </div>
          <div className="mb-10">
            <p className="font-bold">Delivered By:</p>
            <p>Name:</p>
            <p>Comment:</p>
            <p>Date:</p>
            <p>Signature:</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="text-center mt-8 space-x-4">
        <button
          onClick={() => Navigate("/delivery-chalan")}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          Procede to Delivery Chalan
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

export default BillComponent;
