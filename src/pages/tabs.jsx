import React, { useState } from "react";
import QuickBilling from "./QuickBilling";
import { useNavigate } from "react-router-dom";

const Tabs = ({ data, setData, change, setChange }) => {
  const Navigate = useNavigate();
  const [tabs, setTabs] = useState([{ id: 1, isOpen: true }]);
  const [tabIndex, setTabIndex] = useState(1);

  const addTab = () => {
    const newTabId = tabIndex + 1;
    if (tabs.length > 10) return;
    setTabIndex(tabIndex + 1);
    setTabs([...tabs, { id: newTabId }]);
  };

  const closeTab = (tabId) => {
    setTabs(tabs.filter((tab) => tab.id !== tabId));
  };

  const handleTabClick = (tabId) => {
    setTabs(
      tabs.map((tab) => ({
        ...tab,
        isOpen: tab.id === tabId ? true : false,
      }))
    );
  };

  return (
    <div className="tabs">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab min-w-100 flex justify-between items-center ${
              tab.isOpen ? "open" : "tab"
            }`}
          >
            <button onClick={() => handleTabClick(tab.id)}>#{tab.id}</button>
            <span className="flex text-xs gap-1 items-center text-gray-500 ml-2">
              {tab.isOpen && tabs.length > 1 && "[alt + w]"}
              {tabs.length > 1 && (
                <button onClick={() => closeTab(tab.id)} className="">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </button>
              )}
            </span>
          </div>
        ))}
        {tabs.length < 10 && (
          <button
            onClick={addTab}
            className="addTb flex text-xs gap-2 text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
            <span>New Bill [alt + T]</span>
          </button>
        )}
        <button onClick={() => Navigate("/")} className="quit">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>
      {/* <div className="tabs-content"> */}
      {tabs.map((tab) => (
        <div
          className="tab-content"
          key={tab.id}
          style={{ display: tab.isOpen ? "block" : "none" }}
        >
          <QuickBilling
            key={tab.id}
            data={data}
            setData={setData}
            change={change}
            setChange={setChange}
          />
        </div>
      ))}
      {/* </div> */}
    </div>
  );
};

export default Tabs;
