import React from "react";

export default function VerifyData({ data, setData }) {
  return (
    <div id="sale-Order" className="onlineStore">
      <div className="service">
        <img src="./assets/error.jpg" alt="" />
        <h1>No Problem Found in data</h1>
        <p>
          Press button below to recheck, if facing any problem please contact us
        </p>
        {/* <button onClick={() => Navigate("/add-purchase-order")}> */}
        <button>Re-Check</button>
      </div>
    </div>
  );
}
