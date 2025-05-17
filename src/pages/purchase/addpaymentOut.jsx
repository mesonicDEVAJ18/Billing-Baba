import React, { useState } from "react";
import CustomInput from "../../components/customInput";
import { useNavigate } from "react-router-dom";
import dev_url from "../../url";

export default function AddPaymentsOut({
  data,
  setData,
  t = true,
  setChange,
  change,
}) {
  const Navigate = useNavigate();
  var [Name, setName] = useState();
  var [paymentType, setPaymentType] = useState();
  var [Desc, setDesc] = useState();
  var [date, setdate] = useState();
  var [reciptno, setReciptNo] = useState();
  var [amount, setAmount] = useState();
  const addItemReq = async () => {
    let newData = {
      Name: Name ? Name : "",
      paymentType: paymentType ? paymentType : "cash",
      description: Desc ? Desc : "",
      date: date ? date : "",
      reciptno: reciptno ? reciptno : "",
      amount: amount ? amount : "",
      total: amount ? amount : "",
      type: "Payment-Out",
      transactionType: "Payment-Out",
    };

    let newDa = data;
    newDa.Transactions
      ? newDa.Transactions.push(newData)
      : (newDa.Transactions = [newData]);

    // change everywehre this is used to the sum of sales where payment type is credit
    newDa.to_pay
      ? (newDa.to_pay += parseFloat(newData.amount))
      : (newDa.to_pay = +parseFloat(newData.amount));

    newData.credit = newDa.parties.find((ele) => ele.partyName === Name).credit;

    newDa.parties.find((ele) => ele.partyName === Name).credit
      ? (newDa.parties.find((ele) => ele.partyName === Name).credit +=
          parseFloat(newData.amount))
      : (newDa.parties.find((ele) => ele.partyName === Name).credit =
          parseFloat(newData.amount));
    newDa.cash_in_hands
      ? (newDa.cash_in_hands -= parseFloat(newData.amount))
      : (newDa.cash_in_hands = -parseFloat(newData.amount));

    newData.balance = newDa.parties.find(
      (ele) => ele.partyName === Name
    ).credit;

    console.log(newDa);
    setData(newDa);
    setChange(!change);
    Navigate("/payment-out");
    return;
  };

  return (
    <div id="addItem">
      <div className="container">
        <div className="top">
          <div className="l">
            <h1>Payment-Out</h1>
            {/* <p>Product</p>
                <div
                  className={toggle ? "toggle" : "toggle opp"}
                  onClick={() => setToggle(!toggle)}
                >
                  <div className="button"></div>
                </div>
                <p>service</p> */}
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
            <button onClick={() => Navigate("/payment-in")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex justify-between p-3 px-6">
          <div className="flex flex-col gap-3 p-3">
            <div className="">
              <CustomInput
                inputValue={Name}
                setInputValue={setName}
                placeholder={"party *"}
              />
              <div className="p-2 flex flex-col gap-2">
                {data?.parties
                  ?.filter(
                    (e) =>
                      Name?.toLowerCase()
                        .split(" ")
                        .every((word) =>
                          e.partyName.toLowerCase().includes(word)
                        )
                    // e.partyName.toLowerCase().includes(SearchQuerry.toLowerCase())
                  )
                  .map((party, index) => (
                    <h1 onClick={() => setName(party.partyName)}>
                      {party.partyName}
                    </h1>
                  ))}
              </div>
            </div>
            <select
              onChange={(e) => setPaymentType(e.target.value)}
              className="box border-b-2 border-gray-400 p-3"
            >
              <option selected disabled value="">
                Payment type
              </option>
              <option value="">Cash</option>
              <option value="">Check</option>
            </select>
            <CustomInput
              inputValue={Desc}
              setInputValue={setDesc}
              placeholder={"Payment Description"}
            />
            {/* <button>Select Unit</button> */}
          </div>
          <div className="flex flex-col gap-3 p-3">
            {/* <input autoComplete="off" type="text" className="box" /> */}
            <input
              type="date"
              value={date}
              onChange={(e) => setdate(e.target.value)}
              id="birthday"
              className="p-3 border-b-2 border-gray-400"
              name="birthday"
            ></input>

            <CustomInput
              inputValue={reciptno}
              setInputValue={setReciptNo}
              placeholder={"Recipt number"}
            />
            <br />
            <br />
            <br />
            <CustomInput
              inputValue={amount}
              setInputValue={setAmount}
              placeholder={"Recieved Ammount"}
            />
          </div>
        </div>
        <div className="c3">
          <button onClick={() => addItemReq()}>Share</button>
          <button onClick={() => addItemReq()}>Save</button>
        </div>
      </div>
    </div>
  );
}
