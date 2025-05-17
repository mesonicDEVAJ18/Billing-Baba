import React, { useEffect, useRef, useState } from "react";
import Dropdown from "./dropdown";

// Reusable Table Component
const SortableTable = ({ data, columns }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerms, setSearchTerms] = useState({}); // Stores search terms
  const [searchOptions, setSearchOptions] = useState({}); // Stores search option like "exact", "contains"
  const [activeSearchKey, setActiveSearchKey] = useState(null); // Tracks the active column for search

  // Generic sorting function
  const sortData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (typeof aValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue?.localeCompare(bValue)
          : bValue?.localeCompare(aValue);
      } else if (typeof aValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      } else if (aValue instanceof Date) {
        return sortConfig.direction === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      } else {
        return 0;
      }
    });
  };

  // Handle sorting when a column header is clicked
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle search input changes
  const handleSearchChange = (key, value) => {
    setSearchTerms((prevSearchTerms) => ({
      ...prevSearchTerms,
      [key]: value,
    }));
  };

  // Handle search option change (like "contains", "exact", etc.)
  const handleSearchOptionChange = (key, option) => {
    setSearchOptions((prevOptions) => ({
      ...prevOptions,
      [key]: option,
    }));
  };

  // Handle radio button change for transaction type
  const handleTransactionTypeChange = (key, value) => {
    setSearchTerms((prevSearchTerms) => ({
      ...prevSearchTerms,
      [key]: value,
    }));
  };

  // Reset transaction type filter
  const resetTransactionTypeFilter = (key) => {
    setSearchTerms((prevSearchTerms) => ({
      ...prevSearchTerms,
      [key]: undefined, // Reset the filter for the transaction type
    }));
  };

  // Filter data based on search terms and selected options
  const filterData = (data) => {
    return data?.filter((item) => {
      return Object.keys(searchTerms).every((key) => {
        if (!searchTerms[key]) return true; // No filter for this column
        const columnValue = item[key]?.toString().toLowerCase() || "";
        const searchValue = searchTerms[key].toLowerCase();
        const searchOption = searchOptions[key] || "contains";

        if (columns.find((col) => col.key === key).type === "string") {
          // String search
          if (searchOption === "exact") {
            return columnValue === searchValue;
          } else if (searchOption === "contains") {
            return columnValue.includes(searchValue);
          }
        } else if (columns.find((col) => col.key === key).type === "number") {
          // Number search
          const columnNumberValue = parseFloat(item[key]);
          const searchNumberValue = parseFloat(searchTerms[key]);

          if (isNaN(searchNumberValue)) return true; // Ignore invalid number input

          if (searchOption === "greater") {
            return columnNumberValue > searchNumberValue;
          } else if (searchOption === "equal") {
            return columnNumberValue === searchNumberValue;
          } else if (searchOption === "less") {
            return columnNumberValue < searchNumberValue;
          }
        } else if (columns.find((col) => col.key === key).type === "transaction type") {
          // Transaction type search
          return columnValue === searchValue; // Compare with the selected transaction type
        }
        return true; // Default, no filter
      });
    });
  };

  const toggleSearchBar = (key) => {
    setActiveSearchKey(activeSearchKey === key ? null : key);
  };

  const sortedData = sortData(filterData(data));

  useEffect(() => {
    console.log(data);
    console.log(columns);
  }, [data]);

  const AscendingArrow = () => (
    <svg
      width="12"
      height="12"
      className="inline-block ml-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );

  const DescendingArrow = () => (
    <svg
      width="12"
      height="12"
      className="inline-block ml-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveSearchKey(false);
      }
    };

    if (activeSearchKey) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeSearchKey]);

  return (
    <div className="overflow-x-auto text-xs">
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns?.map((column) => (
              <th
                key={column.key}
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200"
              >
                <div className="flex items-center justify-between">
                  <span
                    onClick={() => handleSort(column.key)}
                    className="font-medium text-gray-700"
                  >
                    {column.label}
                    {sortConfig.key === column.key &&
                      (sortConfig.direction === "asc" ? (
                        <AscendingArrow />
                      ) : (
                        <DescendingArrow />
                      ))}
                  </span>
                  <button
                    className="ml-2 text-gray-500"
                    onClick={() => toggleSearchBar(column.key)}
                  >
                    {activeSearchKey === column.key?(
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-gray-600" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    ):(

<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-gray-600" viewBox="0 0 512 512"><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/></svg>
                    )}
                  </button>
                </div>

                {/* Search bar with option dropdown or radio buttons */}
                {activeSearchKey === column.key && (
                  <div className="absolute bg-white shadow-lg rounded p-3 mt-1 z-10 w-48" ref={dropdownRef}>
                    {/* For transaction type column */}
                    {column.type === "transaction type" && (
                      <div className="flex flex-col">
                        {["Sale", "Purchase", "Payments-In", "Estimation","Credit Note", "Debit Note", "Delivery chalan", "Sale Order"].map((type) => (
                          <label key={type} className="flex items-center mb-1">
                            <input
                              type="radio"
                              name={`transaction-${column.key}`}
                              value={type}
                              checked={searchTerms[column.key] === type}
                              onChange={() => handleTransactionTypeChange(column.key, type)}
                              className="mr-2"
                            />
                            {type}
                          </label>
                        ))}
                        <button
                          onClick={() => resetTransactionTypeFilter(column.key)}
                          className="mt-2 text-blue-600 hover:underline"
                        >
                          Reset
                        </button>
                      </div>
                    )}

                    {/* For string columns */}
                    {column.type === "string" && (
                      <>
                        <select
                          value={searchOptions[column.key] || "contains"}
                          onChange={(e) =>
                            handleSearchOptionChange(column.key, e.target.value)
                          }
                          className="w-full mb-2 border border-gray-300 rounded p-1 text-sm focus:outline-none"
                        >
                          <option value="contains">Contains</option>
                          <option value="exact">Exact Match</option>
                        </select>
                        <input
                          type="text"
                          value={searchTerms[column.key] || ""}
                          onChange={(e) =>
                            handleSearchChange(column.key, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded p-1 text-sm focus:outline-none"
                          placeholder={`Search ${column.label}`}
                        />
                      </>
                    )}

                    {/* For numeric columns */}
                    {column.type === "number" && (
                      <>
                        <select
                          value={searchOptions[column.key] || "greater"}
                          onChange={(e) =>
                            handleSearchOptionChange(column.key, e.target.value)
                          }
                          className="w-full mb-2 border border-gray-300 rounded p-1 text-sm focus:outline-none"
                        >
                          <option value="greater">Greater Than</option>
                          <option value="equal">Equal To</option>
                          <option value="less">Less Than</option>
                        </select>
                        <input
                          type="number"
                          value={searchTerms[column.key] || ""}
                          onChange={(e) =>
                            handleSearchChange(column.key, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded p-1 text-sm focus:outline-none"
                          placeholder={`Enter value...`}
                        />
                      </>
                    )}
                    {console.log(column)}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className=" min-h-52 overflow-visible">
          {sortedData?.map((item, index) => (
            <tr key={index} className="border-t border-gray-200 relative">
              {columns.map((column) =>
                column.key === "DropDown" ? (
                  <td key={column.key}>
                    <Dropdown menuItems={item.menuItem}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 128 512"
                        className="w-4 h-4"
                      >
                        <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                      </svg>
                    </Dropdown>
                  </td>
                ) : (
                  <td key={column.key} className="px-4 py-2">
                    {item[column.key] instanceof Date
                      ? item[column.key].toLocaleDateString()
                      : item[column.key]}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;
