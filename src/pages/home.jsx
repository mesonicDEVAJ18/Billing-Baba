import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/sidebar";
import Dashboard from "./dashboard";
import { getUidFromLocalStorage } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Home({ children, part, subpart, data, setData }) {
  const [toggle, setToggle] = useState(false);
  const [help, sethelp] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const Navigate = useNavigate();
  useEffect(() => {
    let uid = getUidFromLocalStorage();
    // alert(uid);
    if (!uid) {
      Navigate("/landing");
    }
  }, []);
  const pages = [
    { name: "Home", to: "/" },
    { name: "Parties", to: "/" },
    { name: "Items", to: "/" },
    { name: "Quick Billing", to: "/" },
    { name: "Add Purchase", to: "/" },
    { name: "Add Purchase Order", to: "/" },
    { name: "Payment Out", to: "/" },
    { name: "Purchase Bill", to: "/" },
    { name: "Purchase Order", to: "/" },
    { name: "Purchase Return", to: "/" },
    { name: "Add Estimations", to: "/" },
    { name: "Add Payments", to: "/" },
    { name: "Add Sales", to: "/" },
    { name: "Add Sales Order", to: "/" },
    { name: "Delievery Chalan", to: "/" },
    { name: "Estimated Quortation", to: "/" },
    { name: "Payments In", to: "/" },
    { name: "Sales Invoice", to: "/" },
    { name: "Sales Order", to: "/" },
    { name: "Sales return", to: "/" },
    { name: "Add Expense", to: "/" },
    { name: "Add Items", to: "/" },
    { name: "Add Parties", to: "/" },
    { name: "Cash and Bank", to: "/" },
    { name: "Subscription Plan", to: "/" },
    { name: "Dashboard", to: "/" },
    { name: "E-way Bill", to: "/" },
    { name: "Expense", to: "/" },
    { name: "Settings", to: "/" },
    { name: "utils", to: "/" },
  ];
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        sethelp(false);
      }
    };

    if (help) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [help]);
  
  const dropdownRef2 = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setToggle(false)
      }
    };

    if (toggle) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggle]);

  return (
    <div id="Home">
      <Sidebar data={data} part={part} subpart={subpart} />
      <div className="body">
        <div id="nav">
          <div className="inp">
            <input
              type="text"
              className="searchbar"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
            />
            {searchTerm && (
              <ul>
                {pages
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item) => (
                    <li
                      key={item.itemCode}
                      onClick={() => {
                        Navigate(item.to);
                        setSearchTerm("");
                      }}
                    >
                      {item.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div className="relative" ref={dropdownRef}>

          <button onClick={()=>sethelp(!help)} className="text-nowrap font-semibold px-2 text-blue-400 hover:underline">Need Help?</button>
          {help && (
            <div className="absolute bg-white top-10 flex flex-col shadow-md -translate-x-[20%]">
              <span className="p-2 border border-gray-200 text-nowrap text-center hover:bg-gray-200">Schedule meeting</span>
              <span className="p-2 border border-gray-200 text-nowrap text-center hover:bg-gray-200">Send Email</span>
              <span className="p-2 border border-gray-200 text-nowrap text-center hover:bg-gray-200">Whatsapp</span>
              <span className="p-2 border border-gray-200 text-nowrap text-center hover:bg-gray-200">Live chat</span>
              <span className="p-2 border border-gray-200 text-nowrap text-center hover:bg-gray-200">Report Missing feature</span>
              <span className="p-2 border border-gray-200 text-nowrap text-center bg-gray-200">Ph: 7987016325</span>
              <span className="p-2 border border-gray-200 text-nowrap text-center bg-gray-200">email: billingbabaofficial@gmail.com</span>
              {/* <span className="p-2 border border-gray-200 text-nowrap text-center hover:bg-gray-200"><span className="font-xs">or contact</span></span> */}

            </div>
          )}
          </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="m-3 h-6 w-6 hover:fill-gray-500 hover:shadow-lg"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="m-3 h-6 w-6 hover:fill-gray-500 hover:shadow-lg"><path d="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm16 64l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm16 80l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80-176c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm16 80l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM160 336c0-8.8 7.2-16 16-16l224 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-224 0c-8.8 0-16-7.2-16-16l0-32zM272 128l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM256 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM368 128l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM352 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM464 128l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM448 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm16 80l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z"/></svg>
          <div className="flex items-center justify-center">
      {/* Sale Button */}

      <button className="px-4 py-2 bg-white pr-8  font-semibold rounded-l-full hover:bg-red-500 transition hover:text-white border-2 border-red-500" onClick={() => Navigate("/addsales")}>
        SALE
      </button>

      {/* Middle Blank Button */}
      <div className="relative">
      <button className="p-3 fill-white -translate-x-1/2 -translate-y-1/2  rounded-full bg-red-500 hover:bg-red-700 absolute" aria-label="Middle button" onClick={() => setToggle(!toggle)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 448 512"><path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288l111.5 0L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7l-111.5 0L349.4 44.6z"/></svg>
      </button>
      {toggle && (
      <div className="absolute p-3 rounded-lg flex justify-between items-start gap-2 top-7 shadow-xl -translate-x-[80%] bg-white lg:w-[600px]" ref={dropdownRef2}>
        <div>
          <h1 className="font-semibold mb-2 ">SALE</h1>
        <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("/sale-invoice")}>Sale invoice</button>
        <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("/payment-in")}>Payments In</button>
        <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("/sales-return")}>Sale Return</button>
        <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("/sales-order")}>Sale Order</button>
        <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("/estimation")}>Estimate/Quotation</button>
        <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("/delivery-chalan")}>Delivery chalan</button>
        </div>
        <div>
        <h1 className="font-semibold mb-2">PURCHASE</h1>
        <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("/purchase-bill")}>Purchase Bill</button>
        <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("/payment-outs")}>Payment-out</button>
        <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("/purchase-return")}>Purchase Return</button>
        <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("/purchase-order")}>Purchase Order</button>
        </div>
        <div>
          <h1 className="font-semibold mb-2">OTHERS</h1>
        <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("expenses")}>Expenses</button>
        <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("/")}>Other Income</button>
        {/* <button className="block p-3 hover:border-b hover:text-blue-500 border-blue-500" onClick={() => Navigate("/quick-billing")}>Party To Party Transfer</button> */}
        </div>
      </div>
      )}
      </div>


      {/* Purchase Button */}
      <button className="px-4 py-2 bg-white pl-8 text-black border-2 border-red-500 font-semibold transition rounded-r-full hover:bg-red-500 hover:text-white" onClick={() => Navigate("/addPurchase")}>
        PURCHASE
      </button>
    </div>
          {/* <button className="addMore" onClick={() => setToggle(!toggle)}>
            Add More <span>{"+"}</span>
            <div className={toggle ? "drop active" : "drop"}>
              <button onClick={() => Navigate("/addsales")}>Add Sales</button>
              <button onClick={() => Navigate("/addpurchase")}>
                Add Purchase
              </button>
              <button onClick={() => Navigate("/AddParties")}>
                Add Parties
              </button>
              <button onClick={() => Navigate("/add-items")}>Add Items</button>
              <button onClick={() => Navigate("/add-sales-order")}>
                Add Sales Orders
              </button>
              <button onClick={() => Navigate("/add-purchase-order")}>
                Add Purchase Orders
              </button>
              <button onClick={() => Navigate("/quick-billing")}>
                Quick Billing
              </button>
              {/* <div className="l">

              </div>
              <div className="r">
                <button>-</button>
                <button>-</button>
              </div>
            </div>
          </button> */}
        </div>
        {children}
        {/* <Dashboard /> */}
      </div>
    </div>
  );
}
