import React, { Component } from "react";
import { Redirect } from "react-router";
import { GoogleLogin } from "react-google-login";
import { getToken, checkToken } from "../utils/jwt";

import LazyHero from "react-lazy-hero";
import logo from "../assets/logo.png";
import back1 from "../assets/back1.jpg";
import back2 from "../assets/back2.jpg";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
            parallaxOffset={100}
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
              <img
                src={logo}
                height="auto"
                width="100%"
                alt="My Course Guide"
              />
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
            <br />
            <br />
            <div>
              <h2>Contact Us</h2>
              <Row>
                <Col />
                <Col>Krut Patel(Scrum Master)</Col>
                <Col>2017A7PS0184H</Col>
                <Col />
              </Row>
              <Row>
                <Col />
                <Col>Rynaa Grover(Product Owner)</Col>
                <Col>2017A7PS0258H</Col>
                <Col />
              </Row>
              <Row>
                <Col />
                <Col>Niral Khambhati</Col>
                <Col>2017A7PS0130H</Col>
                <Col />
              </Row>
              <Row>
                <Col />
                <Col>Sohail Rajdev</Col>
                <Col>2016AAPS0158H</Col>
                <Col />
              </Row>
              <Row>
                <Col />
                <Col>Arnav Buch</Col>
                <Col>2017A7PS1722H</Col>
                <Col />
              </Row>
            </div>
            <br />
            <br />
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
