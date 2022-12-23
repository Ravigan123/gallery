import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-modal";
import DetailsReceiver from "./DetailsReceiver";
import EditReceiver from "./EditReceiver";
import * as AiIcons from "react-icons/ai";
import Spinner from "react-bootstrap/Spinner";

class Receivers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			receivers: [],
			showEditModal: false,
			showDetailsModal: false,
			dataEmpty: false,
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
		axios.get(`${process.env.REACT_APP_API_URL}receiver`).then((res) => {
			const receivers = res.data;
			this.state.dataEmpty = true;
			this.setState({ receivers });
		});
	}

	async deleteReceiver(id) {
		const receivers = [...this.state.receivers].filter(
			(receiver) => receiver.id !== id
		);
		axios
			.delete(`${process.env.REACT_APP_API_URL}receiver/` + id)
			.then((res) => {
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
		await axios.put(`${process.env.REACT_APP_API_URL}receiver/` + id, receiver);

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
		let table;
		if (this.state.receivers.length !== 0) {
			table = (
				<>
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
					<Table className='mt-5' hover>
						<thead>
							<tr>
								<th>Name</th>
								<th>Type</th>
								<th>Address</th>
								<th>Addition</th>
								<th>Action</th>
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
											<AiIcons.AiOutlineMore
												title='details'
												className='icon-table'
												onClick={(key) => {
													this.DetailsReceiversHandler(receiver);
												}}
											/>
											<AiIcons.AiFillEdit
												title='edit'
												className='icon-table'
												onClick={(key) => {
													this.editReceiverHandler(receiver);
												}}
											/>

											<AiIcons.AiFillDelete
												title='delete'
												className='icon-table'
												onClick={(key) => this.deleteReceiver(receiver.id)}
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
					<h1 className='noElement'>No receivers</h1>
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

export default Receivers;
