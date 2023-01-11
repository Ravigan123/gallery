import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			locations: [],
			devices: [],
			datas: [],
			dataEmpty: false,
		};
	}

	componentDidMount() {
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
		axios.get(`${process.env.REACT_APP_API_URL}device`).then((res) => {
			const devices = res.data;
			this.state.dataEmpty = true;
			this.setState({ devices });
		});
	}
	async feachLocations() {
		axios.get(`${process.env.REACT_APP_API_URL}location`).then((res) => {
			const locations = res.data;
			this.setState({ locations });
		});
	}

	async feachData() {
		axios.get(`${process.env.REACT_APP_API_URL}data`).then((res) => {
			const datas = res.data;
			this.setState({ datas });
		});
	}
	render() {
		let table;
		if (this.state.datas.length !== 0) {
			table = (
				<>
					<h1>Dashboard</h1>
					<a className='float-end' href='/data/past'>
						<Button className='bnt-action'>get past data</Button>
					</a>
					{/* {this.state.locations.map((location) => {
						return (
							<Card key={location.id} className='mt-3'>
								<Card.Header>Location: {location.name_location}</Card.Header>
								<Card.Body>
									{this.state.devices.map((device) => {
										return (
											<div key={device.id}>
												{device.id_location === location.id && (
													<>
														<Card.Title>
															Device: {device.name_device}
														</Card.Title>
														{this.state.datas.map((data, index) => {
															const info = `In: ${data.in} Out: ${data.out} Hour: ${data.hour}  ${data.date}`;
															return (
																<div key={index}>
																	{data.id_device === device.id && (
																		<Card.Text className='mb-3'>
																			{info}
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
					})} */}
				</>
			);
		} else {
			table = (
				<>
					<h1 className='noElement'>No Data</h1>
					<a className='float-end' href='/data/past'>
						<Button className='bnt-action'>get past data</Button>
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

export default Home;
