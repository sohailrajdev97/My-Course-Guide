import React, { Component } from "react";
import { Redirect } from "react-router";
import { GoogleLogin } from "react-google-login";
import { getToken, getDecodedToken } from "./utils/jwt";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: getDecodedToken() ? true : false
    };
  }

  render() {
    let googleSuccess = data => {
      getToken(data.tokenObj.access_token, (err, token) => {
        this.setState({
          authenticated: true
        });
      });
    };
    let googleFailure = data => {
      console.log(data.tokenObj.access_token);
    };
    if (this.state.authenticated) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="home">
          <h1>Welcome</h1>
          <br />
          <GoogleLogin
            clientId="780021042626-li4g2v5l3pr2s4kdmssdsdtcuc0v2e6m.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={googleSuccess}
            onFailure={googleFailure}
          />
        </div>
      );
    }
  }
}

export default Home;
