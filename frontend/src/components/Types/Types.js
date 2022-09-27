import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";

class Types extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			types: [],
		};
	}

	componentDidMount() {
		this.feachtypes();
	}

	async feachtypes() {
		axios.get(`http://localhost:4000/type`).then((res) => {
			const types = res.data;
			this.setState({ types });
		});
	}

	render() {
		return (
			<Container className='mt-3'>
				<h1>Types</h1>

				<Table striped hover>
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
			</Container>
		);
	}
}

export default Types;
