import React, { Component } from "react";
import ReportedReview from "./ReportedReview";
import { axiosGET, axiosDELETE } from "../utils/axiosClient";
import SeeAll from "./SeeAll";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: []
    };
  }
  async getReports() {
    let reports = [];
    await axiosGET("/api/reports").then(res => {
      reports = res.data;
    });
    let idSet = new Set();
    let uniqueReports = [];
    reports.forEach(report => {
      if (!idSet.has(report.for._id)) {
        idSet.add(report.for._id);
        uniqueReports.push(report);
      }
    });
    this.setState({ reports: uniqueReports });
  }
  componentDidMount() {
    this.getReports();
  }
  generateReviewsList() {
    let reviews = [];
    this.state.reports.forEach(report => {
      reviews.push(
        <div key={report._id}>
          <ReportedReview key={`${report.for._id}`} review={report.for} />
          <div className="text-right">
            <ButtonGroup>
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  axiosDELETE(`/api/reports/${report._id}`).then(res => {
                    this.getReports();
                  });
                }}
              >
                Keep
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => {
                  axiosDELETE(
                    `/api/reports/${report._id}?deleteReview=true`
                  ).then(res => {
                    if (res.msg === "Report and Review deleted")
                      this.getReports();
                  });
                }}
              >
                Delete
              </Button>
            </ButtonGroup>
          </div>
          <hr />
        </div>
      );
    });
    return <SeeAll items={reviews} count={5} name="reviews" />;
  }
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1 className="text-center">Reported Reviews</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              <div>{this.generateReviewsList()}</div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AdminDashboard;
