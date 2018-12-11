import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput } from "mdbreact";

class AddHeat extends Component {
	render() {
		return (
			<MDBContainer>
				<MDBRow>
					<MDBCol md="3" />
					<MDBCol md="6">
						<form>
							<p className="h5 text-center mb-4 mt-5">Add New Heat</p>
							<div className="grey-text">
								<MDBInput
									label="Heat Number"
									placeholder="Heat Number"
									group
									type="text"
									validate
									error="wrong"
									success="right"
								/>
								<MDBRow>
									<MDBCol md="6">
										<MDBInput label="Date" group type="text" validate error="wrong" success="right" />
									</MDBCol>
									<MDBCol md="6">
										<MDBInput label="Time" group type="text" validate error="wrong" success="right" />
									</MDBCol>
								</MDBRow>
							</div>
							<div className="text-center">
								<MDBBtn color="primary">Add</MDBBtn>
							</div>
						</form>
					</MDBCol>
				</MDBRow>
			</MDBContainer>
		);
	}
}

export default AddHeat;
