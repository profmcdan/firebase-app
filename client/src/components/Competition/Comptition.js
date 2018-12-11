import React, { Component } from "react";
import { Card, CardTitle, Col, MDBCol, MDBRow, Button, CardBody, CardImage, CardText } from "mdbreact";

class Comptition extends Component {
	render() {
		const competition = {
			title: "Test Title",
			location: "Vancouva",
			start_date: "02-10-2018",
			stop_date: "20-02-2018",
			image: "https://mdbootstrap.com/img/Photos/Others/images/43.jpg"
		};
		return (
			<MDBRow className="mb-1 mr-1" style={{ width: "34rem", height: "18rem" }}>
				<MDBCol md="4">
					<Card style={{ width: "22rem", height: "14rem" }}>
						<CardImage className="img-fluid" src={competition.image} waves />
					</Card>
				</MDBCol>
				<MDBCol md="5">
					<Card style={{ width: "22rem", height: "14rem" }}>
						<CardBody>
							<CardTitle>
								<em>{competition.title}</em>
							</CardTitle>
							<CardText>{competition.location}</CardText>
							<CardText className="lead">
								{competition.start_date} -- {competition.stop_date}
							</CardText>
							<Button href="#">More</Button>
						</CardBody>
					</Card>
				</MDBCol>
			</MDBRow>
		);
	}
}

export default Comptition;
