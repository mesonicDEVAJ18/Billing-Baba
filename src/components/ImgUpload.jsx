import React, { useState } from "react";
import dev_url from "../url";

const ImageUploader = ({ onClose, onUpload }) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(dev_url + "/upload_image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.url) {
        onUpload(result.url); // Send URL to parent component
        onClose(); // Close popup after upload
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-4">Upload Your Image</h2>
        <div
          className={`border-2 border-dashed rounded-lg p-6 mb-4 transition-colors ${
            dragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="text-gray-500">
            {dragging
              ? "Drop your image here"
              : "Drag and drop your image here"}
          </p>
          <p className="text-gray-400 mt-2">or</p>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer"
          />
        </div>
        {selectedFile && (
          <p className="text-gray-600 mb-4">
            Selected file: {selectedFile.name}
          </p>
        )}
        <button
          onClick={handleUpload}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full disabled:bg-indigo-300 transition-all"
          disabled={!selectedFile}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
