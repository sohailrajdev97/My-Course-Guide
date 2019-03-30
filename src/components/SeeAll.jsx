import React, { Component } from "react";
import { Link } from "react-router-dom";

class SeeAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exapnded: false
    };
  }
  toggleState() {
    this.setState({
      exapnded: !this.state.exapnded
    });
  }
  render() {
    if (this.state.exapnded) {
      return (
        <div>
          {this.props.items}
          <Link to="#" onClick={this.toggleState.bind(this)}>See Less</Link>
        </div>
      )
    } else {
      return (
        <div>
          {this.props.items.slice(0, this.props.count)}
          <Link to="#" onClick={this.toggleState.bind(this)}>See All</Link>
        </div>
      )
    }
  }
}

export default SeeAll;
