import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class DatePickerInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: new Date()
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(date) {
		this.setState({
			startDate: date
		});
	}

	render() {
		return (
			<div className="input-group">
				<div className="input-group-prepend">
					<span className="input-group-text" />
					Start Date
				</div>
				<div className="custom-file">
					<DatePicker selected={this.state.startDate} onChange={this.handleChange} placeholderText="Start Date" />
				</div>
			</div>
		);
	}
}

export default DatePickerInput;
