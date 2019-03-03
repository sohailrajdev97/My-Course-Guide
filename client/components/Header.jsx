import React, { Component } from "react";
import { axiosGET } from "../utils/axiosClient";

import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";
import logo from "../assets/logo.png";

import { AsyncTypeahead, Menu } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";

import "../styles/header.css";

class Header extends Component {
  constructor(props) {
    super(props);
    let decodedToken = this.props.decodedToken;
    this.state = {
      role: decodedToken ? decodedToken.role : null,
      decodedToken,
      isSearchLoading: false,
      courses: []
    };
  }

  componentWillReceiveProps(nextProps) {
    let nextDecoded = nextProps.decodedToken;
    if (nextDecoded !== this.state.decodedToken) {
      this.setState({
        role: nextDecoded ? nextDecoded.role : null,
        decodedToken: nextProps.decodedToken
      });
    }
  }
  getCommonJSX() {
    return (
      <Nav>
        {this.getSearchBarJSX()}
        <NavDropdown
          title={this.state.decodedToken.name}
          id="collasible-nav-dropdown"
        >
          <NavDropdown.Item href="#">Preferences</NavDropdown.Item>
          <NavDropdown.Divider />
          <LinkContainer to="/logout">
            <NavDropdown.Item>Logout</NavDropdown.Item>
          </LinkContainer>
        </NavDropdown>
        <Navbar.Brand>
          <Image
            src={this.state.decodedToken.picture}
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
  // redirect(courses) {
  //   console.log("as", courses);
  // }
  getSearchBarJSX() {
    return (
      <AsyncTypeahead
        isLoading={this.state.isSearchLoading}
        id="searchTypeahead"
        align="left"
        placeholder="Search Courses"
        selected={this.state.selectedCourse}
        onSearch={query => {
          if (query.length >= 2) {
            this.setState({ isSearchLoading: true });
            axiosGET(`/api/courses/name/${query}`).then(res => {
              let courses = res.data.map(({ name, id, ...rest }) => {
                return { label: id + " " + name, ...rest, id };
              });
              this.setState({ isSearchLoading: false, courses });
            });
          }
        }}
        renderMenu={(results, menuProps) => (
          <Menu {...menuProps}>
            {results.map((result, index) => (
              <LinkContainer to={`/courses/${result.id}`} key={result.id}>
                <Nav.Link>
                  <div className="searchItem">{result.label}</div>
                </Nav.Link>
              </LinkContainer>
            ))}
          </Menu>
        )}
        options={this.state.courses}
      />
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
              alt="My Course Guide"
            />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {this.state.role == "admin" ? this.getAdminJSX() : null}
          {this.state.role ? this.getCommonJSX() : null}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
