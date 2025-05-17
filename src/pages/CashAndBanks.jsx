import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CashAndBanks() {
  var [page, setPage] = useState("saleOrder");
  const Navigate = useNavigate();
  return (
    <div id="sale-Order">
      <div className="topbar">
        <button
          className={page === "saleOrder" ? "selected" : ""}
          onClick={() => setPage("saleOrder")}
        >
          Banks
        </button>
      </div>
      {page === "saleOrder" && (
        <div className="service">
          <img src="./assets/banksCover.jpg" alt="" />
          <h1>Banking with Billing Baba</h1>
          <p>
            Detailed Invoices | Connected Online Banks | Recieve and send
            Payments
          </p>
          {/* <button onClick={() => Navigate("/add-purchase-order")}> */}
          <button>Comming Soon</button>
        </div>
      )}
    </div>
  );
}
