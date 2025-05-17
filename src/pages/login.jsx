import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  saveUidToLocalStorage,
  signInWithGoogle,
  signInWithPhoneNum,
  verifyOTP,
} from "../firebase";

export default function LogIn({ sw = false }) {
  const [Switch, setSwitch] = useState(sw ? "add-info" : "login");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [BusinessName, setBusinessName] = useState("");
  const [GSTIN, setGSTIN] = useState("");
  const [Mobile, setMobil] = useState("");
  const [password, setPassword] = useState("");

  const history = useNavigate();
  const signup = () => {
    let res = registerWithEmailAndPassword(email, password, name);
    console.log(res);
    // alert(res);
    saveUidToLocalStorage(res);
    setSwitch("login");
    history("/");
  };

  const login = () => {
    let res = logInWithEmailAndPassword(email, password);
    console.log(res);
    // alert(res);
    saveUidToLocalStorage(res.data);
    // history("/");
    window.location.href = "/";
    setSwitch("signup");
  };


  let [otpToggle, setotpToggle] = useState(false);
  let [otp, setOtp] = useState("");
  let [mobile, setMobile] = useState("");
  let [loading, setLoading] = useState(false);
  let [toggle, setToggle] = useState(true);

  let [phoneCode, setPhoneCode] = useState("+91");
  const handleGetOTP = async () => {
    setLoading(true);

    try {
      const res = await signInWithPhoneNum(phoneCode + mobile, "captcha");
      console.log(res);
      if (res) {
        setotpToggle(true);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      if (otp) {
        const res = await verifyOTP(otp);
        console.log(res);
        const user = res.data;
        // handleAuthResult(user, false);
        saveUidToLocalStorage(res.data);
        // history("/");
        window.location.href = "/";
      } else {
        alert("enter otp");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  return (
    <div className="w-screen h-screen flex justify-center bg-gray-100 items-center">
        <div className="w-1/3 bg-white rounded-lg shadow-lg flex flex-col justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <img src="./assets/BillingBabaLogo.png" className="w-16 h-16" alt="logo" />
          <div className="font-bold">Billing Baba</div>
        </div>
          <span className="font-semibold">

          Ab Business Karo Tenstion Free.
          </span>
          
            <div className="flex w-full">

              <h1 className={`font-semibold mt-4 text-xl p-4 flex-1 hover:border-b-2 text-center ${toggle && "border-b-2"} border-gray-200`} onClick={()=>setToggle(true)}>Mobile No.</h1>
              <h1 className={`font-semibold mt-4 text-xl p-4 flex-1 hover:border-b-2 text-center ${!toggle && "border-b-2"} border-gray-300`} onClick={()=>setToggle(false)}>Email</h1>
            </div>
            {toggle?(
              <form className="w-full">
              <div className="my-4">
                <div className="flex shadow rounded w-full">
                  <select
                    name="code"
                    id=""
                    className="border-r-0 appearance-none border py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) => setPhoneCode(e.target.value)}
                  >
                    <option value="+91">+91</option>
                  </select>
                  <input
                    className="flex-1  border-l-0 appearance-none border  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="number"
                    type="text"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>
              <div id="captcha"></div>
              {otpToggle && (
                <div className="mb-6">
                  <input
                    className={` shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                    id="password"
                    type="password"
                    placeholder="Enter your OTP"
                    disabled={!otpToggle}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center mt-10 justify-between w-full">
                {otpToggle ? (
                  <button
                    className="bg-[#007FFF] w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-rose-400"
                    type="button"
                    onClick={handleVerifyOTP}
                  >
                    Sign In
                  </button>
                ) : (
                  <>
                    {loading ? (
                      <div class="container_login mx-auto">
                        <h1>Loading</h1>
                        {/* <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div> */}
                      </div>
                    ) : (
                      <button
                        className="bg-[#007FFF] w-full hover:bg-blue-700 text-white font-bold transiton py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-rose-400"
                        type="button"
                        onClick={handleGetOTP}
                      >
                        Send OTP
                      </button>
                    )}
                  </>
                )}
              </div>
            </form>
            ) : Switch === "login" ?(
              <>
            
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name="email"
                className="p-2 rounded-md shadow-sm hover:shadow-md w-full text-lg mt-2"
                placeholder="Enter your email"
                />
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="p-2 rounded-md shadow-sm hover:shadow-md w-full text-lg mt-2"
                name="password"
                placeholder="Enter your password"
              />
              <button onClick={(e) => login()}
                className="flex bg-blue-100 w-full my-4 font-semibold  py-2 px-4 justify-center items-center gap-4 rounded-md shadow-md hover:shadow-lg"
                >Log In</button>
                
              <div className="line"></div>
              <p>If you dont have an account, please Sign Up</p>
              <button className="flex w-full border-2 my-4 font-semibold  py-2 px-4 justify-center items-center gap-4 rounded-md shadow-md hover:shadow-lg"
                onClick={() => setSwitch("signup")}>Sign Up</button>
              </>
            ):(
              <>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  // name="email"
                  placeholder="Email"
                className="p-2 rounded-md shadow-sm hover:shadow-md w-full text-lg mt-2"
                />
                <input
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  // name="name"
                  placeholder="Full name"
                className="p-2 rounded-md shadow-sm hover:shadow-md w-full text-lg mt-2"
                />
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  // name="password"
                className="p-2 rounded-md shadow-sm hover:shadow-md w-full text-lg mt-2"
                  placeholder="Password"
                />
                <button onClick={(e) => signup()}
                className="flex bg-blue-100 w-full my-4 font-semibold  py-2 px-4 justify-center items-center gap-4 rounded-md shadow-md hover:shadow-lg">Sign Up</button>
                <div className="line"></div>
                <p>If you aready have an account, please login</p>
                <button className="flex w-full border-2 my-4 font-semibold  py-2 px-4 justify-center items-center gap-4 rounded-md shadow-md hover:shadow-lg" onClick={() => setSwitch("login")}>Log-In</button>
              </>
            )}
              <button
                onClick={async (e) => {
                  let res = await signInWithGoogle();
                  saveUidToLocalStorage(res.data.uid);
                  // alert(res.data.uid);
                  window.location.href = "/";
                  history("/");
                }}
                className="flex bg-blue-600 w-full mt-4 text-white font-semibold py-2 px-4 justify-center items-center gap-4 rounded-md shadow-md hover:shadow-lg"
              >
                <img src="./assets/google_icon.png" alt="google logo" className=" w-4 h-" />
                Log In with Google
              </button>
         
          {/* {Switch === "signup" && } */}
        </div>
    </div>
  );
}
