import React from "react";
import * as Icon from "react-bootstrap-icons";

const Button = ({ btnClass, icon, size, onClickHandle }) => (
  <button className={btnClass} onClick={onClickHandle}>
    {icon === "x" ? <Icon.X size={size} /> : <Icon.Search size={size} />}
  </button>
);

export default Button;
