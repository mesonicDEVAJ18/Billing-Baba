import React, { useState, useRef, useEffect } from "react";

import ReactDOM from 'react-dom';

function Dropdown({
  children,
  menuItems,
  isLabelOnly = false,
  callback = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    if (!isLabelOnly && item.action) {
      item.action();
      setIsOpen(false); // Close the dropdown after selecting an item if action is performed
    }
  };

  const handleDocumentClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownButtonRef = useRef(null);


  useEffect(() => {
    if (isOpen && dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,  // Account for scrolling
        left: rect.left + window.scrollX,   // Account for scrolling
      });
    }
  }, [isOpen]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="dropdown-button" onClick={handleToggle} ref={dropdownButtonRef}>
        {children}
      </button>
      {isOpen && (
        ReactDOM.createPortal(
        <ul className="dropdownMenu"
        style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px`, position: 'absolute', zIndex: 9999 }}
        >
          {menuItems?.map((item, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(item)}
              className={isLabelOnly ? "label-only" : ""}
            >
              {item.label ? item.label : item}{" "}
              {/* Display the label of the item */}
            </li>
          ))}
        </ul>,
          document.body // Attach the dropdown menu to the body
        )
      )}
    </div>
  );
}

export default Dropdown;
