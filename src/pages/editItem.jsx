// import React, { useEffect, useState, useRef } from "react";
// import CustomInput from "../components/customInput";
// import { useNavigate } from "react-router-dom";
// import Loader from "./Loader";
// import Undone from "../components/undone";

// export default function EditItem1({
//   data,
//   setData,
//   Index,
//   change,
//   setChange,
//   setClose,
//   t = true,
// }) {
//   var [toggle, setToggle] = useState(t);
//   var [page, setPage] = useState("pricing");
//   var [unitToggle, setUnitToggle] = useState(false);

//   // State variables
//   var [itemName, setitemName] = useState("");
//   var [itemHSN, setitemHSN] = useState("");
//   var [itemCategory, setitemCategory] = useState("");
//   var [itemCode, setitemCode] = useState("");
//   var [sellPrice, setSellPrice] = useState("");
//   var [discount, setDescount] = useState("");
//   var [purchaseprice, setPurchasePrice] = useState("");
//   var [tax, setTax] = useState("");
//   var [openingQuantity, setOpeningQuantity] = useState("");
//   var [atPrice, setAtPrice] = useState("");
//   var [asDate, setAsDate] = useState("");
//   var [minToMaintain, setMinToMaintain] = useState("");
//   var [location, setLocation] = useState("");
//   var [primaryUnit, setprimaryUnit] = useState("");
//   var [SecondaryUnit, setSecondaryUnit] = useState("");

//   var [loading, setLoading] = useState(false);
//   const [isInitialRender, setIsInitialRender] = useState(true);

//   const Navigate = useNavigate();
//   // Load item data from localStorage when the component mounts
//   useEffect(() => {
//     let Item = data.items[Index];
//     if (Item) {
//       if (Item.itemType == "service") setToggle(!toggle);
//       setitemName(Item.Name || "");
//       setitemHSN(Item.HSN || "");
//       setitemCategory(Item.Category || "");
//       setitemCode(Item.Code || "");
//       setSellPrice(Item.salesPrice || "");
//       setDescount(Item.discount || "");
//       setPurchasePrice(Item.purchasePrice || "");
//       setTax(Item.Tax || "");
//       setOpeningQuantity(Item.openingQuantity || "");
//       setAtPrice(Item.atPrice || "");
//       setAsDate(Item.asDate || "");
//       setMinToMaintain(Item.minToMaintain || "");
//       setLocation(Item.location || "");
//       setprimaryUnit(Item.primaryUnit || "");
//       setSecondaryUnit(Item.SecondaryUnit || "");
//     } else {
//       console.log("item not found");
//     }
//   }, []);

//   useEffect(() => {
//     if (!isInitialRender) {
//       if (sellPrice < discount) {
//         console.log("purchase price", purchaseprice);
//         console.log("saleprice: ", sellPrice);
//         console.log("saleprice: ", discount);
//         // alert("discount can't be more than sales price");
//       } else if (purchaseprice >= sellPrice - discount) {
//         console.log("purchase price", purchaseprice);
//         console.log("saleprice: ", sellPrice);
//         alert("purchase price more than sale price, please fix");
//       }
//     }
//   }, [purchaseprice, sellPrice, isInitialRender]);

//   useEffect(() => {
//     // Set the initial render flag to false after the first render
//     setIsInitialRender(false);
//   }, []);

//   function generate13DigitNumberString() {
//     let numberString = "";
//     for (let i = 0; i < 13; i++) {
//       numberString += Math.floor(Math.random() * 10).toString();
//     }
//     return numberString;
//   }

//   let uid = data.uid;

//   const editItemReq = async () => {
//     setLoading(true);
//     let newData;
//     if (toggle) {
//       newData = {
//         Name: itemName ? itemName : "",
//         HSN: itemHSN ? itemHSN : "",
//         Category: itemCategory ? itemCategory : "",
//         Code: itemCode ? itemCode : "",
//         salesPrice: sellPrice ? sellPrice : "",
//         discount: discount ? discount : "",
//         purchasePrice: purchaseprice ? purchaseprice : "",
//         Tax: tax ? tax : "",
//         openingQuantity: openingQuantity ? openingQuantity : 0,
//         atPrice: atPrice ? atPrice : "",
//         asDate: asDate ? asDate : "",
//         minToMaintain: minToMaintain ? minToMaintain : "",
//         location: location ? location : "",
//         profit: sellPrice - discount - purchaseprice,
//         stock: openingQuantity || 0,
//         itemType: "product",
//       };
//     } else {
//       newData = {
//         Name: itemName ? itemName : "",
//         HSN: itemHSN ? itemHSN : "",
//         Category: itemCategory ? itemCategory : "",
//         Code: itemCode ? itemCode : "",
//         salesPrice: sellPrice ? sellPrice : "",
//         discount: discount ? discount : "",
//         Tax: tax ? tax : "",
//         profit: sellPrice - discount,
//         itemType: "service",
//       };
//     }

//     data.items[Index] = newData;
//     // if (Index !== -1) {
//     //   // Update the existing item
//     // } else {
//     //   // If the item does not exist, add it (this should not happen if itemCode is correct)
//     //   data.items.push(newData);
//     // }

//     console.log("Updated Data:", data);

//     // Save the updated data
//     setData(data);
//     setChange(!change);
//     setClose(-1);
//   };

//   // barcode locha
//   let [BarcodeToggle, setBarcodeToggle] = useState(false);
//   // let [barcodes, setbarcodes] = useState();

//   // if (BarcodeToggle) {
//   let barcode = "";
//   let lastKeyTime = Date.now();

//   document.addEventListener("keydown", (event) => {
//     const currentTime = Date.now();

//     // Check if the time between keypresses is less than 50ms to determine if it's part of a barcode scan
//     if (currentTime - lastKeyTime > 50) {
//       barcode = ""; // Reset barcode if too much time has passed
//     }
//     lastKeyTime = currentTime;

//     // Filter out non-character keys
//     if (event.key.length === 1) {
//       barcode += event.key;
//     }

//     if (event.key === "Enter") {
//       if (barcode) {
//         setitemCode(barcode);
//         barcode = "";
//       }
//     }
//   });

//   useEffect(() => {
//     console.log(itemCode);
//   }, [itemCode]);
//   // }
//   return (
//     <div id="addItem">
//       <div className="container">
//         <div className="top">
//           <div className="l">
//             <h1>Edit Item</h1>
//             <p>Product</p>
//             <div
//               className={toggle ? "toggle" : "toggle opp"}
//               onClick={() => setToggle(!toggle)}
//             >
//               <div className="button"></div>
//             </div>
//             <p>service</p>
//           </div>
//           <div className="r">
//             <button onClick={() => Navigate("/settings")}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="#000"
//                 viewBox="0 0 512 512"
//               >
//                 <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
//               </svg>
//             </button>
//             <button onClick={() => setClose(-1)}>
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
//                 <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
//               </svg>
//             </button>
//           </div>
//         </div>
//         <div className="c1">
//           <div className="p1">
//             <CustomInput
//               inputValue={itemName}
//               setInputValue={setitemName}
//               placeholder={toggle ? "Item Name *" : "Service Name *"}
//             />
//             <CustomInput
//               inputValue={itemHSN}
//               setInputValue={setitemHSN}
//               placeholder={toggle ? "Item HSN" : "Service HSN"}
//             />
//             {/* <CustomInput
//               inputValue={primaryUnit}
//               setInputValue={setprimaryUnit}
//               placeholder={"Primary Unit"}
//             />
//             <CustomInput
//               inputValue={SecondaryUnit}
//               setInputValue={setSecondaryUnit}
//               placeholder={"Secondary Unit"}
//             /> */}
//             <button
//               onClick={() => setUnitToggle(true)}
//               className="px-4 py-2 bg-blue-200 text-blue-600 rounded hover:bg-blue-300"
//             >
//               Set Unit
//             </button>
//           </div>
//           {unitToggle && (
//             <div className="flex z-10 justify-center items-center fixed top-0 left-0 w-screen h-screen bg-gray-600 bg-opacity-20">
//               <div className="mx-auto p-4 bg-white flex flex-col w-auto rounded-md shadow-md min-w-[400px]">
//                 <h3 className="text-lg font-semibold mb-4">
//                   Select Items Units
//                 </h3>
//                 <div className="flex w-full justify-between my-3">
//                   <div className="relative">
//                     <h1>Primary Unit</h1>
//                     {/* <CustomInput
//                       inputValue={primaryUnit}
//                       setInputValue={setprimaryUnit}
//                       placeholder={"Primary Unit"}
//                     /> */}
//                     <input
//                       type="text"
//                       className="p-2 border border-gray-400"
//                       value={primaryUnit?.name}
//                       onChange={(e) =>
//                         setprimaryUnit({ name: e.target.value, done: false })
//                       }
//                     />
//                     {primaryUnit && !primaryUnit?.done && (
//                       <div className="absolute left-0 top-10 bg-white shadow-md px-2">
//                         {data?.units
//                           ?.filter(
//                             (e) =>
//                               primaryUnit?.name
//                                 .toLowerCase()
//                                 .split(" ")
//                                 .every((word) =>
//                                   e.name.toLowerCase().includes(word)
//                                 )
//                             // e.partyName.toLowerCase().includes(SearchQuerry.toLowerCase())
//                           )
//                           .map((item, index) => (
//                             <div
//                               className={`p-2 w-full`}
//                               key={index}
//                               onClick={() =>
//                                 setprimaryUnit({ name: item.name, done: true })
//                               }
//                             >
//                               <h1>{item.name}</h1>
//                             </div>
//                           ))}
//                       </div>
//                     )}
//                   </div>
//                   <div className="relative">
//                     <h1>Secondary Unit</h1>
//                     {/* <CustomInput
//                       inputValue={primaryUnit}
//                       setInputValue={setprimaryUnit}
//                       placeholder={"Primary Unit"}
//                     /> */}
//                     <input
//                       type="text"
//                       className="p-2 border border-gray-400"
//                       value={SecondaryUnit?.name}
//                       onChange={(e) =>
//                         setSecondaryUnit({ name: e.target.value, done: false })
//                       }
//                     />
//                     {SecondaryUnit && !SecondaryUnit?.done && (
//                       <div className="absolute left-0 top-10 bg-white shadow-md px-2">
//                         {data?.units
//                           ?.filter(
//                             (e) =>
//                               SecondaryUnit?.name
//                                 .toLowerCase()
//                                 .split(" ")
//                                 .every((word) =>
//                                   e.name.toLowerCase().includes(word)
//                                 )
//                             // e.partyName.toLowerCase().includes(SearchQuerry.toLowerCase())
//                           )
//                           .map((item, index) => (
//                             <div
//                               className={`p-2 w-full`}
//                               key={index}
//                               onClick={() =>
//                                 setSecondaryUnit({
//                                   name: item.name,
//                                   done: true,
//                                 })
//                               }
//                             >
//                               <h1>{item.name}</h1>
//                             </div>
//                           ))}
//                       </div>
//                     )}
//                   </div>
//                   {/* <CustomInput
//                     inputValue={SecondaryUnit}
//                     setInputValue={setSecondaryUnit}
//                     placeholder={"Secondary Unit"}
//                   /> */}
//                 </div>
//                 <p>
//                   One Secondary unit ={" "}
//                   <input
//                     type="text"
//                     className="p-2 border-b-2 border-gray-400"
//                     name=""
//                     id=""
//                   />{" "}
//                   X Primary Unit
//                 </p>
//                 <div className="flex w-full gap-2 mt-2">
//                   <button
//                     // onClick={handleAddInactive}
//                     className="px-4 py-2 bg-blue-500 flex-1 text-white rounded hover:bg-blue-600"
//                   >
//                     Add Unit
//                   </button>
//                   <button
//                     onClick={() => setUnitToggle(false)}
//                     className="px-4 py-2 border border-blue-500 flex-1 text-blue-600 rounded hover:bg-blue-500 hover:text-white"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div className="p1">
//             <select
//               onChange={(e) => setitemCategory(e.target.value)}
//               className="box"
//             >
//               <option value="" style={{ color: "blue", fontWeight: "600" }}>
//                 + add category
//               </option>
//               <option className="grey">Not Available</option>
//               {data.category?.map((c, index) => (
//                 <option className="grey">{c.name || "-"}</option>
//               ))}
//             </select>
//             {/* <input autoComplete="off" type="text" className="box" /> */}
//             <div className="flex">
//               <CustomInput
//                 inputValue={itemCode}
//                 setInputValue={setitemCode}
//                 placeholder={toggle ? "Item Code" : "Service Code"}
//               />
//               <button
//                 className="h-full my-[10px] p-3 bg-gray-200 font-semibold"
//                 onClick={() => {
//                   let cd = generate13DigitNumberString();
//                   console.log(cd);
//                   setitemCode(cd);
//                 }}
//               >
//                 Generate random code
//               </button>
//             </div>
//             {itemCode && (
//               <button className="font-semibold hover:underline">
//                 Generate Barcode Image
//               </button>
//             )}
//             <button className="text-blue-400 font-semibold mx-2 items-center fill-blue-400 flex gap-1">
//               <span className="hover:underline">Add Product Images</span>{" "}
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 448 512"
//                 className="w-4 h-4"
//               >
//                 <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
//               </svg>
//             </button>
//           </div>
//           <div className="p1">
//             <p className="text-gray-500 font-semibold">
//               * scan existing barcode to set custom item code from pre-existing
//               barcode
//             </p>
//           </div>
//         </div>
//         <div className="c2">
//           <div className="top t">
//             <button
//               className={page === "pricing" && "active"}
//               onClick={() => setPage("pricing")}
//             >
//               Pricing
//             </button>
//             {toggle && (
//               <button
//                 className={page === "stock" && "active"}
//                 onClick={() => setPage("stock")}
//               >
//                 Stock
//               </button>
//             )}
//             {toggle && (
//               <button
//               className={page === "Os" && "active"}
//               onClick={() => setPage("Os")}
//               >
//                 Online Store
//               </button>
//             )}
//             {toggle && (
//               <button
//               className={page === "Man" && "active"}
//               onClick={() => setPage("Man")}
//               >
//                 Manifacturing
//               </button>
//             )}
//           </div>
//           {page === "pricing" ? (
//             <div className="">
//               <div className="rounded-lg bg-gray-200 m-3 p-3">
//                 <h1 className="text-xl mt-[10px] font-semibold">Sale Price</h1>
//                 <div className="flex gap-3">
//                   <div className="flex items-center gap-0">
//                     <CustomInput
//                       inputValue={sellPrice}
//                       setInputValue={setSellPrice}
//                       placeholder={"Sale Price"}
//                     />
//                     <select
//                       name=""
//                       id=""
//                       className="px-2 h-fit bg-transparent m-0"
//                     >
//                       <option value="" className="p-2">
//                         With Taxes
//                       </option>
//                       <option value="" className="p-2">
//                         Without Taxes
//                       </option>
//                     </select>
//                   </div>
//                   <div className="flex items-center gap-0">
//                     <CustomInput
//                       inputValue={discount}
//                       setInputValue={setDescount}
//                       placeholder={"Descount"}
//                     />
//                     <select
//                       name=""
//                       id=""
//                       className="px-2 h-fit bg-transparent m-0"
//                     >
//                       <option value="" className="p-2">
//                         With Taxes
//                       </option>
//                       <option value="" className="p-2">
//                         Without Taxes
//                       </option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//               <div className="rounded-lg  bg-gray-200 m-3 p-3">
//                 <h1 className="text-xl mt-[10px] font-semibold">
//                   Purchase Price
//                 </h1>
//                 <div className="flex gap-3">
//                   {toggle && (
//                     <div className="flex items-center gap-0">
//                       <CustomInput
//                         inputValue={purchaseprice}
//                         setInputValue={setPurchasePrice}
//                         placeholder={"Purchase Price"}
//                       />
//                       <select
//                         name=""
//                         id=""
//                         className="px-2 h-fit bg-transparent m-0"
//                       >
//                         <option value="" className="p-2">
//                           With Taxes
//                         </option>
//                         <option value="" className="p-2">
//                           Without Taxes
//                         </option>
//                       </select>
//                     </div>
//                   )}

//                   <div className="flex items-center gap-0">
//                     <select
//                       name=""
//                       className="p-3 m-2 border-gray-300 border rounded-md"
//                       id=""
//                     >
//                       {data.tax?.map((item) => (
//                         <option value={item.value}>{item.name}</option>
//                       ))}
//                     </select>
//                     {/* <CustomInput
//                       inputValue={tax}
//                       setInputValue={setTax}
//                       placeholder={"Taxes"}
//                     />
//                     <select
//                       name=""
//                       id=""
//                       className="px-2 h-fit bg-transparent m-0"
//                     >
//                       <option value="" className="p-2">
//                         With Taxes
//                       </option>
//                       <option value="" className="p-2">
//                         Without Taxes
//                       </option>
//                     </select> */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : page === "stock" ? (
//             <div className="div s">
//               <CustomInput
//                 inputValue={openingQuantity}
//                 setInputValue={setOpeningQuantity}
//                 placeholder={"Opening Quantity"}
//               />
//               <CustomInput
//                 inputValue={atPrice}
//                 setInputValue={setAtPrice}
//                 placeholder={"At Price"}
//               />
//               <input
//                 type="date"
//                 onChange={(e) => setAsDate(e.target.value)}
//                 id="birthday"
//                 name="birthday"
//               ></input>
//               <CustomInput
//                 inputValue={minToMaintain}
//                 setInputValue={setMinToMaintain}
//                 placeholder={"Min Stock to maintain"}
//               />
//               <CustomInput
//                 inputValue={location}
//                 setInputValue={setLocation}
//                 placeholder={"Location"}
//               />
//             </div>
//           ): (
//             <Undone />
//           )}
//         </div>
//         <div className="c3">
//           <button onClick={() => editItemReq()}>Save</button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import CustomInput from "../components/customInput";
import Undone from "../components/undone";
import { useNavigate } from "react-router-dom";
import dev_url from "../url";
import TextField from "@mui/material/TextField";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";
import ImageUploader from "../components/ImgUpload";

export default function EditItem({
  data,
  setData,
  Index,
  change,
  setChange,
  setClose,
  t = true,
}) {
  const Navigate = useNavigate();
  var [toggle, setToggle] = useState(t);
  var [page, setPage] = useState("pricing");
  var [itemName, setitemName] = useState();
  var [itemHSN, setitemHSN] = useState();
  var [itemCategory, setitemCategory] = useState();
  var [itemCode, setitemCode] = useState();
  var [sellPrice, setSellPrice] = useState();
  var [WholeSalePrice, setWholeSalePrice] = useState();
  var [MRP, setMRP] = useState();
  var [MRP_salePrice, setMRP_salePrice] = useState();
  var [MRP_wholeSalePrice, setMRP_wholeSalePrice] = useState();
  var [description, setdescription] = useState();
  var [discount, setDescount] = useState();
  var [purchaseprice, setPurchasePrice] = useState();
  var [tax, setTax] = useState(0);
  var [openingQuantity, setOpeningQuantity] = useState();
  var [atPrice, setAtPrice] = useState();
  var [asDate, setAsDate] = useState();
  var [minToMaintain, setMinToMaintain] = useState(10);
  var [Storagecapacity, setStoragecapacity] = useState();
  var [location, setLocation] = useState();
  var [primaryUnit, setprimaryUnit] = useState();
  var [SecondaryUnit, setSecondaryUnit] = useState();
  var [Conversion, setConversion] = useState();
  var [ImageURL, setImageUrl] = useState();
  var [ImageList, setImageList] = useState();

  const [showPopup, setShowPopup] = useState(false);

  const handleUpload = (url) => {
    if (ImageList) setImageList([...ImageList, url]);
    else setImageList([url]);
  };

  const removeImage = (index) => {
    const newImages = [...ImageList];
    newImages.splice(index, 1);
    setImageList(newImages);
  };

  var [loading, setLoading] = useState(false);
  var [unitToggle, setUnitToggle] = useState(false);
  // var [toggle, set] = useState();
  const params = new URLSearchParams(window.location.search);
  let urlPram = params.get("data"); 

  useEffect(() => {
    let Item = data.items[Index];
    if (Item) {
      if (Item.itemType == "service") setToggle(!toggle);
      setitemName(Item.Name || "");
      setitemHSN(Item.HSN || "");
      setitemCategory(Item.Category || "");
      setitemCode(Item.Code || "");
      setSellPrice(Item.salesPrice || "");
      setDescount(Item.discount || "");
      setPurchasePrice(Item.purchasePrice || "");
      setTax(Item.Tax || "");
      setOpeningQuantity(Item.openingQuantity || "");
      setAtPrice(Item.atPrice || "");
      setAsDate(Item.asDate || "");
      setMinToMaintain(Item.minToMaintain || "");
      setLocation(Item.location || "");
      setprimaryUnit(Item.primaryUnit || "");
      setSecondaryUnit(Item.SecondaryUnit || "");
      setWholeSalePrice(Item.wholeSalePrice || "");
      // setMRP(item.MRP || "");
      // setMRP_salePrice(item. || "");
      // setMRP_wholeSalePrice(item. || "");
      setdescription(Item.description || "");
      // setStoragecapacity(item. || "");
      setConversion(Item.conversion || "");
      setImageUrl(Item.barcode || "");
      // setImageList(item. || "");
    } else {
      console.log("item not found");
    }
    if (urlPram == "services") {
      setToggle(false);
    }
  }, []);

  useEffect(() => {
    if (sellPrice < discount) {
      alert("discount can't be more than sales price");
    } else if (purchaseprice >= sellPrice - discount) {
      alert("purchase price more than sale price, please fix");
    }
  }, [purchaseprice, sellPrice]);

  function generate13DigitNumberString() {
    let numberString = "";
    for (let i = 0; i < 13; i++) {
      numberString += Math.floor(Math.random() * 10).toString();
    }
    return numberString;
  }

  var generateurl = async (ItemNumber) => {
    setLoading(true);
    try {
      await fetch(dev_url + "generate-barcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: data.uid,
        },
        body: JSON.stringify({ itemNumber: ItemNumber }),
      })
        .then((response) => response.json())
        .then((res) => {
          // console.log("updated");
          setLoading(false);
          // console.log(res);
          setImageUrl({ url: res.url, code: ItemNumber });
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error:", error);
        });
    } catch (error) {
      setLoading(false);
      alert("unable to generate PDF");
      console.error("Error generating PDF:", error);
    }
  };

  const addItemReq = async () => {

    if (sellPrice < discount) {
      alert("discount can't be more than sales price");
    } else if (purchaseprice >= sellPrice - discount) {
      alert("purchase price more than sale price, please fix");
    } else if (MRP < purchaseprice) {
      alert("MRP more than purchase price, please fix");
    }
    if (
      !itemName ||
      !itemCode ||
      !sellPrice ||
      !discount ||
      !purchaseprice ||
      !tax ||
      !primaryUnit
      ) {
        alert("Please fill all the fields");
    }

    setLoading(true);
    let newData;
    if (toggle) {
      newData = {
        Name: itemName ? itemName : "",
        HSN: itemHSN ? itemHSN : "",
        Category: itemCategory ? itemCategory : "",
        Code: itemCode ? itemCode : "",
        wholeSalePrice: WholeSalePrice ? WholeSalePrice : "",
        // MRP: MRP,
        description: description ? description : "",
        primaryUnit: primaryUnit ? primaryUnit : "",
        secondaryUnit: SecondaryUnit ? SecondaryUnit : "",
        convertion: "",
        unit: primaryUnit ? primaryUnit : "",
        salesPrice: sellPrice.withTax
          ? sellPrice.value * (1 - tax)
          : sellPrice.value,
        discount: discount ? discount : "",
        purchasePrice: purchaseprice.withTax
          ? purchaseprice.value * (1 - tax)
          : purchaseprice.value,
        Tax: tax ? tax : "",
        taxPercentage: tax ? tax : "",
        openingQuantity: openingQuantity ? openingQuantity : 0,
        atPrice: atPrice ? atPrice : "",
        asDate: asDate ? asDate : "",
        minToMaintain: minToMaintain ? minToMaintain : "",
        location: location ? location : "",
        profit: sellPrice - discount - purchaseprice.value - (tax ? tax : 0),
        barcode: ImageURL ? ImageURL.url : "",
        stock: openingQuantity || 0,
        itemType: "product",
      };
    } else {
      newData = {
        Name: itemName ? itemName : "",
        HSN: itemHSN ? itemHSN : "",
        Category: itemCategory ? itemCategory : "",
        Code: itemCode ? itemCode : "",
        salesPrice: sellPrice.withTax
          ? sellPrice.value * (1 - tax)
          : sellPrice.value,
        discount: discount ? discount : "",
        Tax: tax ? tax : "",
        profit: sellPrice - discount,
        itemType: "service",
      };
    }
    data.items[Index] = newData;
    // if (Index !== -1) {
    //   // Update the existing item
    // } else {
    //   // If the item does not exist, add it (this should not happen if itemCode is correct)
    //   data.items.push(newData);
    // }

    console.log("Updated Data:", data);

    // Save the updated data
    setData(data);
    setChange(!change);
    setClose(-1);
  };

  // barcode locha
  // let [BarcodeToggle, setBarcodeToggle] = useState(false);
  // let [barcodes, setbarcodes] = useState();

  // if (BarcodeToggle) {
  let barcode = "";
  let lastKeyTime = Date.now();

  let urllocation = useLocation();

  document.addEventListener("keydown", (event) => {
    if (urllocation?.pathname === "/addItem") {
      const currentTime = Date.now();

      // Check if the time between keypresses is less than 50ms to determine if it's part of a barcode scan
      if (currentTime - lastKeyTime > 50) {
        barcode = ""; // Reset barcode if too much time has passed
      }
      lastKeyTime = currentTime;

      // Filter out non-character keys
      if (event.key.length === 1) {
        barcode += event.key;
      }

      if (event.key === "Enter") {
        if (barcode) {
          setitemCode(barcode);
          barcode = ""; // Clear the barcode after processing
        }
      }
    }
  });

  useEffect(() => {
    console.log(itemCode);
  }, [itemCode]);
  // }

  if (loading) return <Loader />;

  return (
    <div id="addItem">
      <div className="container">
        <div className="top">
          <div className="l">
            <h1>Edit Item</h1>
            <p>Product</p>
            <div
              className={toggle ? "toggle" : "toggle opp"}
              onClick={() => setToggle(!toggle)}
            >
              <div className="button"></div>
            </div>
            <p>service</p>
          </div>
          <div className="r">
            <button onClick={() => Navigate("/settings")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#000"
                viewBox="0 0 512 512"
              >
                <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
              </svg>
            </button>
            <button onClick={() => setClose(-1)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="c1">
          <div className="flex gap-3 items-center">
            <CustomInput
              inputValue={itemName}
              setInputValue={setitemName}
              placeholder={toggle ? "Item Name *" : "Service Name *"}
            />
            <CustomInput
              inputValue={itemHSN}
              setInputValue={setitemHSN}
              placeholder={toggle ? "Item HSN" : "Service HSN"}
            />
            {primaryUnit?.name && primaryUnit?.done ? (
              <>
                <h1>
                  Units:{" "}
                  <span className="font-semibold">{primaryUnit.name}</span>,{" "}
                  {primaryUnit.name} x {Conversion} = {SecondaryUnit?.name}
                </h1>
                <button
                  onClick={() => setUnitToggle(true)}
                  className="px-4 py-2 bg-blue-200 text-blue-600 rounded hover:bg-blue-300"
                >
                  Edit Units
                </button>
              </>
            ) : (
              <button
                onClick={() => setUnitToggle(true)}
                className="px-4 py-2 bg-blue-200 text-blue-600 rounded hover:bg-blue-300"
              >
                Set Unit
              </button>
            )}
            {itemCode && (
              <>
                {ImageURL ? (
                  <a href={ImageURL.url} target="_blank">
                    Click to see Barcode
                  </a>
                ) : (
                  <button
                    className="text-blue-500 font-semibold mx-2 items-center hover:underline fill-blue-500 flex gap-1"
                    onClick={() => generateurl(itemCode)}
                  >
                    Generate Barcode Image
                  </button>
                )}
              </>
            )}
          </div>
          {unitToggle && (
            <div className="flex z-10 justify-center items-center fixed top-0 left-0 w-screen h-screen bg-gray-600 bg-opacity-20">
              <div className="mx-auto p-4 bg-white flex flex-col w-auto rounded-md shadow-md min-w-[400px]">
                <h3 className="text-lg font-semibold mb-4">
                  Select Items Units
                </h3>
                <div className="flex w-full gap-2 justify-between my-3">
                  <div className="relative">
                    <h1>Primary Unit</h1>
                    <input
                      type="text"
                      className="p-2 border border-gray-400"
                      value={primaryUnit?.name}
                      onChange={(e) =>
                        setprimaryUnit({ name: e.target.value, done: false })
                      }
                    />
                    {primaryUnit?.name && !primaryUnit?.done && (
                      <div className="absolute left-0 top-30 bg-white shadow-lg max-h-[300px] overflow-y-auto px-2">
                        {data?.units
                          ?.filter(
                            (e) =>
                              primaryUnit?.name
                                .toLowerCase()
                                .split(" ")
                                .every((word) =>
                                  e.name.toLowerCase().includes(word)
                                )
                            // e.partyName.toLowerCase().includes(SearchQuerry.toLowerCase())
                          )
                          .map((item, index) => (
                            <div
                              className={`p-2 w-full hover:bg-gray-200 cursor-pointer`}
                              key={index}
                              onClick={() =>
                                setprimaryUnit({ name: item.name, done: true })
                              }
                            >
                              <h1>{item.name}</h1>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <h1>Secondary Unit</h1>
                    <input
                      type="text"
                      className="p-2 border border-gray-400"
                      value={SecondaryUnit?.name}
                      onChange={(e) =>
                        setSecondaryUnit({ name: e.target.value, done: false })
                      }
                    />
                    {SecondaryUnit?.name && !SecondaryUnit?.done && (
                      <div className="absolute left-0 top-30 bg-white shadow-lg max-h-[300px] overflow-y-auto px-2">
                        {data?.units
                          ?.filter(
                            (e) =>
                              SecondaryUnit?.name
                                .toLowerCase()
                                .split(" ")
                                .every((word) =>
                                  e.name.toLowerCase().includes(word)
                                )
                          )
                          .map((item, index) => (
                            <div
                              className={`p-2 w-full hover:bg-gray-200 cursor-pointer`}
                              key={index}
                              onClick={() =>
                                setSecondaryUnit({
                                  name: item.name,
                                  done: true,
                                })
                              }
                            >
                              <h1>{item.name}</h1>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                {SecondaryUnit?.name && (
                <p>
                  One Secondary unit ={" "}
                  <input
                    type="text"
                    className="p-1 border border-gray-400"
                    name=""
                    id=""
                    value={Conversion}
                    onChange={(e) => setConversion(e.target.value)}
                  />{" "}
                  X Primary Unit
                </p>
                )}
                <div className="flex w-full gap-2 mt-2">
                  <button
                    onClick={() => setUnitToggle(false)}
                    className="px-4 py-2 bg-blue-500 flex-1 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setUnitToggle(false)}
                    className="px-4 py-2 border border-blue-500 flex-1 text-blue-600 rounded hover:bg-blue-500 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="p1">
            <select
              onChange={(e) => {
                const value = e.target.value;
                if (value === "addCategory") {
                  Navigate("/items?data=addCategory");
                } else {
                  setitemCategory(value); // Set the selected category
                }
              }}
              className="box"
            >
              <option className="grey" value="N/A">
                Not Available
              </option>
              {data.category?.map((c, index) => (
                <option key={index} className="grey" value={c.name}>
                  {c.name || "-"}
                </option>
              ))}
              <option
                value="addCategory"
                style={{ color: "blue", fontWeight: "600" }}
              >
                + add category
              </option>
            </select>

            <div className="flex items-center">
              <CustomInput
                inputValue={itemCode}
                setInputValue={setitemCode}
                placeholder={toggle ? "Item Code" : "Service Code"}
              />
              {!itemCode && (
                <button
                  className="h-full p-1 bg-blue-200 hover:bg-blue-300 rounded-r-md"
                  onClick={() => {
                    let cd = generate13DigitNumberString();
                    console.log(cd);
                    setitemCode(cd);
                  }}
                >
                  Generate random code
                </button>
              )}
            </div>
            
            <button
              className="text-blue-400 font-semibold mx-2 items-center fill-blue-400 flex gap-1"
              onClick={() => setShowPopup(true)}
            >
              <span className="hover:underline">Add Product Images</span>{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-4 h-4"
              >
                <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
              </svg>
            </button>
            {showPopup && (
              <ImageUploader
                onClose={() => setShowPopup(false)}
                onUpload={handleUpload}
              />
            )}
          </div>
          {ImageList?.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {ImageList.map((url, index) => (
                <div
                  key={index}
                  className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden relative my-2"
                >
                  <img
                    src={url}
                    alt="Product Image"
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-4 h-4"
                    >
                      <path
                        d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H160 85.9l11.1-11.6c9.4-10.5 9.4-27.7 0-39.2L
                    135.2 17.7zM32 128H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32S14.3 32 32 32z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-0">
            <TextField
              id="outlined-search"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              label="Description"
              itemType="number"
              sx={{
                background: "white",
                width: "400px",
              }}
              type="search"
            />
          </div>
          <div className="p1 mt-2">
            <p className="text-gray-400 ">
              * scan existing barcode to set custom item code from pre-existing
              barcode
            </p>
          </div>
        </div>
        <div className="c2">
          <div className="top t">
            <button
              className={page === "pricing" && "active"}
              onClick={() => setPage("pricing")}
            >
              Pricing
            </button>
            {toggle && (
              <button
                className={page === "stock" && "active"}
                onClick={() => setPage("stock")}
              >
                Stock
              </button>
            )}
            {/* {toggle && ( */}
              <button
                className={page === "Os" && "active"}
                onClick={() => setPage("Os")}
              >
                Online Store
              </button>
            {/* )} */}
            {toggle && (
              <button
                className={page === "Man" && "active"}
                onClick={() => setPage("Man")}
              >
                Manifacturing
              </button>
            )}
          </div>
          {page === "pricing" ? (
            <div className="">
              <div className="rounded-lg bg-gray-200 m-3 p-3">
                <h1 className="text-lg mb-[10px] font-semibold">MRP</h1>
                <div className="flex">
                  <div className="flex items-center gap-3">
                    <TextField
                      id="outlined-search"
                      value={MRP}
                      onChange={(e) => setMRP(e.target.value)}
                      label="MRP"
                      sx={{
                        background: "white",
                        width: "100%",
                      }}
                      type="search"
                      itemType="number"
                    />
                    <TextField
                      id="outlined-search"
                      value={MRP_salePrice}
                      onChange={(e) => setMRP_salePrice(e.target.value)}
                      label="Desc. on MRP for Sale (%)"
                      sx={{
                        background: "white",
                        width: "100%",
                      }}
                      type="search"
                      itemType="number"
                    />
                    <TextField
                      id="outlined-search"
                      value={MRP_wholeSalePrice}
                      onChange={(e) => setMRP_wholeSalePrice(e.target.value)}
                      label="Desc. on MRP for Wholesale (%)"
                      sx={{
                        background: "white",
                        width: "100%",
                      }}
                      type="search"
                      itemType="number"
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-gray-200 m-3 p-3">
                <h1 className="text-lg mb-[10px] font-semibold">SALE PRICE</h1>
                <div className="flex">
                  <div className="flex items-center gap-0">
                    <TextField
                      id="outlined-search"
                      value={sellPrice?.value}
                      onChange={(e) =>
                        setSellPrice({
                          ...sellPrice,
                          value: e.target.value,
                        })
                      }
                      label="Sale Price"
                      sx={{
                        background: "white",
                        width: "100%",
                      }}
                      type="search"
                      itemType="number"
                    />
                    <select
                      name=""
                      id=""
                      className="p-4 m-2 border-gray-300 border rounded-md"
                      onChange={(e) =>
                        setSellPrice({
                          ...sellPrice,
                          withTax: e.target.value,
                        })
                      }
                    >
                      <option value={true} className="p-2">
                        With Taxes
                      </option>
                      <option value={false} className="p-2">
                        Without Taxes
                      </option>
                    </select>
                  </div>
                  <div className="flex items-center ml-10 gap-0">
                    <TextField
                      id="outlined-search"
                      value={discount}
                      onChange={(e) => setDescount(e.target.value)}
                      label="Descount"
                      itemType="number"
                      sx={{
                        background: "white",
                        width: "100%",
                      }}
                      type="search"
                    />
                    <select
                      name=""
                      id=""
                      className="p-4 m-2 border-gray-300 border rounded-md"
                    >
                      <option value="" className="p-2">
                        Amount
                      </option>
                      <option value="" className="p-2">
                        Percentage
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center mt-2">
                  <TextField
                    id="outlined-search"
                    value={WholeSalePrice}
                    onChange={(e) => setWholeSalePrice(e.target.value)}
                    label="Wholesale Price"
                    itemType="number"
                    sx={{
                      background: "white",
                    }}
                    type="search"
                  />
                  <select
                    name=""
                    id=""
                    className="p-4 m-2 border-gray-300 border rounded-md"
                  >
                    <option value="" className="p-2">
                      With Tax
                    </option>
                    <option value="" className="p-2">
                      Without Tax
                    </option>
                  </select>
                  <TextField
                    id="outlined-search"
                    label="Wholesale Minumum qty to maintain"
                    itemType="number"
                    sx={{
                      background: "white",
                      marginLeft: "20px",
                    }}
                    type="search"
                  />
                  {SecondaryUnit?.name && (
                    <p className="text-sm">
                      wholesale unit - {SecondaryUnit.name}
                    </p>
                  )}
                </div>
              </div>
              <div className=" flex gap-2 w-full">
                {toggle && (
                  <div className="rounded-lg flex-1 bg-gray-200 m-3 p-3">
                    <h1 className="text-lg mb-[10px] font-semibold">
                      PURCHASE PRICE
                    </h1>
                    <div className="flex gap-3 items-center">
                      <TextField
                        id="outlined-search"
                        value={purchaseprice?.value}
                        onChange={(e) =>
                          setPurchasePrice({
                            ...purchaseprice,
                            value: e.target.value,
                          })
                        }
                        label="Purchase Price"
                        sx={{
                          background: "white",
                          width: "100%",
                        }}
                        type="search"
                        itemType="number"
                      />
                      <select
                        name=""
                        id=""
                        className="p-4 m-2 border-gray-300 border rounded-md"
                        onChange={(e) =>
                          setPurchasePrice({
                            ...purchaseprice,
                            withTax: e.target.value,
                          })
                        }
                      >
                        <option value={true} className="p-2">
                          With Taxes
                        </option>
                        <option value={false} className="p-2">
                          Without Taxes
                        </option>
                      </select>
                    </div>
                  </div>
                )}
                <div className="rounded-lg flex-1 bg-gray-200 m-3 p-3">
                  <h1 className="text-lg mb-[10px] font-semibold">TAXES</h1>
                  <div className="flex gap-3 items-center">
                    <select
                      name=""
                      className="p-4 my-2 border-gray-300 border rounded-md"
                      id=""
                      value={tax}
                      onChange={(e) => setTax(e.target.value)}
                    >
                      <option value={0}>None</option>
                      {data.tax?.map((item) => (
                        <option value={item.value}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : page === "stock" ? (
            <div className="div s">
              <CustomInput
                inputValue={openingQuantity}
                setInputValue={setOpeningQuantity}
                placeholder={"Opening Quantity"}
              />
              <CustomInput
                inputValue={atPrice}
                setInputValue={setAtPrice}
                placeholder={"At Price"}
              />
              <input
                type="date"
                value={Date(asDate)}
                onChange={(e) => setAsDate(e.target.value)}
                id="birthday"
                name="birthday"
              ></input>
              <CustomInput
                inputValue={minToMaintain}
                setInputValue={setMinToMaintain}
                placeholder={"Min Stock to maintain"}
              />
              <CustomInput
                inputValue={Storagecapacity}
                setInputValue={setStoragecapacity}
                placeholder={"Storage Capacity"}
              />
              <CustomInput
                inputValue={location}
                setInputValue={setLocation}
                placeholder={"Location"}
              />
            </div>
          ) : (
            <Undone />
          )}
        </div>
        <div className="c3">
          <button onClick={() => addItemReq()}>Save & New</button>
          <button onClick={() => addItemReq()}>Save</button>
        </div>
      </div>
    </div>
  );
}
