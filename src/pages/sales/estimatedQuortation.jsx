import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/dropdown";
import SortableTable from "../../components/Tables";

export default function EstimatedQuortation({ data, setData }) {
  const Navigate = useNavigate();
  const [dataList, setDataList] = useState();
  const [convert, toggleConvert] = useState(false);
  useEffect(() => {
    console.log(data.Transactions);
    let list = data.Transactions?.filter(
      (ele, index) => ele.transactionType === "Sale Estimation"
    );
    if (list) setDataList(list);
  }, [data]);
  const columns = [
    { key: "invoice_date", label: "Date",type:"string" },
    { key: "invoice_number", label: "Refrence Number" ,type:"number"},
    { key: "name", label: "Name",type:"string" },
    { key: "total", label: "Total",type:"number" },
    { key: "pending", label: "Balance" },
    { key: "status", label: "Status",type:"string" },
    { key: "Action", label: "Action",type:"string" },
  ];
  const sendingArray = data.Transactions?.map((item, originalIndex) => ({
    ...item,
    originalIndex,
  }))
    .filter((ele, index) => ele.transactionType === "Sale Estimation")
    .map((ele) => {
      return {
        ...ele,
        pending: ele.total - ele.paid,
        invoice_date: new Date(ele.invoice_date).toLocaleDateString(),
        status: "pending",
        Action: () => Navigate("/addSales?index=" + ele.originalIndex),
      };
    });

  return (
    <div>
      <div className="w-full p-3 rounded-md my-3 shadow-md flex justify-between">
        <div className="t">
          <div className="l">
            <select name="" id="">
              <option selected value="">
                All Estimations
              </option>
              <option value="">This Month</option>
              <option value="">This Quater</option>
              <option value="">This Year</option>
            </select>
          </div>
        </div>
      </div>
      {dataList ? (
        // <div id="saleInvoice">
        //   <div className="content">
        //     <div className="t">
        //       <h1>TRANSACTIONS</h1>
        //       <div className="">
        //         <div className="search">
        //           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        //             <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        //           </svg>
        //           <input autoComplete="off" type="" />
        //         </div>
        //         <button onClick={() => Navigate("/add-estimation")}>
        //           + Add estimation
        //         </button>
        //       </div>
        //     </div>
        //     <div className="cl">
        //       <p>date</p>
        //       <p>Refrence No</p>
        //       <p>Name</p>
        //       <p>Total Amount</p>
        //       <p>Balance</p>
        //       <p>Status</p>
        //       <p>Action</p>
        //       <p className="side">-</p>
        //     </div>
        //     {dataList.map((est, index) => (
        //       <div className="cl" key={index}>
        //         <p className="">{est.invoice_date}</p>
        //         <p className="grey">{est.invoice_number}</p>
        //         <p className="grey">{est.name}</p>
        //         <p className="grey">{est.total}</p>
        //         <p className="grey">{est.total}</p>
        //         <p className="grey text-orange-400">Quortation Open</p>
        //         <p className="grey relative">
        //           <button
        //             onClick={() => toggleConvert(!convert)}
        //             className="px-2 py-1 shadow-md text-blue-400 bg-white font-semibold"
        //           >
        //             Convert
        //           </button>
        //           {convert && (
        //             <div className="absolute top-8 bg-white right-0 shadow-md rounded-md">
        //               <button className="px-2 w-full py-1 hover:bg-gray-100 text-blue-400 font-semibold">
        //                 Covert to Sale
        //               </button>
        //               <button className="px-2 w-full py-1 hover:bg-gray-100 text-blue-400 font-semibold">
        //                 Covert to Sale Order
        //               </button>
        //             </div>
        //           )}
        //         </p>
        //         <p className="side">
        //           {/* <Dropdown
        //         menuItems={[
        //           "print",
        //           "forward",
        //           "generate Invoice",
        //           "recieve payment",
        //           "View/Edit",
        //           "cancel",
        //           "Delete",
        //           "Duplicate",
        //           "Print",
        //         ]}
        //       > */}
        //           <Dropdown
        //             menuItems={[
        //               { label: "print" },
        //               { label: "forward" },
        //               { label: "generate Invoice" },
        //               { label: "recieve payment" },
        //               { label: "View/Edit" },
        //               { label: "cancel" },
        //               { label: "Delete" },
        //               { label: "Duplicate" },
        //               { label: "Print" },
        //             ]}
        //             isLabelOnly={true}
        //           >
        //             <svg
        //               xmlns="http://www.w3.org/2000/svg"
        //               viewBox="0 0 128 512"
        //             >
        //               <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
        //             </svg>
        //           </Dropdown>
        //         </p>
        //       </div>
        //     ))}
        //   </div>
        // </div>
        <div className="">
          <div className="flex justify-between p-4 rounded-md bg-gray-100 items-center">
            <h1>TRANSACTIONS</h1>
            <div className="flex gap-2">
              <div className="flex border border-gray-700 rounded-full px-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
                <input autoComplete="off" type="" className="bg-transparent" />
              </div>
              <button
                className="px-3 rounded-full bg-blue-500 hover:to-blue-400 text-white"
                onClick={() => Navigate("/add-estimation")}
              >
                + Add Estimation
              </button>
            </div>
          </div>
          <SortableTable data={sendingArray} columns={columns} />
        </div>
      ) : (
        <div id="sale-Order">
          <div className="topbar">
            <button className="selected">ESTIMATE / QUOTATION</button>
          </div>
          <div className="service">
            <img src="./assets/bill.jpg" alt="" />
            <p>
              Make Estimates/Quotations/Proforma Invoices and share with your
              parties by WhatsApp, Email or Printed copies. You can convert them
              to Sale invoices later by just click of a button
            </p>
            <button onClick={() => Navigate("/add-estimation")}>
              Add Your First Estimate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
