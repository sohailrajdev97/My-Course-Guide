import React, { Component } from "react";
import TimeAgo from "react-timeago";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";

class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            review: null
        };
    }

    componentDidMount() {
        this.setState({review: this.props.review});
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }

    render() {
        if (!this.state.review)
        return <div></div>;
        console.log(this.state.review);
        return (
            <div>
                <Card>
                    <Card.Header>
                    {`${this.state.review.course.id} - ${this.state.review.course.name}`}
                    </Card.Header>
                    <Card.Body>
                    <Table bordered responsive width="100%">
                        <tbody>
                            <tr>
                                <td className="scores" width="50%">
                                    <Table borderless responsive width="50%">
                                    <tbody>
                                        <tr>
                                            <td width="25%">
                                            <Badge variant="secondary">{this.state.review.rating.difficulty}</Badge> Difficulty 
                                            </td>
                                            <td width="25%">
                                            <Badge variant="secondary">{this.state.review.rating.attendance}</Badge> Attendance
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="25%">
                                            <Badge variant="secondary">{this.state.review.rating.grading}</Badge> Grading
                                            </td>
                                            <td width="25%">
                                            <Badge variant="secondary">{this.state.review.rating.textbook}</Badge> Textbook
                                            </td>
                                        </tr>
                                    </tbody>
                                    </Table>
                                    <center><Badge variant="secondary">{this.state.review.rating.overall}</Badge> Overall</center>
                                </td>
                                <td className="comment" width="50%">
                                        {this.state.review.content}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    </Card.Body>
                    <Card.Footer>
                        Submitted <TimeAgo date={this.state.review.createdAt} /> by{" "}
                        {this.state.review.isAnonymous ? "Anonymous": `${this.state.review.student.name} - ${this.state.review.student.id}`}
                    </Card.Footer>
                </Card>
            </div>
        )
    }
}

export default Review;