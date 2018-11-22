import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { Container, Row, Col } from "mdbreact";

import "font-awesome/css/font-awesome.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./App.css";

import NavbarPage from "./components/Home/NavbarPage";
import FooterPage from "./components/Home/FooterPage";
import Landing from "./components/Home/Landing";
import NewCompetition from "./components/Forms/NewCompetition";
import AddHeat from "./components/Forms/AddHeat";

class App extends Component {
	render() {
		return (
			<Router>
				<div className="container-fluid">
					<NavbarPage />
					<Route exact path="/" component={Landing} />
					<Container>
						<Route exact path="/new" component={NewCompetition} />
						<Route exact path="/add-heat" component={AddHeat} />
					</Container>
					<Container />
					<FooterPage />
				</div>
			</Router>
		);
	}
}

export default App;
