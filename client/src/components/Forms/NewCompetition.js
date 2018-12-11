import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBDatePicker } from "mdbreact";
import FileUpload from "./FileUpload";
import DatePickerInput from "./DatePickerInput";

class NewCompetition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			location: "",
			image: "",
			start_date: "",
			end_date: ""
		};
		this.getCompTitle = this.getCompTitle.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	getCompTitle = (event) => {
		this.setState({ title: event.target.value });
		console.log(event);
	};

	fileInputHandler = () => {
		console.log("File uploaded");
	};

	getStartDateValue = (value) => {
		console.log(value);
	};

	getEndDateValue = (value) => {
		console.log(value);
	};

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	render() {
		return (
			<MDBContainer>
				<MDBRow>
					<MDBCol md="3" />
					<MDBCol md="6">
						<form>
							<p className="h5 text-center mb-4 mt-5">Add New Competition</p>
							<div className="grey-text">
								<MDBInput
									label="Title"
									placeholder="Competition Title"
									group
									type="email"
									validate
									error="wrong"
									success="right"
									value={this.state.title}
									onChange={this.handleChange}
								/>
								<MDBInput
									label="Location"
									placeholder="Location"
									group
									type="text"
									validate
									error="wrong"
									success="right"
									value={this.state.location}
									onChange={this.handleChange}
								/>
								<FileUpload />
								<MDBInput label="Start Date" group type="text" validate error="wrong" success="right" value={this.state.start_date} onChange={this.handleChange} />
								<MDBInput label="End Date" group type="text" validate error="wrong" success="right" value={this.state.end_date} onChange={this.handleChange}  />
							</div>
							<div className="text-center">
								<MDBBtn color="primary">Create</MDBBtn>
							</div>
						</form>
					</MDBCol>
				</MDBRow>
			</MDBContainer>
		);
	}
}

export default NewCompetition;
