import React, { useEffect, useRef, useState } from "react";
import dev_url from "../url";

export default function BarcodeMaker({ data, setData }) {
  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState("select");
  let [ImageUrl, setImageUrl] = useState();

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
  useEffect(() => {
    if (ImageUrl) {
      console.log(ImageUrl.url);
      const newData = { ...data };
      let itemIndex = newData.items.findIndex((e) => e.Code === ImageUrl.code);

      newData.items[itemIndex] = {
        ...newData.items[itemIndex],
        barcodeUrl: ImageUrl.url,
      };
      setData(newData);
    }
  }, [ImageUrl]);

  const imgRef = useRef(null);
  const handleSaveImage = () => {
    console.log("works");
    const img = imgRef.current;
    if (img) {
      const imageSrc = img.src;

      // Create an invisible anchor element to trigger the download
      const link = document.createElement("a");
      link.href = imageSrc;
      link.download = "downloaded_image.png"; // Set the desired file name

      // Append the anchor to the body (required for Firefox)
      document.body.appendChild(link);

      // Trigger the download by simulating a click
      link.click();

      // Remove the anchor from the document
      document.body.removeChild(link);
    }
  };

  return (
    <div className="barcode">
      {page === "select" && (
        <>
          <h1>Create / Get barcodes For Your items</h1>
          <p>Select an Item...</p>
          <div className="items">
            {data?.items?.map((item, index) => (
              <div
                // className={
                //   data.Store_item_codes?.includes(item.Code) ? "cl selected" : "cl"
                // }
                className="item"
                key={index}
                onClick={() => {
                  if (item.barcodeUrl) {
                    setImageUrl({ url: item.barcodeUrl });
                  } else {
                    generateurl(item.Code);
                  }
                  setPage("barcode");
                }}
              >
                <p>{item.Code}</p>
                <p>{item.Name}</p>
                <p>{item.purchasePrice}</p>
                <p>{item.salesPrice}</p>
                <p>{item.profit}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {page === "barcode" && (
        <>
          <h1>
            Your barcode for item, please save this image if you want to use it
            on physical products
          </h1>
          <img ref={imgRef} src={ImageUrl?.url} alt="" />
          <button onClick={handleSaveImage}>Save Image</button>
          <button
            onClick={() => {
              setImageUrl();
              setPage("select");
            }}
          >
            Go back
          </button>
        </>
      )}
    </div>
  );
}
