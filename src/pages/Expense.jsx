import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SortableTable from "../components/Tables";
import Dropdown from "../components/dropdown";
import dev_url from "../url";
export default function Expense({ data, setData }) {
  var [page, setPage] = useState("category");
  // var [StockPage, setStockPage] = useState(false);
  const Navigate = useNavigate();
  // var [Category, setCategory] = useState();
  // var [Units, setUnits] = useState();

  const [selecteditems, setSelectedItems] = useState(null);
  // const [selectedunits, setSelectedUnits] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  var [unitName, setUnitName] = useState(false);
  var [unitShorthand, setUnitShorthand] = useState(false);

  var [addCategory, setAddCategory] = useState(false);
  let uid = data.uid;
  const addthings = async () => {
    let data;
    let url;
    if (page === "category") {
      data = { Category: addCategory };
      url = dev_url + "addExpense";
    } else if (page === "unit") {
      data = { name: unitName, shortHand: unitShorthand };
      url = dev_url + "addExpense";
    }
    console.log(data);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: uid, // Modify this if necessary
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("category/units: ", data);
        alert("done");
        Navigate("/items");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  var columns ;
  var sendingArray;
  if(page === "item"){
    columns = [
      { key: "invoice_date", label: "Invoice Date",type:"string" },
      { key: "invoice_number", label: "Invoice Number",type:"number"  },
      { key: "total", label: "Total",type:"number"  },
      { key: "type", label: "Transaction Type",type:"transaction type"  },
    ]
    sendingArray = data?.Transactions?.filter(
      (ele) => ele.type == "Expense"
    ).map((ele) => {
      return {
        ...ele,
        invoice_date: new Date(ele.invoice_date).toLocaleDateString(),
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
    })
  }
  if(page === "category"){
    columns = [
      { key: "invoice_date", label: "Invoice Date",type:"string" },
      { key: "invoice_number", label: "Invoice Number",type:"number" },
      { key: "total", label: "Total",type:"number" },
      { key: "type", label: "Transaction Type" ,type:"transaction type" },
    ]
    // sendingArray = data?.Transactions?.filter(
    //   (ele) => ele.type == "Expense" && ele.Category === selectedCategory.name
    sendingArray = data?.expense?.filter(
      (ele) =>  ele.Category === selectedCategory?.name
    ).map((ele) => {
      return {
        ...ele,
        invoice_date: new Date(ele.invoice_date).toLocaleDateString(),
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
    })
  }


  return (
    <div id="items">
      <div className="topbar">
        <button
          className={page === "category" ? "selected" : ""}
          onClick={() => setPage("category")}
        >
          Category
        </button>
        <button
          className={page === "items" ? "selected" : ""}
          onClick={() => setPage("items")}
        >
          Items
        </button>
      </div>
      {page === "items" && (
        <div className="items">
          <div className="left">
            <div className="top">
              <button onClick={() => Navigate("/add-expense")}>
                Add expense +
              </button>
              <div className="">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
              </div>
            </div>
            <div className="content">
              <div className="head">
                <h2>Invoice</h2>
                <h2>Total</h2>
              </div>
              {data?.expense?.map((item, index) => (
                <div
                  className={`tile ${selecteditems === item ? "selected" : ""}`}
                  key={index}
                  onClick={() => setSelectedItems(item)}
                >
                  <h1>{item.invoice_number}</h1>
                  <div className="">
                    <p>₹ {item.total || "-"}</p>
                    {/* <Dropdown menuItems={["View/Edit", "Delete"]}> */}
                    <Dropdown
                      menuItems={[{ label: "View/Edit" }, { label: "Delete" }]}
                      isLabelOnly={true}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 128 512"
                      >
                        <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                      </svg>
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="right">
            <div className="title">
              <div className="tile">
                <h1>
                  {selecteditems ? selecteditems.Name : "No Item Selected"}
                </h1>
                {/* <button onClick={() => setStockPage(!StockPage)}>
                  + Adujust Items
                </button>
                {StockPage && <StockAdjust setClose={setStockPage} />} */}
              </div>

              {selecteditems && (
                <div className="tile">
                  <p>
                    SALE PRICE{" "}
                    <span>
                      {" "}
                      ₹ {selecteditems ? selecteditems.salesPrice : "Null"}
                    </span>
                    (excl)
                  </p>
                  <p>
                    Stock Qty:{" "}
                    <span className="red">
                      {" "}
                      {selecteditems ? selecteditems.stock : "-"}
                    </span>
                  </p>
                </div>
              )}
              {selecteditems && (
                <div className="tile">
                  <p>
                    PURCHASE PRICE{" "}
                    <span>
                      {" "}
                      ₹ {selecteditems ? selecteditems.purchasePrice : "-"}
                    </span>
                    (excl)
                  </p>
                  <p>
                    Stock Qty:{" "}
                    <span className="red">
                      {" "}
                      {selecteditems ? selecteditems.purchaseStock : "-"}
                    </span>
                  </p>
                </div>
              )}
              <div className="tile"></div>
              <div className="tile"></div>
            </div>
            {selecteditems && (
              <div className="">
                <div className="flex justify-between p-4 rounded-md bg-gray-100 items-center">
                  <h1>TRANSACTIONS</h1>
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
                </div>

                <SortableTable data={sendingArray} columns={columns} />
              </div>
              // <div className="content">
              //   <div className="t">
              //     <h1>TRANSACTIONS</h1>
              //     <div className="search">
              //       <svg
              //         xmlns="http://www.w3.org/2000/svg"
              //         viewBox="0 0 512 512"
              //       >
              //         <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              //       </svg>
              //       <input autoComplete="off" type="" />
              //     </div>
              //   </div>
              //   <div className="cl top">
              //     <p>Type</p>
              //     <p>Invoice/Ref</p>
              //     <p>Name</p>
              //     <p>Date</p>
              //     <p>Quantity</p>
              //     <p>Price</p>
              //     <p>Status</p>
              //   </div>

              //   {selecteditems.transactions?.map((transaction, index) => (
              //     <div className="cl">
              //       <p>Tech</p>
              //       <p className="grey">231</p>
              //       <p className="grey">Boat</p>
              //       <p className="grey">03/02/2024</p>
              //       <p className="grey">10</p>
              //       <p className="grey">3000</p>
              //       <p className="grey">Unpaid</p>
              //     </div>
              //   ))}
              // </div>
            )}
          </div>
        </div>
      )}

      {page === "category" && (
        <div className="items category">
          <div className="left">
            <div className="top">
              <button onClick={() => Navigate("/add-expense")}>
                Add expense +
              </button>
              <div className="">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
              </div>
            </div>
            <div className="content">
              <div className="head">
                <h2>Category</h2>
                {/* <h2>Ammount</h2> */}
              </div>
              {data?.expenseCategory?.map((item, index) => (
                <div
                  className={`tile ${
                    selectedCategory === item ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedCategory(item)}
                >
                  <h1>{item.name}</h1>
                  <div className="">
                    {/* <p>₹ {item.name || "-"}</p> */}
                    {/* <Dropdown menuItems={["View/Edit", "Delete"]}> */}
                    <Dropdown
                      menuItems={[{ label: "View/Edit" }, { label: "Delete" }]}
                      isLabelOnly={true}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 128 512"
                      >
                        <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                      </svg>
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="right">
            <div className="title">
              <div className="tile">
                <h1>{selectedCategory?.name || "no category selected"}</h1>
              </div>
              <div className="tile"></div>
              <div className="tile"></div>
            </div>
            {selectedCategory && (
              // <div className="content">
              //   <div className="t">
              //     <h1>Transactions</h1>
              //     <div className="search">
              //       <svg
              //         xmlns="http://www.w3.org/2000/svg"
              //         viewBox="0 0 512 512"
              //       >
              //         <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              //       </svg>
              //       <input autoComplete="off" type="" />
              //     </div>
              //   </div>
              //   <div className="cl top">
              //     <p>invoice date</p>
              //     <p>invoice number</p>
              //     <p>Total</p>
              //     <p>transaction type</p>
              //   </div>
              //   {data.expense
              //     ?.filter((ele) => ele.Category === selectedCategory.name)
              //     .map((transaction, index) => (
              //       <div className="cl">
              //         <p>{transaction.invoice_date}</p>
              //         <p>{transaction.invoice_number}</p>
              //         <p>{transaction.total}</p>
              //         <p>{transaction.transactionType}</p>
              //         {/* <p>{transaction.Category}</p>
              //         <p className="grey">Boat Headphones</p>
              //         <p className="grey">10</p>
              //         <p className="grey">0.0</p> */}
              //       </div>
              //     ))}
              // </div>
              <div className="">
                <div className="flex justify-between p-4 rounded-md bg-gray-100 items-center">
                  <h1>TRANSACTIONS</h1>
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
                </div>

                <SortableTable data={sendingArray} columns={columns} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
