import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dev_url from "../url";
import Loader from "./Loader";
import CustomInput from "../components/customInput";
import TextField from "@mui/material/TextField";

export default function AddExpense({ data, setData, change, setChange }) {
  const Navigate = useNavigate();
  const [toggle, setToggle] = useState(true);
  // var [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([
    {
      index: 1,
      item: "",
      qty: "",
      price: "",
      amount: "",
    },
  ]);

  const [indexCount, setIndexCount] = useState(0);
  const [Search, setSearch] = useState();
  const addRow = () => {
    setRows([
      ...rows,
      {
        index: indexCount,
        item: "",
        qty: "",
        price: "",
        amount: "",
      },
    ]);
    setIndexCount(indexCount + 1);
  };

  const [totalAmount, setTotalAmount] = useState(0);

  const handleInputChange = async (index, column, value) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      if (column === "qty" || column === "price") {
        const qty = parseInt(newRows[index]["qty"]);
        const price = parseInt(newRows[index]["price"]);

        console.log(qty);
        // Calculate amount
        const amount = qty * price;
        newRows[index]["amount"] = amount;

        // Update total amount
        const newTotalAmount = newRows.reduce(
          (total, row) => total + (row.amount || 0),
          0
        );
        setTotalAmount(newTotalAmount);

        // Update total tax
        // const newTotalTax = newRows.reduce(
        //   (total, row) => total + (row.amount ? tax : 0),
        //   0
        // );
        // setTotalTax(newTotalTax);
      }
      newRows[index][column] = value;
      return newRows;
    });
  };

  const [searchTerm, setSearchTerm] = useState(""); // Initial index count
  const [Name, setName] = useState({ done: true }); // Initial index count
  function generateUniqueInvoiceNumber(data) {
    const existing = new Set(data.map((item) => item.invoice_number));
    let invoice;
    do {
      invoice = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    } while (existing.has(invoice));
    return invoice;
  }
  const [invoice_number, setInvoice_number] = useState(
    generateUniqueInvoiceNumber(data.Transactions)
  );
  const [invoice_date, setInvoice_date] = useState(""); // Initial index count
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setInvoice_date(currentDate);
  }, []);
  // const [paymentType, setpaymentType] = useState("credit"); // Initial index count
  const [Description, setDescription] = useState(); // Initial index count
  const [addExpenseCategory, setAddExpenseCategory] = useState(false); // Initial index count
  const [addExpenseitem, setAddExpenseitem] = useState(false); // Initial index count
  const [ExpenseItem, setExpenseitem] = useState({
    name: "",
    hsn: "",
    price: "",
    taxrate: 0,
  }); // Initial index count
  const [inputFocus, setInputFocus] = useState(false); // Initial index count

  // let uid = data.uid;
  let addExpense = () => {
    // return;

    const newData = {
      Category: Name.value ? Name.value : "",
      invoice_number: invoice_number ? invoice_number : "",
      invoice_date: invoice_date ? invoice_date : "",
      // payment_type: paymentType ? paymentType : "",
      transactionType: "",
      Type: "Expense",
      items: rows ? rows : "",
      total: totalAmount ? totalAmount : "",
      description: Description ? Description : "",
    };

    let newDa = data;
    newDa.expense ? newDa.expense.push(newData) : (newDa.expense = [newData]);

    newDa.Transactions
      ? newDa.Transactions.push(newData)
      : (newDa.Transactions = [newData]);

    newDa.total_expense
      ? (newDa.total_expense += parseFloat(newData.total))
      : (newDa.total_expense = parseFloat(newData.total));

    console.log("newData");
    console.log(newDa);
    setData(newDa);
    setChange(!change);
    Navigate("/expenses");
  };

  const [categoryName, setCategoryName] = useState(""); // Initial index count
  const [categoryType, setCategoryType] = useState(""); // Initial index count

  let addExpCategory = () => {
    const newData = {
      name: categoryName ? categoryName : "",
      type: categoryType ? categoryType : "",
    };

    let newDa = data;
    newDa.expenseCategory
      ? newDa.expenseCategory.push(newData)
      : (newDa.expenseCategory = [newData]);
    setData(newDa);
    setChange(!change);
    setCategoryName("");
    setCategoryType("");
    setAddExpenseCategory(!addExpenseCategory);
  };
  let addExpItem = () => {
    if (ExpenseItem.name && ExpenseItem.price) {
      let newDa = data;
      newDa.expenseItem
        ? newDa.expenseItem.push(ExpenseItem)
        : (newDa.expenseItem = [ExpenseItem]);
      setData(newDa);
      setChange(!change);
      setCategoryName("");
      setCategoryType("");
      setAddExpenseCategory(!addExpenseCategory);
    } else {
      alert("Please enter name and price");
    }
  };

  return (
    <div id="addsales" className="text-xs">
      {addExpenseCategory && (
        <div className="addExpenseCategoryDiv">
          <div className="content">
            <div className="t">
              <h1>Add Expense Category</h1>
              <button onClick={() => setAddExpenseCategory(false)}>x</button>
            </div>
            <CustomInput
              inputValue={categoryName}
              setInputValue={setCategoryName}
              placeholder={"Expense Category"}
            />
            <select
              onChange={(e) => setCategoryType(e.target.value)}
              name=""
              id=""
            >
              <option value="">Dirrect Expense</option>
              <option value="">Indirrect Expense</option>
            </select>
            <button onClick={() => addExpCategory()}>Save</button>
          </div>
        </div>
      )}
      {addExpenseitem && (
        <div className="addExpenseCategoryDiv">
          <div className="content">
            <div className="t">
              <h1>Expense name</h1>
              <button onClick={() => setAddExpenseitem(false)}>x</button>
            </div>
            <div className="flex justify-between w-full">
              <TextField
                id="outlined-search"
                value={ExpenseItem.name}
                onChange={(e) =>
                  setExpenseitem({ ...ExpenseItem, name: e.target.value })
                }
                label="item Name"
                sx={{
                  background: "white",
                  width: "100%",
                }}
                type="search"
              />
              <TextField
                id="outlined-search"
                value={ExpenseItem.hsn}
                onChange={(e) =>
                  setExpenseitem({ ...ExpenseItem, hsn: e.target.value })
                }
                label="item HSN/ SAC"
                sx={{
                  background: "white",
                  width: "100%",
                }}
                type="search"
              />
            </div>
            <div className="flex justify-between w-full">
              <TextField
                id="outlined-search"
                value={ExpenseItem.price}
                onChange={(e) =>
                  setExpenseitem({ ...ExpenseItem, price: e.target.value })
                }
                label="price (excl. tax)"
                sx={{
                  background: "white",
                  width: "100%",
                }}
                type="search"
              />
              <TextField
                id="outlined-search"
                value={ExpenseItem.tax}
                onChange={(e) =>
                  setExpenseitem({ ...ExpenseItem, tax: e.target.value })
                }
                label="tax rate (%)"
                sx={{
                  background: "white",
                  width: "100%",
                }}
                type="search"
              />
            </div>
            <button onClick={() => addExpItem()}>Save</button>
          </div>
        </div>
      )}
      <div className="top">
        <div className="">
          <button onClick={() => Navigate("/expenses")}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
          </button>
          <h1>Expense</h1>
        </div>
        <div className="">
          <p>GST</p>
          <div
            className={toggle ? "toggle" : "toggle opp"}
            onClick={() => {
              // setpaymentType(toggle ? "GST" : "none");
              setToggle(!toggle);
            }}
          >
            <div className="button"></div>
          </div>
        </div>
      </div>
      <div className="body text-sm">
        <div className="ai1">
          <div className="flex flex-col gap-2 items-center justify-center">
            {/* <div className="le">
              <div className="l">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                </svg>
                
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
              </div>
            </div> */}
            <div className="flex gap-1 items-center relative pr-3  border border-gray-300 rounded-md h-fit">
              <input
                type="text"
                name="name"
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                placeholder="Expense Catogroy"
                id=""
                className="p-1 bg-white w-[300px] h-[30px]"
                value={Name?.value ? Name.value : ""}
                onChange={(e) =>
                  setName({ value: e.target.value, done: false })
                }
              />
              {!Name?.done && Name.value && (
                <ul className="absolute top-8 left-0 w-[400px] z-10 rounded-md shadow-md ">
                  {data.expenseCategory
                    ?.filter((item) =>
                      item.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item) => (
                      <li
                        key={item.itemCode}
                        className="p-1 hover:bg-gray-200  bg-white flex justify-between w-full"
                        onClick={() => {
                          Navigate(item.to);
                          setName({ value: item.name, done: true });
                        }}
                      >
                        {item.name}
                      </li>
                    ))}
                  <li
                    className="p-1 hover:bg-gray-200 bg-white flex justify-between w-full text-blue-500"
                    onClick={() => {
                      setAddExpenseCategory(true);
                    }}
                  >
                    Add Expense Category +
                  </li>
                </ul>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </div>
          </div>

          <div className="r">
            <div className="">
              <span>Expense No.</span>
              <input
                type="number"
                value={invoice_number}
                onChange={(e) => setInvoice_number(e.target.value)}
                name="InvNo"
                placeholder="input..."
                id=""
              />
            </div>
            <div className="">
              <span>Date</span>
              <input
                type="date"
                value={invoice_date}
                onChange={(e) => setInvoice_date(e.target.value)}
                id="birthday"
                name="birthday"
              ></input>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto ">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-green-100">
                <th className="px-1 py-1 border border-gray-300 border-b-0">
                  ITEM
                </th>
                <th className="px-1 py-1 border border-gray-300 border-b-0">
                  QTY
                </th>
                <th className="px-1 py-1 border border-gray-300 border-b-0">
                  PRICE
                </th>
                <th className="px-1 py-1   border border-gray-300 border-b-0">
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="text-center">
                  <td className=" w-1/6 border border-gray-300">
                    <input
                      className="w-full px-1 py-1 text-center"
                      value={
                        rows[rowIndex].item
                          ? rows[rowIndex].item
                          : Search
                          ? Search[rowIndex]?.item
                          : ""
                      }
                      onChange={(e) =>
                        setSearch({ rowIndex: { item: e.target.value } })
                      }
                    />
                    {Search?.rowIndex?.item && (
                      <ul className="absolute w-[500px] bg-white">
                        {data.expenseItems
                          .filter((item) =>
                            item.Name.toLowerCase().includes(
                              rows[rowIndex].item.toLowerCase()
                            )
                          )
                          .map((item) => (
                            <li
                              key={item.code}
                              onClick={() => {
                                handleInputChange(rowIndex, "item", item.Name);
                                handleInputChange(
                                  rowIndex,
                                  "TaxPercentage",
                                  item.taxPercentage
                                );
                                handleInputChange(
                                  rowIndex,
                                  "price_per_unit",
                                  item.salesPrice
                                );
                                setSearch({});
                              }}
                              className="p-2 border-b border-gray-300 hover:bg-gray-200 cursor-pointer flex justify-between"
                            >
                              <h1>{item.Name}</h1>
                              <h1
                                className={
                                  item.stock < item.minToMaintain
                                    ? "text-red-500"
                                    : "text-green-500"
                                }
                              >
                                {item.stock}
                              </h1>
                            </li>
                          ))}
                        <li
                          className="p-2 text-blue-500 font-semibold hover:bg-gray-200 cursor-pointer"
                          onClick={() => Navigate("/addParties")}
                        >
                          Add Item +
                        </li>
                      </ul>
                    )}
                  </td>
                  {/* <td className="px-1 py-1   border border-gray-300">
                      //row.description} 
                      <input
                        className="w-full px-1 py-1 text-center"
                        // value={
                        //   rows[rowIndex].item
                        //     ? rows[rowIndex].item
                        //     : Search
                        //     ? Search[rowIndex]?.item
                        //     : ""
                        // }
                        // onChange={(e) =>
                        //   setSearch({ rowIndex: { item: e.target.value } })
                        // }
                      />
                    </td>
                    <td className="px-1 py-1   border border-gray-300">
                      // {row.batchNo} 
                      <input
                        className="w-full px-1 py-1 text-center"
                        // value={
                        //   rows[rowIndex].item
                        //     ? rows[rowIndex].item
                        //     : Search
                        //     ? Search[rowIndex]?.item
                        //     : ""
                        // }
                        // onChange={(e) =>
                        //   setSearch({ rowIndex: { item: e.target.value } })
                        // }
                      />
                    </td>
                    <td className="px-1 py-1   border border-gray-300">
                      {/* {row.modelNo} 
                      <input
                        className="w-full px-1 py-1 text-center"
                        // value={
                        //   rows[rowIndex].item
                        //     ? rows[rowIndex].item
                        //     : Search
                        //     ? Search[rowIndex]?.item
                        //     : ""
                        // }
                        // onChange={(e) =>
                        //   setSearch({ rowIndex: { item: e.target.value } })
                        // }
                      />
                    </td>
                    <td className="px-1 py-1   border border-gray-300">
                      {/* {row.expDate} 
                      <input
                        className="w-full px-1 py-1 text-center"
                        // value={
                        //   rows[rowIndex].item
                        //     ? rows[rowIndex].item
                        //     : Search
                        //     ? Search[rowIndex]?.item
                        //     : ""
                        // }
                        // onChange={(e) =>
                        //   setSearch({ rowIndex: { item: e.target.value } })
                        // }
                      />
                    </td>
                    <td className="px-1 py-1   border border-gray-300">
                      {/* {row.mfgDate} 
                      <input
                        className="w-full px-1 py-1 text-center"
                        // value={
                        //   rows[rowIndex].item
                        //     ? rows[rowIndex].item
                        //     : Search
                        //     ? Search[rowIndex]?.item
                        //     : ""
                        // }
                        // onChange={(e) =>
                        //   setSearch({ rowIndex: { item: e.target.value } })
                        // }
                      />
                    </td>
                    <td className="px-1 py-1   border border-gray-300">
                      {/* {row.size} 
                      <input
                        className="w-full px-1 py-1 text-center"
                        // value={
                        //   rows[rowIndex].item
                        //     ? rows[rowIndex].item
                        //     : Search
                        //     ? Search[rowIndex]?.item
                        //     : ""
                        // }
                        // onChange={(e) =>
                        //   setSearch({ rowIndex: { item: e.target.value } })
                        // }
                      />
                    </td> */}
                  <td className="  border border-gray-300">
                    <input
                      type="number"
                      className="w-full px-1 py-1 text-center"
                      value={rows[rowIndex].qty}
                      onChange={(e) =>
                        handleInputChange(rowIndex, "qty", e.target.value)
                      }
                    />
                  </td>
                  {/* <td className="  border border-gray-300 relative">
                      <input
                        className="w-full  px-1 py-1 text-center bg-gray-100 rounded-sm"
                        value={
                          rows[rowIndex].unit
                            ? rows[rowIndex].unit
                            : Search
                            ? Search[rowIndex]?.unit
                            : ""
                        }
                        onChange={(e) =>
                          setSearch({ rowIndex: { unit: e.target.value } })
                        }
                      />
                      {Search?.rowIndex?.unit && (
                        <ul className="absolute top-6 left-0">
                          <li
                            className="add"
                            onClick={() => Navigate("/items?data=addUnit")}
                          >
                            Add Units +
                          </li>
                          {data.units
                            .filter((unit) =>
                              unit.name
                                .toLowerCase()
                                .includes(
                                  rows[rowIndex].unit
                                    ? rows[rowIndex].unit.toLowerCase()
                                    : ""
                                )
                            )
                            .map((unit) => (
                              <li
                                key={unit.name}
                                onClick={() => {
                                  // i should probably add more than a name to improve future search filter
                                  handleInputChange(
                                    rowIndex,
                                    "unit",
                                    unit.name
                                  );
                                  setSearch({});
                                }}
                              >
                                {unit.name}
                              </li>
                            ))}
                          <li
                            className="extra"
                            onClick={() => {
                              handleInputChange(rowIndex, "unit", "-");
                              setSearch({});
                            }}
                          >
                            --- none ---
                          </li>
                        </ul>
                      )}
                    </td> */}
                  <td className="  border border-gray-300">
                    <input
                      className="w-full px-1 py-1 text-center bg-gray-100 rounded-sm"
                      type="number"
                      value={rows[rowIndex].price_per_unit}
                      onChange={(e) => {
                        if (rows[rowIndex].PurchasePrice > e.target.value) {
                          alert("less than Purchase Price, May cause loss");
                        }
                        handleInputChange(rowIndex, "price", e.target.value);
                      }}
                    />
                  </td>
                  {/* <td className="  border border-gray-300">
                      <input
                        className="w-full px-1 py-1 text-center"
                        type="number"
                        value={rows[rowIndex].discountPercentage}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            "discountPercentage",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="  border border-gray-300">
                      <input
                        className="w-full  px-1 py-1 text-center "
                        type="number"
                        value={rows[rowIndex].discount}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            "discount",
                            e.target.value
                          )
                        }
                      />
                    </td> */}
                  {/* <td className="   border border-gray-300">
                      <select
                        name=""
                        id=""
                        className="w-full px-1 py-1 text-center"
                        value={rows[rowIndex].taxPercentage}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            "taxPercentage",
                            e.target.value
                          )
                        }
                      >
                        {data.tax?.map((unit) => (
                          <option key={unit.name} value={unit.value}>
                            {unit.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="   border border-gray-300">
                      <input
                        className="w-full px-1 py-1 text-center"
                        type="number"
                        value={rows[rowIndex].tax}
                        onChange={(e) =>
                          handleInputChange(rowIndex, "tax", e.target.value)
                        }
                      />
                    </td> */}
                  <td className="   border border-gray-300">
                    <input
                      className="w-full px-1 py-1"
                      type="number"
                      value={rows[rowIndex].amount}
                      onChange={(e) =>
                        handleInputChange(rowIndex, "amount", e.target.value)
                      }
                    />
                  </td>
                  <td className=" border border-gray-300">
                    <button
                      className="py-1 px-1 h-full w-full text-center fill-black hover:fill-red-500 rounded-sm"
                      onClick={() =>
                        setRows(rows.filter((r, i) => i !== rowIndex))
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                {/* <td className="px-1 py-1  text-end border-x-0 border border-gray-300"></td>
                <td className="px-1 py-1  text-end border-x-0 border border-gray-300"></td> */}
                <td className="px-1 py-1  border-x-0 flex justify-between items-center font-semibold border border-gray-300">
                  <button
                    onClick={addRow}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    ADD ROW
                  </button>
                  <span>Total</span>
                </td>
                {/* <td className="px-1 py-1  text-end border border-gray-300 border-x-0"></td>
                <td className="px-1 py-1  text-end border border-gray-300 border-x-0"></td>
                <td className="px-1 py-1  text-end border border-gray-300 border-x-0"></td>
                <td className="px-1 py-1  text-end border border-gray-300 border-x-0"></td>
                <td className="px-1 py-1  text-end border border-gray-300 border-x-0"></td>
                <td className="px-1 py-1  text-end border border-gray-300 border-x-0"></td> */}
                <td className="px-1 py-1  text-end border border-gray-300 font-semibold border-x-0">
                  {rows.reduce(
                    (total, row) => total + (parseInt(row.qty) || 0),
                    0
                  )}
                </td>
                {/* <td className="px-1 py-1  text-end border border-gray-300 border-x-0"></td>
                <td className="px-1 py-1  text-end border border-gray-300 border-x-0"></td> */}
                <td className="px-1 py-1  text-end border border-gray-300 border-x-0"></td>
                {/* <td className="px-1 py-1  text-end border border-gray-300 font-semibold border-x-0">
                  {rows.reduce(
                    (total, row) => total + (parseInt(row.discount) || 0),
                    0
                  )}
                </td> */}
                {/* <td className="px-1 py-1  text-end border border-gray-300 border-x-0"></td>
                <td className="px-1 py-1  text-end border border-gray-300 font-semibold border-x-0">
                  {rows.reduce(
                    (total, row) => total + (parseInt(row.tax) || 0),
                    0
                  )}
                </td> */}
                <td className="px-1 py-1  text-end border border-gray-300 font-semibold border-x-0">
                  {rows.reduce(
                    (total, row) => total + (parseInt(row.amount) || 0),
                    0
                  )}
                </td>
                <td className="px-1 py-1  text-end border border-gray-300 font-semibold border-x-0"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        {/* <div className="ai2">
          <div className="cl top">
            <p>ITEM</p>
            <p>QTY</p>
            <p>PRICE</p>
            <p>AMOUNT</p>
          </div>
          {rows.map((row, rowIndex) => (
            <div className="cl" key={rowIndex}>
              <input
                value={row.col1}
                onChange={(e) =>
                  handleInputChange(rowIndex, "item", e.target.value)
                }
              />
              <input
                type="number"
                value={row.col2}
                onChange={(e) =>
                  handleInputChange(rowIndex, "qty", e.target.value)
                }
              />
              <input
                type="number"
                value={row.col4}
                onChange={(e) =>
                  handleInputChange(rowIndex, "price", e.target.value)
                }
              />
              <input
                type="number"
                value={row.amount}
                onChange={(e) =>
                  handleInputChange(rowIndex, "amount", e.target.value)
                }
              />
            </div>
          ))}
        </div> */}
        <div className="ai3">
          <div className="l">
            <input
              type="text"
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add Description..."
            />
            {/* <button onClick={addRow}>ADD ROW</button> */}
          </div>
          <div className="">
            <div className="r">
              <span>Total</span>
              <span>Rs.</span>
              <p>{totalAmount}</p>
            </div>
          </div>
        </div>
        <div className="ai5">
          <button className="save" onClick={() => addExpense()}>
            Save
          </button>
          <button
            className="share"
            onClick={() => alert("feature not implemented")}
          >
            Share{" "}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
