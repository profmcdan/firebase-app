import React, { Component } from "react";
import Comptition from "./Comptition";

const persons = [
	{ id: 1, name: "Ola Ojo", age: 23 },
	{ id: 2, name: "Ayowale", age: 22 },
	{ id: 3, name: "Aina Ola", age: 45 }
];
class CompetitionList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			persons
		};
		this.removeItem = this.removeItem.bind(this);
	}
	removeItem = (id) => {
		const newPersons = this.state.persons;
		newPersons.pop(id);
		console.log(newPersons);
		this.setState({ persons: newPersons });
	};
	render() {
		return (
			<div>
				{persons.map((person) => {
					return (
						<div key={person.id}>
							<h2>{person.name}</h2>
							<p className="lead">{person.age}</p>
							<button type="button" onClick={() => this.removeItem(person.id)}>
								Remove
							</button>
						</div>
					);
				})}
				<Comptition />
				<Comptition />
				<Comptition />
				<Comptition />
			</div>
		);
	}
}

export default CompetitionList;
