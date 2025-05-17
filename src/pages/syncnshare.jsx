import React from "react";
import Undone from "../components/undone";
import { useNavigate } from "react-router-dom";

export default function Syncnshare() {
  const Navigate = useNavigate();
  return (
    <div id="info">
      {/* <iframe
        src="https://giphy.com/embed/ToMjGpxInCZSzD3V82s"
        width="480"
        height="249"
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen
      ></iframe> */}
      {/* <h2>🔒 This Feature is for Desktop/Mobile Application only,</h2> */}

      <img src="./assets/happyGrp.jpg" alt="" />
      <h2>
        <span>Website data is auto synced 🎉</span>
      </h2>
      <button onClick={() => Navigate("/")}>Go Back</button>
    </div>
  );
}
