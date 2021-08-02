import React from "react";

const Input = ({
  placeholder,
  searchValue,
  onChangeHandle,
  onKeyDownHandle,
  onBlurHandle,
  onFocusHandle,
}) => (
  <input
    type="text"
    placeholder={`${placeholder}`}
    value={searchValue}
    onChange={onChangeHandle}
    onKeyDown={onKeyDownHandle}
    onBlur={onBlurHandle}
    onFocus={onFocusHandle}
  />
);

export default Input;
