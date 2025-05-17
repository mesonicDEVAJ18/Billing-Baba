import React from "react";
import Undone from "../components/undone";
import { useNavigate } from "react-router-dom";

export default function Backup({ data, setData }) {
  const Navigate = useNavigate();
  return (
    // <div>
    <div id="info">
      {/* <iframe
        src="https://giphy.com/embed/ND6xkVPaj8tHO"
        width="480"
        height="446"
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen
      ></iframe> */}
      {/* <h2>🔑 Feature locked for Desktop/Mobile Application only</h2> */}

      <img src="./assets/happyGrp.jpg" alt="" />
      <h2>
        <span>Website have Auto Backup enabled 🎊</span>
      </h2>
      <button onClick={() => Navigate("/")}>Go Back</button>
    </div>
    // </div>
  );
}
