/* This is where you declare routes for client side routing and specify which component corresponds to which route */
/* The components for each route should be created in Routes/LazyLoadRoutes.jsx as this will enable lazy loading */
/* Routes or components (like navbar) which you don't want to be lazy loaded can be imported directly in this
 * file and SHOULD NOT be declared in LazyLoadRoutes.jsx
 */

import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import { checkToken, getDecodedToken } from "../utils/jwt";

// Navbar should appear on every page and so should not be lazy loaded
import Header from "../components/Header.jsx";

import { loadProgressBar } from "axios-progress-bar";
import "../styles/progres-bar.css";

// Import lazy loaded route components
import { Home, Login, ErrorPage, Upload, Course } from "./LazyLoadRoutes.jsx";
import Logout from "./Logout.jsx";

loadProgressBar();

const CommonRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        checkToken() ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        checkToken() && getDecodedToken().role === "admin" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null
    };
  }
  setToken(token) {
    this.setState({
      token
    });
  }
  render() {
    return (
      <div>
        <Header decodedToken={getDecodedToken()} />
        <Switch className="main">
          <AdminRoute exact path="/upload" component={Upload} />
          <Route exact path="/courses/:id" component={Course} />
          <Route
            path="/login"
            render={props => (
              <Login {...props} setRouterToken={this.setToken.bind(this)} />
            )}
          />
          <Route
            path="/logout"
            render={props => (
              <Logout {...props} setRouterToken={this.setToken.bind(this)} />
            )}
          />
          <CommonRoute exact path="/" component={Home} />
          <Route component={ErrorPage} />
          {/* This route is run when no matches are found - It's your 404 fallbback */}
        </Switch>

        {/* <Link /> elements are in Navbar.jsx */}
      </div>
    );
  }
}

export default Routes;
