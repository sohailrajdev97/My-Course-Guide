import React, { Component } from "react";

import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";
import logo from "../assets/logo.png";

import { getDecodedToken } from "../utils/jwt";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: this.props.role,
      token: getDecodedToken()
    };
  }
  getCommonJSX() {
    return (
      <Nav>
        <NavDropdown title={this.state.token.name} id="collasible-nav-dropdown">
          <NavDropdown.Item href="#">Preferences</NavDropdown.Item>
          <NavDropdown.Divider />
          <LinkContainer to="/logout">
            <NavDropdown.Item>Logout</NavDropdown.Item>
          </LinkContainer>
        </NavDropdown>
        <Navbar.Brand>
          <Image
            src={this.state.token.picture}
            width="35"
            height="35"
            roundedCircle
          />
        </Navbar.Brand>
      </Nav>
    );
  }
  getAdminJSX() {
    return (
      <Nav className="mr-auto">
        <LinkContainer to="/upload">
          <Nav.Link>Import Data</Nav.Link>
        </LinkContainer>
      </Nav>
    );
  }
  getSearchBarJSX() {
    return (
      <Form inline>
        <FormControl
          type="text"
          placeholder="Search Courses"
          className="mr-sm-2"
        />
        <Button variant="outline-light">Search</Button>
      </Form>
    );
  }
  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <LinkContainer to="/">
          <Navbar.Brand href="#home">
            <img
              src={logo}
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {this.state.role == "admin" ? this.getAdminJSX() : null}
          {this.state.role ? this.getSearchBarJSX() : null}
          {this.state.role ? this.getCommonJSX() : null}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
