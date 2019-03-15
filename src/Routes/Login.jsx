import React, { Component } from "react";
import { Redirect } from "react-router";
import { GoogleLogin } from "react-google-login";
import { getToken, checkToken } from "../utils/jwt";

import Jumbotron from "react-bootstrap/Jumbotron";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: checkToken(),
      failed: false
    };
  }

  render() {
    let googleSuccess = data => {
      console.log(this.props);
      getToken(data.tokenObj.access_token, (err, token) => {
        if (err) {
          return this.setState({
            failed: true
          });
        }
        this.props.setRouterToken(token);
        this.setState({ authenticated: true });
      });
    };
    let googleFailure = data => {
      console.log(data);
      this.setState({
        failed: true
      });
    };
    if (this.state.authenticated) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="home">
          <Jumbotron>
            <h1>My Course Guide</h1>
            <p>Login to access course material, reviews and lots more !</p>
            <p>
              <GoogleLogin
                clientId="780021042626-li4g2v5l3pr2s4kdmssdsdtcuc0v2e6m.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={googleSuccess}
                onFailure={googleFailure}
              />
            </p>
            <font color="red">
              {this.state.failed
                ? "Account not found. Make sure you are using your BITS mail to login"
                : ""}
            </font>
          </Jumbotron>
        </div>
      );
    }
  }
}

export default Login;
