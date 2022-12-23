import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

class Types extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			types: [],
			dataEmpty: false,
		};
	}

	componentDidMount() {
		this.feachtypes();
	}

	async feachtypes() {
		axios.get(`${process.env.REACT_APP_API_URL}type`).then((res) => {
			const types = res.data;
			this.state.dataEmpty = true;
			this.setState({ types });
		});
	}

	render() {
		let table;
		if (this.state.types.length !== 0) {
			table = (
				<>
					<h1>Types</h1>

					<Table className='mt-5' hover>
						<thead>
							<tr>
								<th>Name</th>
								<th>Enabled</th>
							</tr>
						</thead>
						<tbody>
							{this.state.types.map((type) => {
								return (
									<tr key={type.id}>
										<td>{type.name_type}</td>
										<td>{type.enabled}</td>
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
					<h1 className='noElement'>No Types</h1>
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

export default Types;
