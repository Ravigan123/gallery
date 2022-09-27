import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-modal";
import DetailsReceiver from "./DetailsReceiver";
import EditReceiver from "./EditReceiver";

class Receivers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			receivers: [],
			showEditModal: false,
			showDetailsModal: false,
			editReceiver: {},
			detailsReceiver: "",
		};
	}

	componentDidMount() {
		this.feachReceivers();
		Modal.setAppElement("body");
	}

	componentWillUnmount() {
		this.feachReceivers();
	}

	async feachReceivers() {
		axios.get(`http://localhost:4000/receiver`).then((res) => {
			const receivers = res.data;
			this.setState({ receivers });
		});
	}

	async deleteReceiver(id) {
		const receivers = [...this.state.receivers].filter(
			(receiver) => receiver.id !== id
		);
		axios.delete(`http://localhost:4000/receiver/` + id).then((res) => {
			this.setState({ receivers });
		});
	}

	toogleEditModal() {
		this.setState({ showEditModal: !this.state.showEditModal });
	}

	toogleDetailsModal() {
		this.setState({ showDetailsModal: !this.state.showDetailsModal });
	}

	async editReceiver(receiver) {
		const id = receiver.id;
		await axios.put(`http://localhost:4000/receiver/` + id, receiver);

		const receivers = [...this.state.receivers];
		if (id >= 0) {
			receivers[id] = receiver;
			this.setState({ receivers });
			this.toogleEditModal();
		}
	}

	editReceiverHandler(receiver) {
		this.setState({ editReceiver: receiver });
		this.toogleEditModal();
	}
	DetailsReceiversHandler(receiver) {
		this.toogleDetailsModal();
		this.setState({ detailsReceiver: receiver });
	}

	render() {
		return (
			<Container className='mt-3'>
				<h1>Receivers</h1>
				<a className='float-end' href='/receiver/create'>
					<Button variant='primary'>Add</Button>
				</a>
				<Modal isOpen={this.state.showEditModal} contentLabel='Edit receiver'>
					<EditReceiver
						name={this.state.editReceiver.name_receiver}
						type={this.state.editReceiver.type_receiver}
						address={this.state.editReceiver.address}
						addition={this.state.editReceiver.addition}
						id={this.state.editReceiver.id}
						onCancel={() => this.toogleEditModal()}
						onEdit={(receiver) => this.editReceiver(receiver)}
					/>
				</Modal>
				<Modal
					isOpen={this.state.showDetailsModal}
					contentLabel='Details receiver'>
					<DetailsReceiver
						receiver={this.state.detailsReceiver}
						onCancel={() => this.toogleDetailsModal()}
						onAdd={(details) => this.showDetails(details)}
					/>
				</Modal>
				<Table striped hover>
					<thead>
						<tr>
							<th>Name</th>
							<th>Type</th>
							<th>Address</th>
							<th>Addition</th>
						</tr>
					</thead>
					<tbody>
						{this.state.receivers.map((receiver, index) => {
							return (
								<tr key={receiver.id}>
									<td>{receiver.name_receiver}</td>
									<td>{receiver.type_receiver}</td>
									<td>{receiver.address}</td>
									<td>{receiver.addition}</td>
									<td>
										<Button
											className='mr-7'
											variant='primary'
											onClick={(key) => {
												this.DetailsReceiversHandler(receiver);
											}}>
											Details
										</Button>
										<Button
											className='mr-7 Formmargin'
											variant='success'
											onClick={(key) => {
												this.editReceiverHandler(receiver);
											}}>
											Edit
										</Button>
										<Button
											className='mr-7 Formmargin'
											variant='danger'
											onClick={(key) => this.deleteReceiver(receiver.id)}>
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

export default Receivers;
