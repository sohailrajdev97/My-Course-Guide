import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./Routes/index.jsx";

class App extends Component {
  render() {
    return (
      <BrowserRouter basename="/">
        <Routes />
      </BrowserRouter>
    );
  }
}

export default App;
