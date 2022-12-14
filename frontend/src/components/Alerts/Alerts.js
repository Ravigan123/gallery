import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import * as AiIcons from "react-icons/ai";
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

class Alerts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			alerts: [],
			dataEmpty: false,
		};
	}

	componentDidMount() {
		this.feachAlerts();
	}

	componentWillUnmount() {
		this.feachAlerts();
	}

	async feachAlerts() {
		axios.get(`${process.env.REACT_APP_API_URL}alert`).then((res) => {
			const alerts = res.data;
			this.state.dataEmpty = true;
			this.setState({ alerts });
		});
	}

	toogleModal() {
		this.setState({ showEditModal: !this.state.showEditModal });
	}

	async doneHandler(alert) {
		const id = alert.id;
		await axios.put(`${process.env.REACT_APP_API_URL}alert/` + id, alert);
		window.location.reload(false);
	}

	render() {
		let table;
		if (this.state.alerts.length !== 0) {
			table = (
				<>
					<h1>Alerts</h1>
					<Table striped hover>
						<thead>
							<tr>
								<th>Receiver</th>
								<th>Type</th>
								<th>Message</th>
								<th>Location</th>
								<th>Device</th>
								<th>Count</th>
								<th>Created</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{this.state.alerts.map((alert) => {
								const d = new Date(alert.created_at);
								const created = formatDate(d);
								return (
									<tr key={alert.id}>
										<td>{alert.name_receiver}</td>
										<td>{alert.name_alert}</td>
										<td>{alert.message}</td>
										<td>{alert.name_location}</td>
										<td>{alert.name_device}</td>
										<td>{alert.count}</td>
										<td>{created}</td>
										<td>{alert.status_alert}</td>
										<td>
											<AiIcons.AiOutlineCheck
												title='done'
												className='icon-table'
												onClick={(key) => this.doneHandler(alert)}
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
					<h1 className='noElement'>No Alerts</h1>
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

export default Alerts;
