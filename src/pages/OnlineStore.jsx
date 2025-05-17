import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/dropdown";

export default function OnlineStore({ data, setData, pr = true }) {
  var [page, setPage] = useState("OnlineStore");
  const Navigate = useNavigate();

  var [dummyData, setDummyData] = useState(data);
  const toggle_select = (element) => {
    let newData = data;
    if (newData.Store_item_codes?.includes(element.Code)) {
      console.log("hiting 3");
      newData.online_store_items = newData.online_store_items.filter(
        (item) => item !== element
      );
      newData.Store_item_codes = newData.Store_item_codes.filter(
        (selectedIndex) => selectedIndex !== element.Code
      );
    } else {
      if (newData.online_store_items) {
        console.log("hiting 1");
        newData.online_store_items = [...newData.online_store_items, element];
        newData.Store_item_codes = [...newData.Store_item_codes, element.Code];
      } else {
        console.log("hiting 2");
        newData.online_store_items = [element];
        newData.Store_item_codes = [element.Code];
      }
    }
    setData(newData);
    console.log(data);
  };

  return (
    <div id="sale-Order" className="onlineStore">
      {pr && (
        <div className="topbar">
          <button className="selected" onClick={() => setPage("OnlineStore")}>
            Online Store
          </button>
        </div>
      )}
      {page === "OnlineStore" && (
        <div className="service">
          <img src="./assets/online_store.jpg" alt="" />
          <h1>Online Store with Billing-Baba</h1>
          <p>
            Detailed Invoices | Connected Online E-commerce | Recieve Orders |
            Get Online Presence
          </p>
          {/* <button onClick={() => Navigate("/add-purchase-order")}> */}
          <button onClick={() => setPage("addItemToStore")}>
            Set-Up E-store
          </button>
        </div>
      )}
      {/* {console.log(data)} */}
      {page === "addItemToStore" && (
        <div className="service">
          <h1>Online Store with Billing-Baba</h1>
          <p>select items you wish to have on your e-store page</p>
          <div className="cl">
            <p>item Code</p>
            <p>item Name</p>
            <p>Purchase Price</p>
            <p>Sales Price</p>
            <p>Profit</p>
          </div>
          {data?.items?.map((item, index) => (
            <div
              className={
                data.Store_item_codes?.includes(item.Code)
                  ? "cl i selected"
                  : "cl i"
              }
              key={index}
              onClick={() => toggle_select(item)}
            >
              <p>{item.Code}</p>
              <p>{item.Name}</p>
              <p>{item.purchasePrice}</p>
              <p>{item.salesPrice}</p>
              <p>{item.profit}</p>
            </div>
          ))}
          {/* <button onClick={() => Navigate("/add-purchase-order")}> */}
          <button>Continue</button>
        </div>
      )}
    </div>
  );
}