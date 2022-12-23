import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-modal";
import EditDevice from "../Devices/EditDevice";
import * as AiIcons from "react-icons/ai";
import Spinner from "react-bootstrap/Spinner";

class Senders extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			senders: [],
			dataEmpty: false,
			showEditModal: false,
			editSender: {},
		};
	}

	componentDidMount() {
		this.feachSenders();
		Modal.setAppElement("body");
	}

	componentWillUnmount() {
		this.feachSenders();
	}

	async feachSenders() {
		axios.get(`${process.env.REACT_APP_API_URL}sender`).then((res) => {
			const senders = res.data;
			this.state.dataEmpty = true;
			this.setState({ senders });
		});
	}

	async deleteSender(id) {
		const senders = [...this.state.senders].filter(
			(sender) => sender.id !== id
		);
		axios.delete(`${process.env.REACT_APP_API_URL}sender/` + id).then((res) => {
			this.setState({ senders });
		});
	}

	toogleModal() {
		this.setState({ showEditModal: !this.state.showEditModal });
	}

	async editSender(sender) {
		const id = sender.id;
		await axios.put(`${process.env.REACT_APP_API_URL}sender/` + id, sender);

		const senders = [...this.state.senders];
		if (id >= 0) {
			senders[id] = sender;
			this.setState({ senders });
			this.toggleModal();
		}
	}

	editSenderHandler(sender) {
		this.toogleModal();
		this.setState({ editSender: sender });
	}

	render() {
		let table;
		if (this.state.senders.length !== 0) {
			table = (
				<>
					<h1>Senders</h1>
					<a className='float-end' href='/sender/create'>
						<Button variant='primary'>Add</Button>
					</a>
					<Modal isOpen={this.state.showEditModal} contentLabel='Edit device'>
						<EditDevice
							email={this.state.editSender.email}
							status={this.state.editSender.status}
							phone={this.state.editSender.phone}
							location={this.state.editSender.id_location}
							id={this.state.editSender.id}
							onCancel={() => this.toogleModal()}
							onEdit={(sender) => this.editSender(sender)}
						/>
					</Modal>
					<Table className='mt-5' hover>
						<thead>
							<tr>
								<th>Email</th>
								<th>Status</th>
								<th>Phone</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{this.state.senders.map((sender) => {
								return (
									<tr key={sender.id}>
										<td>{sender.email}</td>
										<td>{sender.status}</td>
										<td>{sender.phone}</td>
										<td>
											<AiIcons.AiFillEdit
												title='edit'
												className='icon-table'
												onClick={(key) => {
													this.editSenderHandler(sender);
												}}
											/>

											<AiIcons.AiFillDelete
												title='delete'
												className='icon-table'
												onClick={(key) => this.deleteSender(sender.id)}
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
					<h1 className='noElement'>No senders</h1>
					<a className='float-end' href='/sender/create'>
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

export default Senders;
