import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BulkUpdateItems = ({ data, setData, change, setChange }) => {
  const [data2, setData2] = useState(data.items);

  const handleInputChange = (e, rowIndex, key) => {
    const newData = [...data2];
    newData[rowIndex][key] = e.target.value;
    setData2(newData);
  };

  const handleAddNewItem = () => {
    // Create a new item with empty fields based on the existing keys
    const newItem = Object.keys(data2[0]).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    setData2([...data2, newItem]); // Add the new item to the data array
  };

  const Navigate = useNavigate();
  const handleSave = () => {
    setData({ ...data, items: data2 });
    setChange(!change);
    Navigate("/items");
  };

  return (
    <div className="container mx-auto w-[80vw] overflow-x-scroll py-4">
      <h3 className="text-lg font-semibold mb-4">Add and Edit all Items</h3>

      <table className="table-auto overflow-x-scroll border-collapse border border-gray-300">
        <thead>
          <tr>
            {/* Header row */}
            {Object.keys(data2[0]).map((key) => (
              <th
                key={key}
                className="border px-4 py-2 bg-gray-100 capitalize min-w-[100px]"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Data rows */}
          {data2.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(item).map((key) => (
                <td key={key} className="border min-w-[100px]">
                  <input
                    type="text"
                    value={item[key]}
                    onChange={(e) => handleInputChange(e, rowIndex, key)}
                    className="w-full p-1 border rounded"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-3 flex gap-2">
        {/* Add Item button */}
        <button
          onClick={handleAddNewItem}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Item
        </button>

        {/* Save and Back buttons */}
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
        <button
          onClick={() => Navigate("/items")}
          className="px-4 py-2 border border-blue-500 text-black rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default BulkUpdateItems;
