import React, { useEffect, useState } from "react";
import dev_url from "../../url";
import Dropdown from "../../components/dropdown";
import { useNavigate } from "react-router-dom";
import SortableTable from "../../components/Tables";

export default function PaymentOut({ data, setData }) {
  const Navigate = useNavigate();
  let columns = [
    { key: "invoice_date", label: "Date" },
    { key: "name", label: "Party Name",type:"string" },
    { key: "invoice_number", label: "Ref Number",type:"number" },
    { key: "category", label: "Category Name",type:"string" },
    { key: "type", label: "Type",type:"transaction type"  },
    { key: "credit", label: "Total" ,type:"number"},
    { key: "amount", label: "Recived/Paid",type:"number" },
    { key: "balance", label: "Balance",type:"number" },
    // { key: "action", label: "Action" },
    { key: "DropDown", label: "-" },
  ];
  var sendingArray = data?.Transactions?.filter(
         (ele) => ele.type === "Payment-Out"
    )?.map((ele) => {
    return {
      ...ele,
      invoice_date: new Date(ele.invoice_date).toLocaleDateString(),
      // due_date: new Date(ele.due_date).toLocaleDateString(),
      // status:ele.status? ele.status:"open",
      // action:(<button className=" py-1 px-3 bg-gray-200 shadow-md text-blue-600">
      //      Convert to sale
      // </button>),
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
    <div id="saleInvoice">
      <div className="title">
        <div className="t">
          <div className="l">
            <select name="" id="">
              <option selected value="">
                All Purchase Invoice
              </option>
              <option value="">This Month</option>
              <option value="">This Quater</option>
              <option value="">This Year</option>
            </select>
          </div>
          <div className="r">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z" />
              </svg>
              Graphs
            </button>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
              </svg>
              Print
            </button>
          </div>
        </div>
        {/* {data ? selectedParty.partyName : "No Party Selected"} */}
        <div className="b">
          <select name="" id="">
            <option value="">Sale</option>
            <option value="">Purchase</option>
            <option selected value="">
              Payment Out
            </option>
            <option value="">Payment In</option>
          </select>
        </div>
      </div>
      {data && (
        // <div className="content">
        //   <div className="t">
        //     <div className="search">
        //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        //         <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        //       </svg>
        //       <input autoComplete="off" type="" />
        //     </div>
        //     <button onClick={() => Navigate("/add-payment-out")}>
        //       + Add Payment Out
        //     </button>
        //   </div>

        //   <div className="cl">
        //     <p className="side">-</p>
        //     <p>DATE</p>
        //     <p>REF NO</p>
        //     <p>PARTY NAME</p>
        //     <p>CATEGORY NAME</p>
        //     <p>TYPE</p>
        //     <p>TOTAL</p>
        //     <p>RECIEVED/PAID</p>
        //     <p>BALANCE</p>
        //     <p className="side">-</p>
        //   </div>
        //   {data?.Transactions?.filter(
        //     (transaction, index) => transaction.type === "Payment-Out"
        //   ).map((sale, index) => (
        //     <div className="cl" key={index}>
        //       <p className="side">{index + 1}</p>
        //       <p className="">{sale.date}</p>
        //       <p className="">{index}</p>
        //       <p className="">{sale.Name}</p>
        //       <p className="">{}</p>
        //       <p className="">{sale.type}</p>
        //       <p className="">{sale.credit}</p>
        //       <p className="">{sale.amount}</p>
        //       <p className="">{sale.balance}</p>
        //       <p className="side">
        //         <Dropdown
        //           menuItems={[
        //             { label: "print" },
        //             { label: "forward" },
        //             { label: "generate Invoice" },
        //             { label: "recieve payment" },
        //             { label: "View/Edit" },
        //             { label: "cancel" },
        //             { label: "Delete" },
        //             { label: "Duplicate" },
        //             { label: "Print" },
        //           ]}
        //           isLabelOnly={true}
        //         >
        //           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
        //             <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
        //           </svg>
        //         </Dropdown>
        //       </p>
        //     </div>
        //   ))}
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
                  <button className="px-2 py-1 rounded-full font-semibold text-white bg-blue-500 ml-2" onClick={() => Navigate("/add-purchase-order")}>
                     + Add Purchase Order
            </button>
                </div>

                <SortableTable data={sendingArray} columns={columns} />
              </div>
      )}
    </div>
  );
}
