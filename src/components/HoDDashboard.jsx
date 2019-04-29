import React, { Component } from "react";
import Plot from "react-plotly.js";
import { groupBy, pick, sortBy } from "lodash";
import { axiosGET } from "../utils/axiosClient";
import { calcAvg } from "../utils/graphing";
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
        reviews.push({ ...review, createdAt: new Date(review.createdAt) });
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
      reviews = sortBy(reviews, ["createdAt"]);
      questions = sortBy(questions, ["createdAt"]);
      this.setState({ courses, questions, reviews });
    });
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
        monthlyRatings[id][month] = calcAvg(monthlyRevs.map(rev => rev.rating));
      }
    }
    return monthlyRatings;
  }

  allCoursesReviewsCharts(monthlyRatings) {
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

      let layout = {
        title: cid,
        xaxis: { rangeslider: { visible: true } },
        yaxis: {
          range: [1, 5]
        }
      };
      charts.push(<Plot data={data} layout={layout} key={cid} />);
    }
    return charts;
  }

  numRecordsChart() {
    let data = [];
    ["reviews", "questions"].forEach(type => {
      let groupedByMY = groupBy(this.state[type], record =>
        dateformat(record.createdAt, "mmmm yyyy")
      );
      let x = [],
        y = [];
      for (let month of Object.keys(groupedByMY)) {
        let date = new Date(groupedByMY[month][0].createdAt);
        date.setDate(1);
        x.push(date);
        y.push(groupedByMY[month].length);
      }
      data.push({
        x,
        y,
        type: "scatter",
        name: type
      });
    });
    let layout = {
      title: "New Questions/Reviews per Month",
      xaxis: {
        rangeslider: { visible: true },
        type: "date"
      }
    };
    return <Plot data={data} layout={layout} />;
  }

  render() {
    return (
      <div>
        {this.numRecordsChart()}
        {this.state.reviews &&
          this.allCoursesReviewsCharts(
            this.getMonthlyRatings(this.state.reviews)
          )}{" "}
      </div>
    );
  }
}

export default HoDDashboard;
