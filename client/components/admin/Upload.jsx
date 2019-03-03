import React, { Component } from "react";
import { server } from "../../utils/config";

import ReactTable from "react-table";
import "react-table/react-table.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidRows: null,
      cols: null
    };
    this.clearTable = () => {
      this.setState({
        invalidRows: null,
        cols: null,
        errorMsg: null
      });
    };
  }
  handleError(res) {
    let data = JSON.parse(res);
    console.log(data);
    if (!data.invalidRows && data.msg) {
      this.setState({
        errorMsg: data.msg
      });
      return;
    }
    let rows = data.invalidRows;
    console.log(rows, data, data.invalidRows);
    if (!rows || !rows.length) {
      this.setState({
        errorMsg:
          "There was an error while parsing the file. Please ensure it is valid."
      });
      return;
    }
    let keys = Object.keys(rows[0]);
    let cols = [];
    keys.forEach(key => {
      if (!key) {
        this.setState({
          errorMsg:
            "There was an error while parsing the file. Please ensure it is valid."
        });
        return;
      }
      cols.push({
        Header: key,
        accessor: key
      });
    });
    this.setState({
      invalidRows: rows,
      cols: cols,
      errorMsg:
        "Errors were encountered while parsing the following lines in the uploaded file:"
    });
  }
  handleInit() {
    console.log(this.pond);
    this.pond._pond.setOptions({
      server: {
        url: `${server}/api/csv`,
        process: {
          url: "/",
          timeout: 3000000,
          method: "POST",
          headers: {
            "x-access-token": sessionStorage.getItem("token")
          },
          onload: this.clearTable,
          onerror: res => this.handleError(res)
        },
        revert: null,
        restore: null,
        remove: null
      }
    });
  }
  render() {
    return (
      <Container>
        <br />
        <Row>
          <Col lg={12}>
            <FilePond
              ref={ref => (this.pond = ref)}
              oninit={() => this.handleInit()}
              name="csv"
              onremovefile={this.clearTable}
            />
            {this.state.errorMsg ? (
              <div>
                {this.state.errorMsg}
                <p />
                {this.state.cols ? (
                  <ReactTable
                    data={this.state.invalidRows}
                    columns={this.state.cols}
                    defaultPageSize={5}
                  />
                ) : null}
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Upload;
