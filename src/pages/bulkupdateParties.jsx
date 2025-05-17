import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Bulkupdateitems({ data, setData, change, setChange }) {
  const Navigate = useNavigate();
  const [editedParties, setEditedParties] = useState([...data.parties]);

  const handleChange = (index, field, value) => {
    const updatedParties = editedParties.map((party, i) =>
      i === index ? { ...party, [field]: value } : party
    );
    setEditedParties(updatedParties);
  };

  const handleSave = () => {
    console.log(editedParties);
    setData({ ...data, parties: editedParties });
    setChange(!change);
    Navigate("/items");
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-lg font-semibold mb-4">Edit Parties</h3>
      <div className="grid grid-cols-12 gap-4 font-bold">
        <div className="">#</div>
        <div className="col-span-2">Party Name</div>
        <div className="col-span-1">GSTIN</div>
        <div className="col-span-2">Phone No</div>
        <div className="col-span-2">State</div>
        <div className="col-span-2">Email</div>
      </div>
      {editedParties.map((party, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 items-center mb-2">
          <div className="">{index + 1}</div>
          <input
            type="text"
            className="col-span-2 p-2 border border-gray-300 rounded"
            value={party.partyName}
            onChange={(e) => handleChange(index, "partyName", e.target.value)}
          />
          <input
            type="text"
            className="col-span-1 p-2 border border-gray-300 rounded"
            value={party.GSTIN}
            onChange={(e) => handleChange(index, "GSTIN", e.target.value)}
          />
          <input
            type="text"
            className="col-span-2 p-2 border border-gray-300 rounded"
            value={party.phoneNo}
            onChange={(e) => handleChange(index, "phoneNo", e.target.value)}
          />
          <input
            type="text"
            className="col-span-2 p-2 border border-gray-300 rounded"
            value={party.state}
            onChange={(e) => handleChange(index, "state", e.target.value)}
          />
          <input
            type="text"
            className="col-span-2 p-2 border border-gray-300 rounded"
            value={party.Email}
            onChange={(e) => handleChange(index, "Email", e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save
      </button>
    </div>
  );
}
