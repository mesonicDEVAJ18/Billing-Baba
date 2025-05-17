import React from "react";

export default function ServerError() {
  let refresh = () => (window.location.href = "/");
  return (
    <div id="sale-Order" className="onlineStore">
      <div className="service">
        <img src="./assets/error.jpg" alt="" />
        <h1>Backend is Currently Experiencing Problem</h1>
        <p>Please refresh the page, if problem persists please contact us</p>
        {/* <button onClick={() => Navigate("/add-purchase-order")}> */}
        <button onClick={() => refresh()}>Refresh</button>
      </div>
    </div>
  );
}
