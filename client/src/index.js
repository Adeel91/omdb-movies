import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./stylesheet/main.css";
import Layout from "./layout";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <Provider store={configureStore()}>
    <React.StrictMode>
      <Fragment>
        <Layout />
      </Fragment>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
