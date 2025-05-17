import React, { useState } from "react";
import SortableTable from "../Tables";

export default function StockSummarReportByItemQuantity({ data, setData }) {
  const [arg, setArg] = useState();
  const columns = [
    { key: "Name", label: "Item Category",type:"string" },
    { key: "moneyInn", label: "Total Stock" ,type:"number" },
    { key: "moneyInn", label: "Total value",type:"number"  },
    // { key: "DropDown", label: "-" },
  ];
  const sendingArray = data?.items
    ?.filter((element, index) =>
      arg ? element?.partyName?.includes(arg) : true && false
    )
    .map((ele, index) => {
      return {
        ...ele,
        //   invoice_date: new Date(ele.invoice_date).toLocaleDateString(),
        //   invoice_number: ele.invoice_number,
        //   name: ele.partyName,
        //   totalSales: ele.total,
        index: index + 1,
        SaleQuanity:
          data.Transactions?.filter(
            (ele1) => ele1.type == "Sale" && ele1.partyName == ele.partyName
          ).reduce((acc, obj) => acc + obj.items.lenght, 0) -
          data.Transactions?.filter(
            (ele1) =>
              ele1.type == "Credit Note" && ele1.partyName == ele.partyName
          ).reduce((acc, obj) => acc + obj.items.lenght, 0),
        PurchaseQuanity:
          data.Transactions?.filter(
            (ele1) => ele1.type == "Purchase" && ele1.partyName == ele.partyName
          ).reduce((acc, obj) => acc + obj.items.lenght, 0) -
          data.Transactions?.filter(
            (ele1) =>
              ele1.type == "Debit Note" && ele1.partyName == ele.partyName
          ).reduce((acc, obj) => acc + obj.items.lenght, 0),
        moneyIn:
          data.Transactions?.filter(
            (ele1) => ele1.type == "Sale" && ele1.partyName == ele.partyName
          ).reduce((acc, obj) => acc + parseInt(obj.total), 0) -
          data.Transactions?.filter(
            (ele1) =>
              ele1.type == "Credit Note" && ele1.partyName == ele.partyName
          ).reduce((acc, obj) => acc + parseInt(obj.total), 0),
        moneyInn: 0,
        moneyOut:
          data.Transactions?.filter(
            (ele1) => ele1.type == "Sale" && ele1.partyName == ele.partyName
          ).reduce((acc, obj) => acc + parseInt(obj.total), 0) -
          data.Transactions?.filter(
            (ele1) =>
              ele1.type == "Debit Note" && ele1.partyName == ele.partyName
          ).reduce((acc, obj) => acc + parseInt(obj.total), 0),
        menuItem: [{ label: "view details" }],
      };
    });

  return (
    <div id="saleInvoice">
      {sendingArray && (
        <div className="">
          <div className="flex justify-between p-4 rounded-md bg-gray-100 items-center">
            <h1>STOCK SUMMARY BY ITEM CATEGORY</h1>
            <div className="flex gap-2">
              <div className="flex border border-gray-700 rounded-full px-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
                <input autoComplete="off" type="" className="bg-transparent" />
              </div>
            </div>
          </div>
          <SortableTable data={sendingArray} columns={columns} />
        </div>
      )}
    </div>
  );
}
