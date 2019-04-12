import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import Slider, { createSliderWithTooltip } from "rc-slider";
import "rc-slider/assets/index.css";

import { axiosPOST } from "../utils/axiosClient";
import "../styles/tooltip.css";
import { labels } from "../assets/labels";

const SliderWithTooltip = createSliderWithTooltip(Slider);
class Composer extends Component {
  constructor(props) {
    super(props);
    this.ratingFields = [
      "difficulty",
      "textbook",
      "grading",
      "attendance",
      "overall"
    ];
    this.submitForm = this.submitForm.bind(this);
  }
  clearState() {
    let state = {
      isSubmitting: false,
      submitted: false,
      rating: "",
      isAnonymous: false
    };
    this.ratingFields.forEach(field => {
      state[field] = 3;
    });
    this.setState(state);
  }
  async submitForm(e) {
    this.setState({ isSubmitting: true });
    e.preventDefault();
    const review = e.target[0].value;
    var payload;
    if (this.props.type === "Review") {
      payload = {
        course: this.props.course._id,
        type: this.props.type,
        content: review,
        rating: {},
        isAnonymous: this.state.isAnonymous
      };
      this.ratingFields.forEach(
        field => (payload.rating[field] = this.state[field])
      );
    } else if (this.props.type === "Question") {
      payload = {
        course: this.props.course._id,
        type: this.props.type,
        content: review,
        isAnonymous: this.state.isAnonymous
      };
    } else if (this.props.type === "Answer") {
      payload = {
        record: this.props.question._id,
        content: review
      };
    }
    if (this.props.type !== "Answer") {
      try {
        await axiosPOST("/api/records", payload);
        this.setState({ submitted: true });
        this.props.refreshRecords();
      } catch (e) {
        console.log(e);
      }
      this.clearState();
      this.props.onHide();
    } else {
      try {
        await axiosPOST("/api/replies", payload);
        this.setState({ submitted: true });
        this.props.refreshRecords();
      } catch (e) {
        console.log(e);
      }
      this.clearState();
      this.props.onHide();
    }
  }
  componentDidMount() {
    this.clearState();
  }

  render() {
    const isSubmitting = this.state && this.state.isSubmitting;
    const desc = [
      "Level of Difficulty",
      "Textbook usage",
      "Grading",
      "Skippable classes",
      "Overall"
    ];
    let trackColor = index => {
      if (!this.state) return;
      let val = this.state[this.ratingFields[index]];
      switch (val) {
        case 1:
        case 2:
          return "#CC0000";
        case 3:
          return "#E1AD01";
        case 4:
        case 5:
          return "#009900";
        default:
          return "#E1AD01";
      }
    };
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.type} for {this.props.course && this.props.course.id}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.submitForm}>
          <Modal.Body>
            {desc.map((label, index) => (
              <Form.Group
                key={this.ratingFields[index]}
                style={{
                  display: this.props.type === "Review" ? "" : "none"
                }}
              >
                <Form.Label>{label}</Form.Label>
                <SliderWithTooltip
                  min={1}
                  max={5}
                  dots
                  defaultValue={3}
                  value={this.state && this.state[this.ratingFields[index]]}
                  onChange={value => {
                    this.setState({
                      [this.ratingFields[index]]: value
                    });
                  }}
                  tipFormatter={value => labels[index][value - 1]}
                  tipProps={{ placement: "bottom" }}
                  trackStyle={{
                    backgroundColor: trackColor(index),
                    width: "7px",
                    height: "7px"
                  }}
                  handleStyle={{ backgroundColor: trackColor(index) }}
                  activeDotStyle={{ width: "10px", height: "10px" }}
                />

                <br />
              </Form.Group>
            ))}
            {this.props.type === "Answer" && (
              <Form.Label>
                {this.props.question && this.props.question.content}
              </Form.Label>
            )}
            <Form.Group controlId="reviewArea">
              <Form.Label>Your {this.props.type}:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={`Write here`}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {this.props.type !== "Answer" && (
              <Form.Check
                onClick={() => {
                  this.setState({
                    isAnonymous: this.state.isAnonymous ? false : true
                  });
                }}
                type="checkbox"
                name="isAnonymous"
                id="isAnonymous"
                label="Submit Anonymously"
              />
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                this.clearState();
                this.props.onHide();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default Composer;
