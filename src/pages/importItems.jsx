import axios from "axios";
import React, { useState } from "react";
import dev_url from "../url";

export default function ImportItems({ data, setData, change, setChange }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(dev_url + "/upload_exel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      let resp = response.data;
      console.log(resp);
      let TestData = data;
      TestData.items = [...TestData.items, ...resp];
      console.log(TestData);
      // setData(TestData);
      // setChange(!change)
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div id="sale-Order" className="onlineStore">
      <div className="service">
        <img src="./assets/items_excel.png" alt="" />
        <h1>Upload Excel sheet with Items Formatted</h1>
        <p>
          Please make sure format of items data matches one shown in pic above
        </p>
        {/* <button onClick={() => Navigate("/add-purchase-order")}> */}

        <input autoComplete="off" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload Excel</button>
      </div>
    </div>
  );
}
