import React, { useState } from "react";
function CustomInput({
  inputValue,
  setInputValue,
  placeholder,
  disab = false,
}) {
  const [isFocused, setIsFocused] = useState(false);
  // const [inputValue, setInputValue] = useState("");

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!inputValue) {
      setIsFocused(false);
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div
      className={`input-container ${
        isFocused || inputValue ? "input-focused" : ""
      }`}
    >
      <input
        type="text"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        disabled={disab}
        onFocus={() => setIsFocused(true)}
        onBlur={() => !inputValue && setIsFocused(false)}
      />
      <label>{placeholder}</label>
    </div>
  );
}

export default CustomInput;
