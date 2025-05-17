import axios from "axios";
import React, { useState } from "react";

export default function ImportParties({ data, setData }) {
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
      const response = await axios.post("YOUR_API_ENDPOINT_HERE", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      let resp = response.data;
      console.log(resp);
      let TestData = data;
      TestData.parties = [...TestData.parties, ...resp];
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
        <img src="./assets/parties_excel.png" alt="" />
        <h1>Upload Excel sheet with Parties Formatted</h1>
        <p>
          Please make sure format of parties data matches one shown in pic above
        </p>
        {/* <button onClick={() => Navigate("/add-purchase-order")}> */}

        <input autoComplete="off" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload Excel</button>
      </div>
    </div>
  );
}
