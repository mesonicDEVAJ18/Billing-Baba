import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditableGrid = ({ data, setData, change, setChange }) => {
  const [data2, setData2] = useState(data.items);

  const handleInputChange = (e, rowIndex, key) => {
    const newData = [...data2];
    newData[rowIndex][key] = e.target.value;
    setData2(newData);
  };
  const Navigate = useNavigate();
  const handleSave = () => {
    setData({ ...data, items: data2 });
    setChange(!change);
    Navigate("/items");
  };

  return (
    <div className="pt-4 p-2">
      <div className="py-2 pb-4">
        <h1 className="text-xl font-semibold">Bulk Edit Items</h1>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
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

      {/* Display the edited data
      <pre className="mt-4 p-2 bg-gray-100">
        {JSON.stringify(data2, null, 2)}
      </pre> */}
    </div>
  );
};

// Example usage
const App = () => {
  const initialData = [
    { name: "haha", age: 10 },
    { name: "haha", age: 10 },
    { name: "haha", age: 10 },
    { name: "haha", age: 10 },
  ];

  return <EditableGrid initialData={initialData} />;
};

export default EditableGrid;
