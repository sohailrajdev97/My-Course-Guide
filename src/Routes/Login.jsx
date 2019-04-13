import React, { Component } from "react";
import { Redirect } from "react-router";
import { GoogleLogin } from "react-google-login";
import { getToken, checkToken } from "../utils/jwt";

import LazyHero from "react-lazy-hero";
import logo from "../assets/logo.png";
import back1 from "../assets/back1.jpg";
import back2 from "../assets/back2.jpg";

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
      this.setState({
        failed: true
      });
    };
    if (this.state.authenticated) {
      return <Redirect to="/" />;
    } else {
      return (
        <div style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
          <LazyHero
            color="#000000"
            opacity={0.6}
            imageSrc={back1}
            minHeight="100vh"
            parallaxOffset="100"
            isCentered="false"
          >
            <div
              className="home"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                textAlign: "center",
                color: "white"
              }}
            >
              <img src={logo} height="100vh" alt="My Course Guide" />
              <br />
              <br />
              <h2>Helping you make better choices</h2>
              <br />

              <h5
                style={{
                  margin: "10px"
                }}
              >
                Let's Get Started
              </h5>
              <p>
                <GoogleLogin
                  clientId="780021042626-li4g2v5l3pr2s4kdmssdsdtcuc0v2e6m.apps.googleusercontent.com"
                  onSuccess={googleSuccess}
                  onFailure={googleFailure}
                  theme="dark"
                  icon={false}
                  buttonText="Login with BITSMail"
                />
              </p>
              <font color="red">
                {this.state.failed
                  ? "Account not found. Make sure you are using your BITS mail to login"
                  : ""}
              </font>
            </div>
          </LazyHero>
          <LazyHero
            minHeight="75vh"
            opacity={0.8}
            imageSrc={back2}
            style={{ textAlign: "center", color: "Black" }}
          >
            <h2>
              <b>
                <u>About MCG</u>
              </b>
            </h2>
            <h4 style={{ marginLeft: "10%", marginRight: "10%" }}>
              We here at My Course Guide aim to provide a platform for students
              as well as professors to give and receive constructive feedback
              about any course(s) they have taken, and help others by answering
              their queries.
            </h4>
            <div
              style={{
                color: "rgb(66, 133, 244)"
              }}
            >
              <br />
              Made with <span style={{ color: "#e25555" }}>❤</span> in Hyderabad
            </div>
          </LazyHero>
        </div>
      );
    }
  }
}

export default Login;
