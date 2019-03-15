import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes/index.jsx";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <BrowserRouter basename="/">
    <Routes />
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
