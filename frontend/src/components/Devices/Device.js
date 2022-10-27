import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-modal";
import EditDevice from "../Devices/EditDevice";

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

class Device extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			devices: [],
			showEditModal: false,
			editDevice: {},
		};
	}

	componentDidMount() {
		this.feachDevices();
		Modal.setAppElement("body");
	}

	componentWillUnmount() {
		this.feachDevices();
	}

	async feachDevices() {
		axios.get(`${process.env.REACT_APP_API_URL}device`).then((res) => {
			const devices = res.data;
			this.setState({ devices });
		});
	}

	async deleteDevice(id) {
		const devices = [...this.state.devices].filter(
			(device) => device.id !== id
		);
		axios.delete(`${process.env.REACT_APP_API_URL}device/` + id).then((res) => {
			this.setState({ devices });
		});
	}

	toogleModal() {
		this.setState({ showEditModal: !this.state.showEditModal });
	}

	async editDevice(device) {
		const id = device.id;
		await axios.put(`${process.env.REACT_APP_API_URL}device/` + id, device);

		const devices = [...this.state.devices];
		if (id >= 0) {
			devices[id] = device;
			this.setState({ devices });
			this.toggleModal();
		}
	}

	editDeviceHandler(device) {
		this.toogleModal();
		this.setState({ editDevice: device });
	}

	render() {
		return (
			<Container className='mt-3'>
				<h1>Devices</h1>
				<a className='float-end' href='/device/create'>
					<Button variant='primary'>Add</Button>
				</a>
				<Modal isOpen={this.state.showEditModal} contentLabel='Edit device'>
					<EditDevice
						name={this.state.editDevice.name_device}
						enabled={this.state.editDevice.enabled}
						location={this.state.editDevice.id_location}
						type={this.state.editDevice.id_type}
						interval={this.state.editDevice.interval_device}
						id={this.state.editDevice.id}
						details={this.state.editDevice.details}
						params={this.state.editDevice.params}
						onCancel={() => this.toogleModal()}
						onEdit={(device) => this.editDevice(device)}
					/>
				</Modal>
				<Table striped hover>
					<thead>
						<tr>
							<th>Name</th>
							<th>Type</th>
							<th>Location</th>
							<th>Enabled</th>
							<th>Params</th>
							<th>Details</th>
							<th>Interval</th>
							<th>Created</th>
						</tr>
					</thead>
					<tbody>
						{this.state.devices.map((device) => {
							const d = new Date(device.created_at);
							const created = formatDate(d);
							return (
								<tr key={device.id}>
									<td>{device.name_device}</td>
									<td>{device.name_type}</td>
									<td>{device.name_location}</td>
									<td>{device.enabled}</td>
									<td>{device.params}</td>
									<td>{device.details}</td>
									<td>{device.interval_device}</td>
									<td>{created}</td>
									<td>
										<Button
											variant='success'
											onClick={(key) => {
												this.editDeviceHandler(device);
											}}>
											Edit
										</Button>
										<Button
											className='Formmargin'
											variant='danger'
											onClick={(key) => this.deleteDevice(device.id)}>
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

export default Device;
