import React from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarNav,
	NavItem,
	NavLink,
	NavbarToggler,
	Collapse,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Fa
} from "mdbreact";

class NavbarPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isOpen: false
		};
	}

	toggleCollapse = () =>{ this.setState({ isOpen: !this.state.isOpen }); }

	render() {
		return (
			<Navbar className="mb-3" color="blue" dark expand="md" style={{ marginTop: "0px" }}>
				<NavbarBrand>
					<strong className="white-text">ZipDance</strong>
				</NavbarBrand>
				<NavbarToggler onClick={this.toggleCollapse} />
				<Collapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
					<NavbarNav left>
						<NavItem active>
							<NavLink to="/">Home</NavLink>
						</NavItem>
						<NavItem>
							<NavLink to="/competition">Competition</NavLink>
						</NavItem>
						<NavItem>
							<Dropdown>
								<DropdownToggle nav caret>
									<div className="d-none d-md-inline">Admin</div>
								</DropdownToggle>
								<DropdownMenu className="dropdown-default" right>
									<DropdownItem href="/new">New Competition</DropdownItem>
									<DropdownItem href="#!">Manage Heat</DropdownItem>
									<DropdownItem href="#!">Scores</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</NavItem>
					</NavbarNav>
					<NavbarNav right>
						<NavItem>
							<NavLink className="waves-effect waves-light" to="#!">
								<Fa icon="twitter" />
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink className="waves-effect waves-light" to="#!">
								<Fa icon="google-plus" />
							</NavLink>
						</NavItem>
						<NavItem>
							<Dropdown>
								<DropdownToggle nav caret>
									<Fa icon="user" />
								</DropdownToggle>
								<DropdownMenu className="dropdown-default" right>
									<DropdownItem href="#!">Settings</DropdownItem>
									<DropdownItem href="#!">Profile</DropdownItem>
									<DropdownItem href="#!">Logout</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</NavItem>
					</NavbarNav>
				</Collapse>
			</Navbar>
		);
	}
}

export default NavbarPage;
