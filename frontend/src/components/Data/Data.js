import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import axios from "axios";

class Data extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			locations: [],
			devices: [],
			datas: [],
		};
	}

	componentDidMount(data) {
		this.feachDevices();
		this.feachLocations();
		this.feachData();
	}

	componentWillUnmount() {
		this.feachDevices();
		this.feachLocations();
		this.feachData();
	}

	async feachDevices() {
		axios.get(`http://localhost:4000/device`).then((res) => {
			const devices = res.data;
			this.setState({ devices });
		});
	}
	async feachLocations() {
		axios.get(`http://localhost:4000/location`).then((res) => {
			const locations = res.data;
			this.setState({ locations });
		});
	}

	async feachData() {
		axios.get(`http://localhost:4000/`).then((res) => {
			const datas = res.data;
			this.setState({ datas });
		});
	}

	render() {
		return (
			<Container className='mt-3'>
				<h1>Data</h1>
				{this.state.locations.map((location) => {
					return (
						<Card key={location.id} className='mt-3'>
							<Card.Header>Location: {location.name_location}</Card.Header>
							<Card.Body>
								{this.state.devices.map((device) => {
									return (
										<div key={device.id}>
											{device.id_location === location.id && (
												<>
													<Card.Title>Device: {device.name_device}</Card.Title>
													{this.state.datas.map((data, index) => {
														return (
															<div key={index}>
																{data.id_device === device.id && (
																	<Card.Text className='mb-3'>
																		Count: {data.devices}
																	</Card.Text>
																)}
															</div>
														);
													})}
												</>
											)}
										</div>
									);
								})}
							</Card.Body>
						</Card>
					);
				})}
			</Container>
		);
	}
}

export default Data;
