import React from "react";
import { saveAs } from "file-saver";

export default function ExportItems({ data, setData }) {
  const downloadJson = () => {
    if (!data) {
      alert("No JSON data to download");
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    saveAs(blob, "data.json");
  };
  return (
    <div id="sale-Order" className="onlineStore">
      <div className="service">
        <img src="./assets/building.jpg" alt="" />
        <h1>Click button below to download item export</h1>
        <p>Items will be exported in excel spreadsheet format</p>
        {/* <button onClick={() => Navigate("/add-purchase-order")}> */}
        <button>Export Items</button>
        <p>Items will be exported in excel spreadsheet format</p>
        <button onClick={downloadJson}>Export Whole Data</button>
      </div>
    </div>
  );
}
