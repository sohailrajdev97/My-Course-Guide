import React, { Component } from "react";
import Plot from "react-plotly.js";
import { groupBy, pick } from "lodash";
import { axiosGET } from "../utils/axiosClient";
const dateformat = require("dateformat");

class HoDDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      questions: [],
      reviews: []
    };
  }

  componentDidMount() {
    axiosGET("/api/records").then(res => {
      let courseIDs = new Set();
      let courses = [];
      let reviews = [];
      let questions = [];
      res.data.reviews.forEach(review => {
        reviews.push(review);
        if (!courseIDs.has(review.course.id)) {
          courseIDs.add(review.course.id);
          courses.push(review.course);
        }
      });
      res.data.questions.forEach(question => {
        questions.push(question);
        if (!courseIDs.has(question.course.id)) {
          courseIDs.add(question.course.id);
          courses.push(question.course);
        }
      });
      courses.sort((left, right) => {
        return right.name < left.name;
      });
      this.setState({ courses, questions, reviews });
    });
  }

  calcAvg(arr) {
    // calc avg fields of array of objects
    let avg = {};
    let mapped = arr.reduce(
      (acc, obj) =>
        Object.keys(obj).reduce(
          (acc, key) =>
            acc.set(
              key,
              (([sum, count]) => [sum + obj[key], count + 1])(
                acc.get(key) || [0, 0]
              )
            ),
          acc
        ),
      new Map()
    );
    mapped.forEach((k, v) => (avg[v] = k[0] / k[1]));
    return avg;
  }

  getMonthlyRatings(reviews) {
    reviews = reviews.map(review =>
      pick(review, ["rating", "createdAt", "course"])
    );
    let groupedByCourse = groupBy(reviews, review => review.course.id);
    let monthlyRatings = {};
    let cumMonthlyRatings = {};
    for (let [id, revs] of Object.entries(groupedByCourse)) {
      monthlyRatings[id] = {};
      cumMonthlyRatings[id] = {};
      let groupedByMY = groupBy(revs, review =>
        dateformat(review.createdAt, "mmmm yyyy")
      );
      for (let [month, monthlyRevs] of Object.entries(groupedByMY)) {
        monthlyRatings[id][month] = this.calcAvg(
          monthlyRevs.map(rev => rev.rating)
        );
      }
    }
    return monthlyRatings;
  }

  allCoursesChart(monthlyRatings) {
    let charts = [];
    for (let [cid, monthly] of Object.entries(monthlyRatings)) {
      let data = [];
      for (let param of Object.keys(Object.values(monthly)[0])) {
        let trace = {
          x: Object.keys(monthly),
          y: Object.values(monthly).map(rating => rating[param]),
          mode: "lines",
          name: param
        };
        data.push(trace);
      }
      charts.push(<Plot data={data} layout={{ title: cid }} key={cid} />);
    }
    return charts;
  }

  render() {
    return (
      <div>
        {" "}
        {this.state.reviews &&
          this.allCoursesChart(this.getMonthlyRatings(this.state.reviews))}{" "}
      </div>
    );
  }
}

export default HoDDashboard;
