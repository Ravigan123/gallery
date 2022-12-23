import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-modal";
import EditLocation from "./EditLocation";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import Spinner from "react-bootstrap/Spinner";

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
			dataEmpty: false,
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
			this.state.dataEmpty = true;
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
		let table;
		if (this.state.locations.length !== 0) {
			table = (
				<>
					<h1>Locations</h1>
					<a className='float-end' href='/location/create'>
						<Button variant='primary'>Add</Button>
					</a>
					<Modal isOpen={this.state.showEditModal} contentLabel='Edit location'>
						<EditLocation
							name={this.state.editLocation.name_location}
							codeSend={this.state.editLocation.code_to_send}
							codeReceive={this.state.editLocation.code_to_receive}
							enabled={this.state.editLocation.enabled}
							delete={this.state.editLocation.delete}
							url={this.state.editLocation.url}
							interval={this.state.editLocation.interval_location}
							id={this.state.editLocation.id}
							onCancel={() => this.toogleModal()}
							onEdit={(location) => this.editLocation(location)}
						/>
					</Modal>
					<Table className='mt-5' hover>
						<thead>
							<tr>
								<th>Name</th>
								<th>Code to send</th>
								<th>Code to receive</th>
								<th>Enabled</th>
								<th>Delete</th>
								<th>URL</th>
								<th>Interval</th>
								<th>Created</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{this.state.locations.map((location) => {
								const d = new Date(location.created_at);
								const created = formatDate(d);
								return (
									<tr key={location.id}>
										<td>{location.name_location}</td>
										<td>{location.code_to_send}</td>
										<td>{location.code_to_receive}</td>
										<td>{location.enabled}</td>
										<td>{location.delete}</td>
										<td>{location.url}</td>
										<td>{location.interval_location}</td>
										<td>{created}</td>
										<td>
											<AiIcons.AiFillEdit
												title='edit'
												className='icon-table'
												onClick={(key) => {
													this.editLocationHandler(location);
												}}
											/>

											<AiIcons.AiFillDelete
												title='delete'
												className='icon-table'
												onClick={(key) => this.deleteLocation(location.id)}
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</>
			);
		} else {
			table = (
				<>
					<h1 className='noElement'>No locations</h1>
					<a className='float-end' href='/location/create'>
						<Button className='bnt-action'>Add</Button>
					</a>
				</>
			);
		}
		return (
			<div>
				{this.state.dataEmpty ? (
					<Container className='mt-4'>{table}</Container>
				) : (
					<div className='spinner'>
						<Spinner animation='border' role='status'>
							<span className='visually-hidden'>Loading...</span>
						</Spinner>
					</div>
				)}
			</div>
		);
	}
}

export default Locations;
