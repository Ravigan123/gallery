import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-modal";
import EditLocation from "./EditLocation";

function padTo2Digits(num) {
	return num.toString().padStart(2, "0");
}

function formatDate(date) {
	return (
		[
			date.getFullYear(),
			padTo2Digits(date.getMonth() + 1),
			padTo2Digits(date.getDate()),
		].join("-") +
		" " +
		[
			padTo2Digits(date.getHours()),
			padTo2Digits(date.getMinutes()),
			padTo2Digits(date.getSeconds()),
		].join(":")
	);
}

class Locations extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			locations: [],
			showEditModal: false,
			editLocation: {},
		};
	}

	componentDidMount() {
		this.feachLocations();
		Modal.setAppElement("body");
	}

	componentWillUnmount() {
		this.feachLocations();
	}

	async feachLocations() {
		axios.get(`${process.env.REACT_APP_API_URL}location`).then((res) => {
			const locations = res.data;
			this.setState({ locations });
		});
	}

	async deleteLocation(id) {
		const locations = [...this.state.locations].filter(
			(location) => location.id !== id
		);
		axios
			.delete(`${process.env.REACT_APP_API_URL}location/` + id)
			.then((res) => {
				this.setState({ locations });
			});
	}

	toogleModal() {
		this.setState({ showEditModal: !this.state.showEditModal });
	}

	async editLocation(location) {
		console.log("object");
		const id = location.id;
		await axios.put(`${process.env.REACT_APP_API_URL}location/` + id, location);

		const locations = [...this.state.locations];
		if (id >= 0) {
			locations[id] = location;
			this.setState({ locations });
			this.toggleModal();
		}
	}

	editLocationHandler(location) {
		this.toogleModal();
		this.setState({ editLocation: location });
	}

	render() {
		return (
			<Container className='mt-3'>
				<h1>Locations</h1>
				<a className='float-end' href='/location/create'>
					<Button variant='primary'>Add</Button>
				</a>
				<Modal isOpen={this.state.showEditModal} contentLabel='Edit location'>
					<EditLocation
						name={this.state.editLocation.name_location}
						enabled={this.state.editLocation.enabled}
						delete={this.state.editLocation.delete}
						url={this.state.editLocation.url}
						interval={this.state.editLocation.interval_location}
						id={this.state.editLocation.id}
						onCancel={() => this.toogleModal()}
						onEdit={(location) => this.editLocation(location)}
					/>
				</Modal>
				<Table striped hover>
					<thead>
						<tr>
							<th>Name</th>
							<th>Enabled</th>
							<th>Delete</th>
							<th>URL</th>
							<th>Interval</th>
							<th>Created</th>
						</tr>
					</thead>
					<tbody>
						{this.state.locations.map((location) => {
							const d = new Date(location.created_at);
							const created = formatDate(d);
							return (
								<tr key={location.id}>
									<td>{location.name_location}</td>
									<td>{location.enabled}</td>
									<td>{location.delete}</td>
									<td>{location.url}</td>
									<td>{location.interval_location}</td>
									<td>{created}</td>
									<td>
										<Button
											className='mr-7'
											variant='success'
											onClick={(key) => {
												this.editLocationHandler(location);
											}}>
											Edit
										</Button>
										<Button
											className='mr-7 Formmargin'
											variant='danger'
											onClick={(key) => this.deleteLocation(location.id)}>
											Delete
										</Button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</Container>
		);
	}
}

export default Locations;
