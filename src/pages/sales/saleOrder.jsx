import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/dropdown";
import SortableTable from "../../components/Tables";

export default function SaleOrder({ data, setData }) {
  var [page, setPage] = useState("saleOrder");
  const Navigate = useNavigate();
  let columns = [
    { key: "index", label: "#",type:"number" },
    { key: "invoice_number", label: "Invoice Number",type:"number" },
    { key: "name", label: "Party Name",type:"string" },
    { key: "invoice_date", label: "Date",type:"string" },
    { key: "due_date", label: "Due Date" ,type:"string"},
    { key: "total", label: "Total",type:"number" },
    { key: "balance", label: "Balance" ,type:"number"},
    { key: "status", label: "Status",type:"string" },
    { key: "action", label: "Action",type:"string" },
    { key: "DropDown", label: "-" },
  ];
  var sendingArray = data?.Transactions?.map((item, originalIndex) => ({
         ...item,
         originalIndex,
       })).filter(
         (ele) => ele.type === "Payment-Out"
    )?.map((ele,index) => {
    return {
      ...ele,
      index:index+1,
      invoice_date: new Date(ele.invoice_date).toLocaleDateString(),
      due_date: new Date(ele.due_date).toLocaleDateString(),
      status:ele.status? ele.status:"open",
      action:(<button
                     className=" py-1 px-3 bg-gray-200 shadow-md text-blue-600"
                     onClick={() => {
                       Navigate("/addSales?index=" + ele.originalIndex);
                     }}
                   >
                     Convert to sale
                   </button>),
      menuItem: [
        { label: "print" },
        { label: "forward" },
        { label: "generate Invoice" },
        { label: "recieve payment" },
        { label: "View/Edit" },
        { label: "cancel" },
        { label: "Delete" },
        { label: "Duplicate" },
        { label: "Print" },
      ],
    };
  });
  return (
    <div id="sale-Order">
      <div className="topbar">
        <button
          className={page === "saleOrder" ? "selected" : ""}
          onClick={() => setPage("saleOrder")}
        >
          Sale Order
        </button>
        <button
          className={page === "OnlineOrder" ? "selected" : ""}
          onClick={() => setPage("OnlineOrder")}
        >
          Online Order
        </button>
      </div>
      {page === "saleOrder" && (
        <>
          {data?.Transactions?.filter((ele) => ele.type === "Sale order") ? (
            <div id="saleInvoice">
              {data && (
                // <div className="content">
                //   <div className="t">
                //     <h1>TRANSACTIONS</h1>
                //     <div className="">
                //       <div className="search">
                //         <svg
                //           xmlns="http://www.w3.org/2000/svg"
                //           viewBox="0 0 512 512"
                //         >
                //           <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                //         </svg>
                //         <input autoComplete="off" type="" />
                //       </div>
                //       <button onClick={() => Navigate("/add-sales-order")}>
                //         + Add Sales Order
                //       </button>
                //     </div>
                //   </div>
                //   <div className="cl">
                //     <p>Party Name</p>
                //     <p>No</p>
                //     <p>Date</p>
                //     <p>Due Date</p>
                //     <p>Total Ammount</p>
                //     <p>Balance</p>
                //     <p>Status</p>
                //     <p>Action</p>
                //     <p className="side">-</p>
                //   </div>
                //   {data?.Transactions?.map((item, originalIndex) => ({
                //     ...item,
                //     originalIndex,
                //   }))
                //     .filter((ele) => ele.type === "Sale order")
                //     .map((sale, index) => (
                //       <div className="cl" key={index}>
                //         <p className="grey">{sale.invoice_number}</p>
                //         <p className="grey">{sale.name}</p>
                //         <p className="">{sale.invoice_date}</p>
                //         <p className="grey">{sale.due_date}</p>
                //         <p className="grey">{sale.total}</p>
                //         <p className="grey">{sale.pending}</p>
                //         <p className="grey">Open</p>
                //         <p className="grey">
                //           <button
                //             className=" py-1 px-3 bg-gray-200 shadow-md text-blue-600"
                //             onClick={() => {
                //               Navigate("/addSales?index=" + sale.originalIndex);
                //             }}
                //           >
                //             Convert to sale
                //           </button>
                //         </p>
                //         <p className="side">
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
                // </div>
                <div className="">
                <div className="flex justify-between p-4 rounded-md bg-gray-100 items-center">
                  <div className="flex gap-2">
                    <div className="flex border border-gray-700 rounded-full px-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                      <input autoComplete="off" type="" className="bg-transparent" />
                    </div>
                  </div>
                  <button className="px-2 py-1 rounded-full font-semibold text-white bg-blue-500 ml-2"   onClick={() => Navigate("/add-sales-order")}>
                        + Add Sales Order
                      </button>
                </div>

                <SortableTable data={sendingArray} columns={columns} />
              </div>
              )}
            </div>
          ) : (
            <div className="service">
              <img src="./assets/bill.jpg" alt="" />
              <p>
                Make & share sale orders & convert them to sale invoice
                instantly.
              </p>
              <button onClick={() => Navigate("/add-sales-order")}>
                Add Your First Sale Order
              </button>
            </div>
          )}
        </>
      )}
      {page === "OnlineOrder" && (
        <div className="service">
          <img src="./assets/bill.jpg" alt="" />
          <h1>No Online Orders</h1>
          <p>Create your online store to get orders online</p>
          <button onClick={() => Navigate("/add-items")}>Create Store</button>
        </div>
      )}
    </div>
  );
}
