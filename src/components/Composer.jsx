import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Slider from "rc-slider";
import Form from "react-bootstrap/Form";
import "rc-slider/assets/index.css";

class Composer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Modal show={this.props.show}>
        <Modal.Header closeButton>
          <Modal.Title>Add your review for this course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <h6>Textbook usage</h6>
            <Slider min={0} max={5} dots />
            <br />
            <h6>Grading</h6>
            <Slider min={0} max={5} dots />
            <br />
            <h6>Level of Difficulty</h6>
            <Slider min={0} max={5} dots />
            <br />
            <h6>Skippable classes</h6>
            <Slider min={0} max={5} dots />
            <br />
            <h6>Overall</h6>
            <Slider min={0} max={5} dots />
            <br />
            <h6>Review</h6>
            <textarea />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={this.props.onHide}>
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Composer;
