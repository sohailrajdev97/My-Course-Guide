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
    return (
      <div>
        {this.state.exapnded ? this.props.items : this.props.items.slice(0, this.props.count)}
        {this.props.items.length <= this.props.count ? null : this.state.exapnded ? <Link to="#" onClick={this.toggleState.bind(this)}>See Less</Link> : <Link to="#" onClick={this.toggleState.bind(this)}>See All</Link>}
      </div>
    );
  }
}

export default SeeAll;
