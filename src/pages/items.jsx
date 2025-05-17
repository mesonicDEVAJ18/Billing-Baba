import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/customInput";
import Dropdown from "../components/dropdown";
import StockAdjust from "../components/stock_Adjustment";
import Loader from "./Loader";
import EditItem from "./editItem";
import SortableTable from "../components/Tables";

export default function Items({ data, setData, change, setChange }) {
  const params = new URLSearchParams(window.location.search);
  let urlPram = params.get("data");

  const divRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setSearch(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  var [Category, setCategory] = useState();
  var [Units, setUnits] = useState();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  useEffect(() => {
    if (urlPram == "addUnit") {
      setPage("unit");
      setUnits(true);
    } else if (urlPram == "addCategory") {
      setPage("category");
      setCategory(!Category);
    }
    if (data && !data.UnitUpdate) {
      const units = [
        { name: "BAGS", shorthand: "Bag" },
        { name: "BOTTLES", shorthand: "Btl" },
        { name: "BOX", shorthand: "Box" },
        { name: "BUNDLES", shorthand: "Bdl" },
        { name: "CANS", shorthand: "Can" },
        { name: "CARTONS", shorthand: "Ctn" },
        { name: "DOZENS", shorthand: "Dzn" },
        { name: "GRAMMES", shorthand: "Gm" },
        { name: "KILOGRAMS", shorthand: "Kg" },
        { name: "LITRE", shorthand: "Ltr" },
        { name: "METERS", shorthand: "Mtr" },
        { name: "MILLILITRE", shorthand: "Ml" },
        { name: "NUMBERS", shorthand: "Nos" },
        { name: "PACKS", shorthand: "Pac" },
        { name: "PAIRS", shorthand: "Prs" },
        { name: "PIECES", shorthand: "Pcs" },
        { name: "QUINTAL", shorthand: "Qtl" },
        { name: "ROLLS", shorthand: "Rol" },
        { name: "SQUARE FEET", shorthand: "Sqf" },
        { name: "SQUARE METERS", shorthand: "Sqm" },
        { name: "TABLETS", shorthand: "Tbs" },
      ];
      let TData = data;

      console.log(TData);
      if (!TData.units) TData.units = units;
      else TData.units = [...TData?.units, ...units];
      TData.UnitUpdate = true;
      setData({ ...TData });
      setChange(!change);
    }
  }, []);

  var [page, setPage] = useState("product");
  var [page2, setPage2] = useState("");
  var [StockPage, setStockPage] = useState(false);

  const [search, setSearch] = useState(false);
  const [SearchQuerry, setSearchQuerry] = useState("");

  const Navigate = useNavigate();


  const [impPtDrp, setimpPtDrp] = useState(false);

  const [selecteditems, setSelectedItems] = useState(null);
  const [selectedunits, setSelectedUnits] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  var [EditIndex, setEditIndex] = useState(-1);

  var [unitName, setUnitName] = useState("");
  var [unitShorthand, setUnitShorthand] = useState("");

  var [addCategory, setAddCategory] = useState("");
  var [unitConv, setUnitConv] = useState({
    open: false,
    unit1: null,
    unit2: null,
    rate: null,
  });

  const addthings = async () => {
    let newDa = data;

    if (page === "category") {
      newDa.category
        ? newDa.category.push({ name: addCategory })
        : (newDa.category = [{ name: addCategory }]);
      console.log(newDa);
      setData(newDa);
      setAddCategory("");
    } else if (page === "unit") {
      newDa.units
        ? newDa.units.push({ name: unitName, shortHand: unitShorthand })
        : (newDa.units = [{ name: unitName, shortHand: unitShorthand }]);
      console.log(newDa);
      setData(newDa);
      setUnits(false);
      setUnitName("");
      setUnitShorthand("");
    }
    setChange(!change);
    setCategory(false);
  };

  let [sortedArray, setSortedArray] = useState([]);
  let [sortbase, setSortBase] = useState({ name: "", stage: 0 });

  let sortFunction = (array, key, type = "number") => {
    if (sortbase.name === key) {
      if (sortbase.stage >= 1) {
        setSortedArray(array);
        setSortBase({ stage: 0, name: "" });
        return;
      }
      if (type === "string") {
        setSortedArray(
          array.sort((a, b) => a[key]?.localeCompare(b[key])).reverse()
        );
      } else {
        setSortedArray(array.sort((a, b) => a[key] - b[key]).reverse());
      }
      setSortBase({ ...sortbase, stage: 1 });
      return;
    } else {
      if (type === "string") {
        setSortedArray(array.sort((a, b) => a[key]?.localeCompare(b[key])));
      } else {
        setSortedArray(array.sort((a, b) => a[key] - b[key]));
      }
      setSortBase({ stage: 0, name: key });
      return;
    }
  };

  let [DataArr, setDataArr] = useState([]);

  useEffect(() => {
    console.log("hit");
    if (selecteditems) {
      let arr = [...data?.sales, ...data?.purchase].filter((item) => {
        return item.items.some((term) => term.item === selecteditems.Name);
      });
      console.log(arr);
      setDataArr(arr);
    }
  }, [selecteditems]);

  var columns;
  var sendingArray;
  if (page === "product") {
    columns = [
      { key: "type", label: "Type",type:"transaction type" },
      { key: "invoice_number", label: "Invoice Number",type:"number" },
      { key: "name", label: "Name",type:"string" },
      { key: "invoice_date", label: "Invoice Date",type:"string" },
      { key: "length", label: "Length",type:"number" },
      { key: "total", label: "Total",type:"number" },
      { key: "paymentType", label: "Pending",type:"number" },
      { key: "DropDown", label: "-" },
    ];
    if (selecteditems) {
      sendingArray = data?.Transactions?.map((item, originalIndex) => ({ ...item, originalIndex })).filter((item) =>
        item.items?.some((term) => term.item === selecteditems.Name)
      ).map((ele, index) => {
        return {
          ...ele,
          invoice_date: new Date(ele.invoice_date).toLocaleDateString(),
          length: ele.items?.length,
          paymentTope: ele.payment_type === "credit" ? "Unpaid" : "Paid",
          menuItem: [
            { label: "View Invoice" },
            { label: "recieve payment" },
            { label: "View/Edit", action: () => Navigate(`/add-sale/${ele.originalIndex}`) },
            { label: "cancel" },
            { label: "Delete", action: () =>{
              console.log(data.Transactions)
              let da = {...data, Transactions: data.Transactions.filter((item, index) => index !== ele.originalIndex)}
              console.log(da.Transactions)
              setData(da) 
            } 
          },
            { label: "Duplicate" },
            { label: "Print" },
          ],
        };
      });
    }
  }
  else if (page === "service") {
    columns = [
      { key: "type", label: "Type",type:"transaction type"  },
      { key: "invoice_number", label: "Invoice/Ref",type:"string" },
      { key: "name", label: "Name" ,type:"string"},
      { key: "invoice_date", label: "Date",type:"string" },
      { key: "length", label: "Length",type:"number"},
      { key: "total", label: "Price" ,type:"number"},
      { key: "totalProfit", label: "Profit" ,type:"number"},
      // { key: "DropDown", label: "-" },
    ];
    if (selecteditems) {
      sendingArray = data?.Transactions?.filter((item) =>
        item.items?.some((term) => term.item === selecteditems.Name)
      ).map((ele) => {
        return {
          ...ele,
          invoice_date: new Date(ele.invoice_date).toLocaleDateString(),
          length: ele.items?.length,
          paymentTope: ele.payment_type === "credit" ? "Unpaid" : "Paid",
          // menuItem: [
          //   { label: "print" },
          //   { label: "forward" },
          //   { label: "generate Invoice" },
          //   { label: "recieve payment" },
          //   { label: "View/Edit" },
          //   { label: "cancel" },
          //   { label: "Delete" },
          //   { label: "Duplicate" },
          //   { label: "Print" },
          // ],
        };
      });
    }
  }
  else if (page === "category") {
    columns = [
      { key: "name", label: "Name",type:"string" },
      { key: "stock", label: "Quantity" ,type:"number"},
      { key: "value", label: "Stock Value" ,type:"number"},
    ];
    if (selecteditems) {
      sendingArray = data?.items
      ?.filter((item) =>
        item.Category.toLowerCase()
          .split(" ")
          .every((word) =>
            selectedCategory.name.toLowerCase().includes(word)
          )
      )
      .map((item, index) => {
        return {
          ...item,
          stock: item.stock? item.stock : "not set",
          value:item.stock
          ? item.stock * parseInt(item.purchasePrice)
          : "not set",
        };
      });
    }
  }

  if (EditIndex !== -1){
    return (
      <EditItem
        data={data}
        setData={setData}
        change={change}
        setChange={setChange}
        Index={EditIndex}
        setClose={setEditIndex}
      />
    );
  }
    
  // Sorting in left sidebar - items

  const sortItems = (items) => {
    if (sortConfig.key) {
      return [...items].sort((a, b) => {
        if (sortConfig.key === "Name") {
          if (a.Name?.toLowerCase() < b.Name?.toLowerCase())
            return sortConfig.direction === "ascending" ? -1 : 1;
          if (a.Name?.toLowerCase() > b.Name?.toLowerCase())
            return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        } else if (sortConfig.key === "stock") {
          return sortConfig.direction === "ascending"
            ? (a.stock || 0) - (b.stock || 0)
            : (b.stock || 0) - (a.stock || 0);
        }
        return 0;
      });
    }
    return items;
  };

  const toggleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      direction = null; // Reset sorting
    }
    setSortConfig({ key: direction ? key : null, direction });
  };

  const sortedItems = sortItems(
    data?.items.map((item, originalIndex) => ({ ...item, originalIndex }))
  );

  return (
    <div id="items">
      <div className="topbar">
        <button
          className={page === "product" ? "selected" : ""}
          onClick={() => {
            setPage("product");
            setSearch(false);
            setSelectedItems();
          }}
        >
          Product
        </button>
        <button
          className={page === "service" ? "selected" : ""}
          onClick={() => {
            setPage("service");
            setSearch(false)
            setSelectedItems();
          }}
        >
          Services
        </button>
        <button
          className={page === "category" ? "selected" : ""}
          onClick={() => {
            setPage("category");
            setSelectedItems();
          }}
        >
          Category
        </button>
        <button
          className={page === "unit" ? "selected" : ""}
          onClick={() => {
            setPage("unit");
            setSearch(false)
            setSelectedItems();
          }}
        >
          Unit
        </button>
      </div>
      {page === "product" && (
        <div className="items">
          <div className="left">
            {search ? (
              <div className="flex p-2 relative" ref={divRef} >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-[20px]  mx-2"
                >
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
                <input
                  type="text"
                  name=""
                  id=""
                  value={SearchQuerry}
                  onChange={(e) => setSearchQuerry(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-gray-700"
                />
                <button onClick={() => setSearch(!search)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    className="w-[20px] mx-2"
                  >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="top">
                <div className="bg-orange-400 rounded-md px-2 py-1 rounded-md text-white fill-white text-sm">
                <button onClick={() => Navigate("/add-items")}>
                  Add Item +
                </button>
                  <button
                    className="relative"
                    onClick={() => setimpPtDrp(!impPtDrp)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                    </svg>
                    {impPtDrp && (
                      <button
                        className="absolute top-[20px] font-semibold left-0 p-2 bg-slate-200 text-black w-[180px] rounded-md shadow-md text-white no-wrap"
                        onClick={() => Navigate("/import-items")}
                      >
                        Import items
                      </button>
                    )}
                  </button>
                </div>
                
                <div className="">
                  <div className="" onClick={() => setSearch(!search)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                  </div>
                  <Dropdown
                    menuItems={[
                      {
                        label: "Bulk inactive",
                        action: () => setPage2("BInactive"),
                      },
                      {
                        label: "Bulk Active",
                        action: () => setPage2("BActive"),
                      },
                      {
                        label: "Bulk Assign Code",
                        action: () => setPage2("BCodes"),
                      },
                      {
                        label: "Assign Units",
                        action: () => setPage2("BUnits"),
                      },
                      {
                        label: "Bulk Update Items",
                        action: () => {
                          Navigate("/bulk-update-items");
                        },
                      },
                    ]}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 128 512"
                    >
                      <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                    </svg>
                  </Dropdown>
                </div>
              </div>
            )}
            <div className="content">
              <div className="head">
                <h2 onClick={() => toggleSort("Name")}>
                  Items{" "}
                  {sortConfig.key === "Name" &&
                    (sortConfig.direction === "ascending"
                      ? "↑"
                      : sortConfig.direction === "descending"
                      ? "↓"
                      : "")}
                </h2>
                <h2 onClick={() => toggleSort("stock")}>
                  Quantity{" "}
                  {sortConfig.key === "stock" &&
                    (sortConfig.direction === "ascending"
                      ? "↑"
                      : sortConfig.direction === "descending"
                      ? "↓"
                      : "")}
                </h2>
              </div>

              {SearchQuerry && search
                ? sortedItems
                    ?.filter((item) => item.itemType !== "service")
                    ?.filter((e) =>
                      SearchQuerry.toLowerCase()
                        .split(" ")
                        .every((word) => e.Name.toLowerCase().includes(word))
                    )
                    .map((item, index) => (
                      <div
                        className={`tile ${
                          selecteditems === item ? "selected" : ""
                        }`}
                        key={index}
                        onClick={() => setSelectedItems(item)}
                      >
                        <h1>{item.Name}</h1>
                        <h2 className="hovEle">{item.Name} - {item.stock}</h2>
                        <div className="">
                          <p>
                            {item.stock ? item.stock : item.openingQty || 0}
                          </p>
                          <Dropdown
                            menuItems={[
                              {
                                label: "View/Edit",
                                action: () => setEditIndex(item.originalIndex),
                              },
                              {
                                label: "Delete",
                                action: () => {
                                  let newDa = {
                                    ...data,
                                    items: data.items.filter(
                                      (_, i) => i !== item.originalIndex
                                    ),
                                  };
                                  setData(newDa);
                                  setChange(!change);
                                },
                              },
                            ]}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 128 512"
                            >
                              <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                            </svg>
                          </Dropdown>
                        </div>
                      </div>
                    ))
                : sortedItems
                    ?.filter((item) => item.itemType !== "service")
                    .map((item, index) => (
                      <div
                        className={`tile relative ${
                          selecteditems === item ? "selected" : ""
                        }`}
                        key={index}
                        onClick={() => setSelectedItems(item)}
                      >
                        <h1>{item.Name}</h1>
                        <h2 className="hovEle">{item.Name} - {item.stock}</h2>
                        <div className="">
                          <p>
                            {item.stock ? item.stock : item.openingQty || 0}
                          </p>
                          <Dropdown
                            menuItems={[
                              {
                                label: "View/Edit",
                                action: () => setEditIndex(item.originalIndex),
                              },
                              {
                                label: "Delete",
                                action: () => {
                                  let newDa = {
                                    ...data,
                                    items: data.items.filter(
                                      (_, i) => i !== item.originalIndex
                                    ),
                                  };
                                  setData(newDa);
                                  setChange(!change);
                                },
                              },
                            ]}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 128 512"
                            >
                              <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                            </svg>
                          </Dropdown>
                        </div>
                      </div>
                    ))}
            </div>
          </div>
          {page2 === "BInactive" && (
            <BulkInactive
              data={data}
              setData={setData}
              change={change}
              setChange={setChange}
              setClose={setPage2}
            />
          )}
          {page2 === "BActive" && (
            <BulkActive
              data={data}
              setData={setData}
              change={change}
              setChange={setChange}
              setClose={setPage2}
            />
          )}
          {page2 === "BCodes" && (
            <BulkItemCode
              data={data}
              setData={setData}
              change={change}
              setChange={setChange}
              setClose={setPage2}
            />
          )}
          <div className="right">
            {selecteditems ? (
              <div className="rounded-md bg-gray-100 mb-2 p-3">
                <div className="w-full flex justify-between mb-2">
                  <h1 className="text-xl font-semibold flex justify-between items-center w-full">
                    {selecteditems.Name}
                  </h1>
                  <button
                    className="text-sm bg-blue-400  text-nowrap  rounded-full text-white font-semibold px-3 py-1"
                    onClick={() => setStockPage(!StockPage)}
                  >
                    + Adujust Items
                  </button>
                  {StockPage && <StockAdjust setClose={setStockPage} />}
                </div>

                <div className="w-full flex justify-between my-2">
                  <p className="">
                    SALE PRICE{" "}
                    <span className="font-semibold">
                      {" "}
                      ₹ {selecteditems ? selecteditems.salesPrice : "Null"}
                    </span>
                  </p>
                  <p>
                    Stock Qty:{" "}
                    <span className="font-semibold text-red-400">
                      {" "}
                      {selecteditems ? selecteditems.stock : "-"}
                    </span>
                  </p>
                </div>
                <div className="w-full flex justify-between mt-2">
                  <p>
                    PURCHASE PRICE{" "}
                    <span className="font-semibold">
                      {" "}
                      ₹ {selecteditems ? selecteditems.purchasePrice : "-"}
                    </span>
                  </p>
                  <p className="hover:text-blue-400 flex items-center gap-2">
                  <span>Share </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4"><path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"/></svg>
                  </p>
                </div>
              </div>
            ) : (
              <div className="title">
                <div className="tile">
                  <h1>No Item Selected</h1>
                </div>
              </div>
            )}
            {selecteditems && (
              // <div className="content">
              //   <div className="t">
              //     <h1>TRANSACTIONS</h1>
              //     <div className="search">
              //       <svg
              //         xmlns="http://www.w3.org/2000/svg"
              //         viewBox="0 0 512 512"
              //       >
              //         <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              //       </svg>
              //       <input autoComplete="off" type="" />
              //     </div>
              //   </div>
              //   <div className="cl top">
              //     <p>Type</p>
              //     <p>Invoice/Ref</p>
              //     <p
              //       className="hover:underline"
              //       onClick={() => sortFunction(data.sales, "name", "string")}
              //     >
              //       Name
              //     </p>
              //     <p>Date</p>
              //     <p>Quantity</p>
              //     <p
              //       className="hover:underline"
              //       onClick={() => sortFunction(data.sales, "total")}
              //     >
              //       Price
              //     </p>
              //     <p>Status</p>
              //   </div>
              //   {sortedArray?.length >= 1
              //     ? sortedArray
              //         .filter((item) => {
              //           return item.items.some(
              //             (term) => term.item === selecteditems.Name
              //           );
              //         })
              //         .map((sale, index) => (
              //           <div className="cl" key={index}>
              //             <p className="grey">{sale.type}</p>
              //             {/* <p className="grey">{sale.payment_type}</p> */}
              //             <p className="grey">{sale.invoice_number}</p>
              //             <p className="grey">{sale.name}</p>
              //             <p className="">{sale.invoice_date}</p>
              //             <p className="grey">{sale.items?.length}</p>
              //             <p className="grey">{sale.total}</p>
              //             <p className="">
              //               {sale.payment_type === "credit" ? "Unpaid" : "Paid"}
              //             </p>
              //           </div>
              //         ))
              //     : DataArr.map((sale, index) => (
              //         <div className="cl" key={index}>
              //           <p className="grey">{sale.type}</p>
              //           {/* <p className="grey">{sale.payment_type}</p> */}
              //           <p className="grey">{sale.invoice_number}</p>
              //           <p className="grey">{sale.name}</p>
              //           <p className="">{sale.invoice_date}</p>
              //           <p className="grey">{sale.items?.length}</p>
              //           <p className="grey">{sale.total}</p>
              //           <p className="">
              //             {sale.payment_type === "credit" ? "Unpaid" : "Paid"}
              //           </p>
              //         </div>
              //       ))}
              // </div>
              <div className="">
                <div className="flex justify-between p-4 rounded-md bg-gray-100 items-center">
                  <h1>TRANSACTIONS</h1>
                  <div className="flex gap-2">
                    <div className="flex border border-gray-700 rounded-full px-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                      <input autoComplete="off" type="" className="bg-transparent" />
                    </div>
                  </div>
                </div>

                <SortableTable data={sendingArray} columns={columns} />
              </div>
            )}
          </div>
        </div>
      )}
      {page === "service" && (
        <>
          {data?.items?.some((item) => item.itemType === "service") ? (
            <div className="items">
              <div className="left">
                {search ? (
                  <div className="flex p-2 relative" ref={divRef} >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-[20px]  mx-2"
                    >
                      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                    <input
                      type="text"
                      name=""
                      id=""
                      value={SearchQuerry}
                      onChange={(e) => setSearchQuerry(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-gray-700"
                    />
                    <button onClick={() => setSearch(!search)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                        className="w-[20px] mx-2"
                      >
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="top">
                    <div  className="bg-orange-400 rounded-md px-2 py-1 rounded-md text-white fill-white text-sm">

                    <button
                      onClick={() => Navigate("/add-items?data=services")}
                    >
                      Add Service +
                    </button>
</div>
                    <div className="">
                      <div className="" onClick={() => setSearch(!search)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                        </svg>
                      </div>
                      <Dropdown
                        menuItems={[
                          {
                            label: "Bulk inactive",
                            action: () => setPage2("BInactive"),
                          },
                          {
                            label: "Bulk Active",
                            action: () => setPage2("BActive"),
                          },
                          {
                            label: "Bulk Assign Code",
                            action: () => setPage2("BCodes"),
                          },
                          {
                            label: "Assign Units",
                            action: () => setPage2("BUnits"),
                          },
                          {
                            label: "Bulk Update Items",
                            action: () => {
                              Navigate("/bulk-update-items");
                            },
                          },
                        ]}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 128 512"
                        >
                          <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                        </svg>
                      </Dropdown>
                    </div>
                  </div>
                )}
                <div className="content">
                  <div className="head">
                    <h2>Items</h2>
                  </div>
                  {SearchQuerry && search
                    ? data?.items
                        .map((item, originalIndex) => ({
                          ...item,
                          originalIndex,
                        }))
                        ?.filter((item) => item.itemType === "service")
                        ?.filter(
                          (e) =>
                            SearchQuerry.toLowerCase()
                              .split(" ")
                              .every((word) =>
                                e.Name.toLowerCase().includes(word)
                              )
                          // e.partyName.toLowerCase().includes(SearchQuerry.toLowerCase())
                        )
                        .map((item, index) => (
                          <div
                            className={`tile ${
                              selecteditems === item ? "selected" : ""
                            }`}
                            key={index}
                            onClick={() => setSelectedItems(item)}
                          >
                            <h1>{item.Name}</h1>
                            <div className="">
                              <Dropdown
                                menuItems={[
                                  {
                                    label: "View/Edit",
                                    action: () =>
                                      setEditIndex(item.originalIndex),
                                  },
                                  {
                                    label: "Delete",
                                    action: () => {
                                      let newDa = {
                                        ...data,
                                        items: data.items.filter(
                                          (_, i) => i !== item.originalIndex
                                        ),
                                      };
                                      setData(newDa);
                                      setChange(!change);
                                    },
                                  },
                                ]}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 128 512"
                                >
                                  <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                                </svg>
                              </Dropdown>
                            </div>
                          </div>
                        ))
                    : data?.items
                        .map((item, originalIndex) => ({
                          ...item,
                          originalIndex,
                        }))
                        ?.filter((item) => item.itemType === "service")
                        .map((item, index) => (
                          <div
                            className={`tile ${
                              selecteditems === item ? "selected" : ""
                            }`}
                            key={index}
                            onClick={() => setSelectedItems(item)}
                          >
                            <h1>{item.Name}</h1>
                            <div className="">
                              <Dropdown
                                menuItems={[
                                  {
                                    label: "View/Edit",
                                    action: () =>
                                      setEditIndex(item.originalIndex),
                                  },
                                  {
                                    label: "Delete",
                                    action: () => {
                                      let newDa = {
                                        ...data,
                                        items: data.items.filter(
                                          (_, i) => i !== item.originalIndex
                                        ),
                                      };
                                      setData(newDa);
                                      setChange(!change);
                                    },
                                  },
                                ]}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 128 512"
                                >
                                  <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                                </svg>
                              </Dropdown>
                            </div>
                          </div>
                        ))}
                </div>
              </div>
              <div className="right">
                <div className="title">
                  <div className="tile">
                    <h1>
                      {selecteditems ? selecteditems.Name : "No Item Selected"}
                    </h1>
                    <button onClick={() => setStockPage(!StockPage)}>
                      + Adujust Items
                    </button>
                    {StockPage && <StockAdjust setClose={setStockPage} />}
                  </div>

                  {selecteditems && (
                    <div className="tile">
                      <p>
                        SALE PRICE{" "}
                        <span>
                          {" "}
                          ₹{" "}
                          {selecteditems
                            ? selecteditems.salesPrice.value
                            : "Null"}
                        </span>
                        (excl)
                      </p>
                    </div>
                  )}
                </div>
                {selecteditems && (
                  <div className="">
                  <div className="flex justify-between p-4 rounded-md bg-gray-100 items-center">
                    <h1>TRANSACTIONS</h1>
                    <div className="flex gap-2">
                      <div className="flex border border-gray-700 rounded-full px-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                        </svg>
                        <input autoComplete="off" type="" className="bg-transparent" />
                      </div>
                    </div>
                  </div>
  
                  <SortableTable data={sendingArray} columns={columns} />
                </div>
                )}
              </div>
            </div>
          ) : (
            <div className="service">
              <img src="./assets/itemService.png" alt="" />
              <p>
                Add services to your customers and create sale invoices for them
                faster.
              </p>
              <button onClick={() => Navigate("/add-items?data=services")}>
                Add Your Services
              </button>
            </div>
          )}
        </>
      )}
      {page === "category" && (
        <div className="items category">
          <div className="left">
            {search ? (
              <div className="flex p-2 relative" ref={divRef} >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-[20px]  mx-2"
                >
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
                <input
                  type="text"
                  name=""
                  id=""
                  value={SearchQuerry}
                  onChange={(e) => setSearchQuerry(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-gray-700"
                />
                <button onClick={() => setSearch(!search)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    className="w-[20px] mx-2"
                  >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="top">
                <div  className="bg-orange-400 rounded-md px-2 py-1 rounded-md text-white fill-white text-sm">
                <button onClick={() => setCategory(!Category)}>
                  Add Category +
                </button>
                </div>
                <div className="">
                  <div className="" onClick={() => setSearch(!search)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                  </div>
                </div>
                {Category && (
                  <div id="ItemCategory">
                    <div className="center">
                      <div className="t">
                        <h1>Add Category</h1>
                        <button onClick={() => setCategory(!Category)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                          >
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                          </svg>
                        </button>
                      </div>
                      <div className="m">
                        <span>Enter Category Name</span>
                        <input
                          type="text"
                          value={addCategory}
                          onChange={(e) => setAddCategory(e.target.value)}
                          placeholder="eg. Grocery"
                        />
                        <button onClick={() => addthings()}>Create</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="content">
              <div className="head">
                <h2>CATEGORY NAME</h2>
                {/* <h2>In Short</h2> */}
              </div>
              {SearchQuerry && search
                ? data?.category
                    ?.filter(
                      (e) =>
                        SearchQuerry.toLowerCase()
                          .split(" ")
                          .every((word) => e.name.toLowerCase().includes(word))
                      // e.partyName.toLowerCase().includes(SearchQuerry.toLowerCase())
                    )
                    .map((item, index) => (
                      <div
                        className={`tile ${
                          selectedCategory === item ? "selected" : ""
                        }`}
                        key={index}
                        onClick={() => setSelectedCategory(item)}
                      >
                        <h1>{item.name}</h1>
                        <div className="">
                          {/* <p>{item.name || "-"}</p> */}
                          <Dropdown menuItems={["View/Edit", "Delete"]}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 128 512"
                            >
                              <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                            </svg>
                          </Dropdown>
                        </div>
                      </div>
                    ))
                : data?.category?.map((item, index) => (
                    <div
                      className={`tile ${
                        selectedCategory === item ? "selected" : ""
                      }`}
                      key={index}
                      onClick={() => setSelectedCategory(item)}
                    >
                      <h1>{item.name}</h1>
                      <div className="">
                        {/* <p>{item.name || "-"}</p> */}
                        <Dropdown menuItems={["View/Edit", "Delete"]}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 128 512"
                          >
                            <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                          </svg>
                        </Dropdown>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          {page2 === "moveCat" && (
            <MoveToGroup
              data={data}
              setData={setData}
              change={change}
              category={selectedCategory}
              setChange={setChange}
              setClose={setPage2}
            />
          )}
          <div className="right">
            <div className="bg-gray-100 rounded-md p-3 w-full mb-2">
              <div className="flex justify-between w-full items-center">
                <h1 className="text-xl font-semibold ">
                  {selectedCategory?.name || "no name selected"}
                </h1>
                {selectedCategory && (
                  <button
                    className="py-1 px-2 rounded-lg bg-blue-500 text-white font-semibold"
                    onClick={() => setPage2("moveCat")}
                  >
                    Move to this category
                  </button>
                )}
              </div>
            </div>
            {selectedCategory && (
              // <div className="content">
              //   <div className="t">
              //     <h1>Transactions</h1>
              //     <div className="search">
              //       <svg
              //         xmlns="http://www.w3.org/2000/svg"
              //         viewBox="0 0 512 512"
              //       >
              //         <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              //       </svg>
              //       <input autoComplete="off" type="" />
              //     </div>
              //   </div>
              //   <div className="cl top">
              //     <p>Name</p>
              //     <p>Quantity</p>
              //     <p>Stock Value</p>
              //   </div>
              //   {data?.items
              //     ?.filter((item) =>
              //       item.Category.toLowerCase()
              //         .split(" ")
              //         .every((word) =>
              //           selectedCategory.name.toLowerCase().includes(word)
              //         )
              //     )
              //     .map((item, index) => (
              //       <div className="cl" key={index}>
              //         <p className="grey">{item.Name}</p>
              //         <p className="grey">
              //           {item.stock ? item.stock : "not set"}
              //         </p>
              //         <p className="grey">
              //           {item.stock
              //             ? item.stock * parseInt(item.purchasePrice)
              //             : "not set"}
              //         </p>
              //       </div>
              //     ))}
              //   {/* <div className="cl">
              //     <p className="grey">Gucci Watch</p>
              //     <p className="grey">2</p>
              //     <p className="grey">0.0</p>
              //   </div> */}
              // </div>
            <div className="">
                <div className="flex justify-between p-4 rounded-md bg-gray-100 items-center">
                  <h1>TRANSACTIONS</h1>
                  <div className="flex gap-2">
                    <div className="flex border border-gray-700 rounded-full px-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                      <input autoComplete="off" type="" className="bg-transparent" />
                    </div>
                  </div>
                </div>

                <SortableTable data={sendingArray} columns={columns} />
              </div>
            )}
          </div>
        </div>
      )}
      {page === "unit" && (
        <div className="items unit">
          <div className="left">
            {search ? (
              <div className="flex p-2 relative" ref={divRef} > 
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-[20px]  mx-2"
                >
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
                <input
                  type="text"
                  name=""
                  id=""
                  value={SearchQuerry}
                  onChange={(e) => setSearchQuerry(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-gray-700"
                />
                <button onClick={() => setSearch(!search)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    className="w-[20px] mx-2"
                  >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="top">
                <div  className="bg-orange-400 rounded-md px-2 py-1 rounded-md text-white fill-white text-sm">
                <button onClick={() => setUnits(!Units)}>Add Units +</button>
                </div>
                <div className="" onClick={() => setSearch(!search)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                  </svg>
                </div>
                {Units && (
                  <div id="ItemCategory">
                    <div className="center">
                      <div className="t">
                        <h1>New Units</h1>
                        <button onClick={() => setUnits(!Units)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                          >
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                          </svg>
                        </button>
                      </div>
                      <div className="m">
                        <CustomInput
                          inputValue={unitName}
                          setInputValue={setUnitName}
                          placeholder={"Unit Name"}
                        />
                        <CustomInput
                          inputValue={unitShorthand}
                          setInputValue={setUnitShorthand}
                          placeholder={"Short Name"}
                        />
                        <button onClick={() => addthings()}>Save</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="content">
              <div className="head">
                <h2>FULLNAME</h2>
                <h2>SHORTNAME</h2>
              </div>
              {SearchQuerry && search
                ? data?.units
                    ?.filter(
                      (e) =>
                        SearchQuerry.toLowerCase()
                          .split(" ")
                          .every((word) => e.name.toLowerCase().includes(word))
                      // e.partyName.toLowerCase().includes(SearchQuerry.toLowerCase())
                    )
                    .map((item, index) => (
                      <div
                        className={`tile ${
                          selectedunits === item ? "selected" : ""
                        }`}
                        key={index}
                        onClick={() => setSelectedUnits(item)}
                      >
                        <h1>{item.name}</h1>
                        <div className="">
                          <p>{item.shorthand || "-"}</p>
                          <Dropdown menuItems={["View/Edit", "Delete"]}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 128 512"
                            >
                              <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                            </svg>
                          </Dropdown>
                        </div>
                      </div>
                    ))
                : data?.units?.map((item, index) => (
                    <div
                      className={`tile ${
                        selectedunits === item ? "selected" : ""
                      }`}
                      key={index}
                      onClick={() => setSelectedUnits(item)}
                    >
                      <h1>{item.name}</h1>
                      <div className="">
                        <p>{item.shorthand || "-"}</p>
                        <Dropdown menuItems={["View/Edit", "Delete"]}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 128 512"
                          >
                            <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                          </svg>
                        </Dropdown>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          {unitConv.open && (
            <div className="fixed h-screen w-screen top-0 left-0 bg-gray-800 bg-opacity-35 flex justify-center items-center">
              <div className=" bg-white">
                <div className="w-full p-3 bg-gray-300 flex justify-between items-center">
                  <h1 className="text-xl">Add Conversions</h1>{" "}
                  <button
                    onClick={() => setUnitConv({ ...unitConv, open: false })}
                  >
                    X
                  </button>
                </div>
                <div className=" p-3 flex gap-1 items-end">
                  <div className="">
                    <h1 className="text-sm">Base Unit</h1>
                    <input
                      type="text"
                      className=" border-2 border-gray-400"
                      value={unitConv.unit1}
                      onChange={(e) =>
                        setUnitConv({ ...unitConv, unit1: e.target.value })
                      }
                    />
                  </div>
                  =
                  <div className="">
                    <h1 className="text-sm">Rate</h1>
                    <input
                      type="text"
                      className=" border-2 border-gray-400"
                      value={unitConv.rate}
                      onChange={(e) =>
                        setUnitConv({ ...unitConv, rate: e.target.value })
                      }
                    />
                  </div>
                  <div className="">
                    <h1 className="text-sm">Secondary Unit</h1>
                    <input
                      type="text"
                      className=" border-2 border-gray-400"
                      value={unitConv.unit2}
                      onChange={(e) =>
                        setUnitConv({ ...unitConv, unit2: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="p-3">
                  <button
                    className="p-3 bg-slate-300 w-full rounded-sm hover:bg-slate-400"
                    onClick={() => {
                      setData({
                        ...data,
                        unitConversions: [
                          ...data.unitConversions,
                          {
                            unit1: unitConv.unit1,
                            rate: unitConv.rate,
                            unit2: unitConv.unit2,
                          },
                        ],
                      });
                      setUnitConv({ ...unitConv, open: false });
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="right">
            <div className="title">
              <div className="tile">
                <h1>{selectedunits?.name || "no unit selected"}</h1>
                <button
                  onClick={() => setUnitConv({ ...unitConv, open: true })}
                >
                  Add Conversions
                </button>
              </div>
            </div>
            <div className="content">
              <div className="t">
                <h1>TRANSACTIONS</h1>
                <div className="search">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                  </svg>
                  <input autoComplete="off" type="" />
                </div>
              </div>
              <div className="cl top">
                <p>-</p>
                <p>Conversion</p>
              </div>
              <div className="cl"></div>
              <div className="cl"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const BulkActive = ({ data, setData, setClose, change, setChange }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelect = (itemName) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemName)) {
        return prevSelected.filter((name) => name !== itemName);
      } else {
        return [...prevSelected, itemName];
      }
    });
  };

  const handleAddInactive = () => {
    const updatedItems = data.items.map((item) => {
      if (selectedItems.includes(item.Name)) {
        return { ...item, state: "active" };
      }
      return item;
    });

    setData({ ...data, items: updatedItems });
    setChange(!change);
    setSelectedItems([]); // Clear the selection after updating
    setClose();
  };

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-gray-600 bg-opacity-20">
      <div className="mx-auto p-4 bg-white flex flex-col w-auto rounded-md shadow-md">
        <h3 className="text-lg font-semibold mb-4">Select Items</h3>
        <ul className="mb-4">
          {data.items
            .filter((item) => item.state !== "active")
            .map((item) => (
              <li key={item.Name} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedItems.includes(item.Name)}
                  onChange={() => handleSelect(item.Name)}
                />
                <span>{item.Name}</span>
              </li>
            ))}
        </ul>
        <button
          onClick={handleAddInactive}
          className="px-4 py-2 bg-blue-500 min-w-[200px] mt-2 text-white rounded hover:bg-blue-600"
        >
          Set active
        </button>
        <button
          onClick={() => setClose()}
          className="px-4 py-2 bg-blue-500 min-w-[200px] mt-2 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};
const BulkInactive = ({ data, setData, setClose, change, setChange }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelect = (itemName) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemName)) {
        return prevSelected.filter((name) => name !== itemName);
      } else {
        return [...prevSelected, itemName];
      }
    });
  };

  const handleAddInactive = () => {
    const updatedItems = data.items.map((item) => {
      if (selectedItems.includes(item.Name)) {
        return { ...item, state: "inactive" };
      }
      return item;
    });

    setData({ ...data, items: updatedItems });
    setChange(!change);
    setSelectedItems([]); // Clear the selection after updating
    setClose();
  };

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-gray-600 bg-opacity-20">
      <div className="mx-auto p-4 bg-white flex flex-col w-auto rounded-md shadow-md">
        <h3 className="text-lg font-semibold mb-4">Select Items</h3>
        <ul className="mb-4">
          {data.items
            .filter((item) => item.state !== "inactive")
            .map((item) => (
              <li key={item.Name} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedItems.includes(item.Name)}
                  onChange={() => handleSelect(item.Name)}
                />
                <span>{item.Name}</span>
              </li>
            ))}
        </ul>
        <button
          onClick={handleAddInactive}
          className="px-4 py-2 bg-blue-500 min-w-[200px] mt-2 text-white rounded hover:bg-blue-600"
        >
          Set Inactive
        </button>
        <button
          onClick={() => setClose()}
          className="px-4 py-2 bg-blue-500 min-w-[200px] mt-2 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};
const BulkItemCode = ({ data, setData, setClose, change, setChange }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelect = (itemName) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemName)) {
        return prevSelected.filter((name) => name !== itemName);
      } else {
        return [...prevSelected, itemName];
      }
    });
  };
  function generate13DigitNumberString() {
    let numberString = "";
    for (let i = 0; i < 13; i++) {
      numberString += Math.floor(Math.random() * 10).toString();
    }
    return numberString;
  }

  const handleAddInactive = () => {
    const updatedItems = data.items.map((item) => {
      if (selectedItems.includes(item.Name)) {
        let cd = generate13DigitNumberString();
        return { ...item, Code: cd };
      }
      return item;
    });

    setData({ ...data, items: updatedItems });
    setChange(!change);
    setSelectedItems([]); // Clear the selection after updating
    setClose();
  };

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-gray-600 bg-opacity-20">
      <div className="mx-auto p-4 bg-white flex flex-col w-auto rounded-md shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          Select Items for bulk code assign
        </h3>
        <ul className="mb-4">
          {data.items
            .filter((item) => item.Code === "")
            .map((item) => (
              <li key={item.Name} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedItems.includes(item.Name)}
                  onChange={() => handleSelect(item.Name)}
                />
                <span>{item.Name}</span>
              </li>
            ))}
        </ul>
        <p className="text-sm text-gray-600">Showing items without item code</p>
        <button
          onClick={handleAddInactive}
          className="px-4 py-2 bg-blue-500 min-w-[200px] mt-2 text-white rounded hover:bg-blue-600"
        >
          Add Code
        </button>
        <button
          onClick={() => setClose()}
          className="px-4 py-2 bg-blue-500 min-w-[200px] mt-2 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};
const MoveToGroup = ({
  data,
  setData,
  setClose,
  change,
  setChange,
  category,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelect = (itemName) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemName)) {
        return prevSelected.filter((name) => name !== itemName);
      } else {
        return [...prevSelected, itemName];
      }
    });
  };

  const handleAddInactive = () => {
    const updatedItems = data.items.map((item) => {
      if (selectedItems.includes(item.Name)) {
        return { ...item, Category: category.name };
      }
      return item;
    });

    setData({ ...data, items: updatedItems });
    setChange(!change);
    setSelectedItems([]); // Clear the selection after updating
    setClose();
  };

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-gray-600 bg-opacity-20">
      <div className="mx-auto p-4 bg-white flex flex-col w-auto rounded-md shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          Select Items to be moved to {category.name} group
        </h3>
        <ul className="mb-4">
          {data.items.map((item) => (
            <li key={item.Name} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item.Name)}
                onChange={() => handleSelect(item.Name)}
              />
              <span>{item.Name}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600">Showing All Items</p>
        <button
          onClick={handleAddInactive}
          className="px-4 py-2 bg-blue-500 min-w-[200px] mt-2 text-white rounded hover:bg-blue-600"
        >
          Add To Group
        </button>
        <button
          onClick={() => setClose()}
          className="px-4 py-2 bg-blue-500 min-w-[200px] mt-2 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};
