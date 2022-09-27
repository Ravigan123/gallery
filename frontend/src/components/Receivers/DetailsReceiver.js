import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Alert from "react-bootstrap/Alert";

function DetailsReceiver(props) {
	const [details, setDetails] = useState([]);
	const [location, setLocation] = useState("");
	const [locations, setLocations] = useState([]);
	const [nameAlert, setNameAlert] = useState("");
	const [alertType, setAlertType] = useState([]);
	const [interval, setInterval] = useState("");
	const [errors, setErrors] = useState({});
	useEffect(() => {
		feachDetails();
		feachLocations();
		feachAlertType();
	}, []);

	async function feachDetails() {
		const id = props.receiver.id;
		axios.get(`http://localhost:4000/receiverDetails/` + id).then((res) => {
			const details = res.data;
			setDetails(details);
		});
	}

	async function feachLocations() {
		axios.get(`http://localhost:4000/locationSelect`).then((res) => {
			const locations = res.data;
			setLocations(locations);
		});
	}
	async function feachAlertType() {
		axios.get(`http://localhost:4000/alertType`).then((res) => {
			const alertType = res.data;
			setAlertType(alertType);
		});
	}

	const handleAlertType = (event) => {
		setNameAlert(event.target.value);
	};
	const handleLocation = (event) => {
		setLocation(event.target.value);
	};
	const handleInterval = (event) => {
		setInterval(event.target.value);
	};

	async function deleteReceiverDetails(id) {
		const det = [...details].filter((detail) => detail.id !== id);
		axios.delete(`http://localhost:4000/receiverDetails/` + id).then((res) => {
			setDetails(det);
		});
	}

	const validateForm = (backandValid) => {
		const newErrors = {};

		if (backandValid !== undefined) newErrors.name = backandValid;
		if (backandValid === "both values cannot be null (Location, Type alert)")
			newErrors.bothNull = backandValid;

		return newErrors;
	};

	async function addToBase(receiver) {
		let err;
		try {
			await axios.post("http://localhost:4000/receiverDetails", receiver);
		} catch (error) {
			if (error.response.data === undefined)
				err = "No connection to the server";
			else err = error.response.data.message;
		}
		return err;
	}

	async function addReceiverDetails(e) {
		e.preventDefault();
		const receiver = {
			receiver: props.receiver.id,
			location,
			nameAlert,
			interval,
		};
		const backandValid = await addToBase(receiver);
		const formErrors = validateForm(backandValid);
		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else window.location.reload(false);
	}

	return (
		<Container className='mt-3'>
			<h1>Details Receiver</h1>

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
					<tr>
						<td>{props.receiver.name_receiver}</td>
						<td>{props.receiver.type_receiver}</td>
						<td>{props.receiver.address}</td>
						<td>{props.receiver.addition}</td>
					</tr>
				</tbody>
			</Table>

			<h3>Locations and types alert</h3>

			<Table striped hover>
				<thead>
					<tr>
						<th>location</th>
						<th>Type alert</th>
						<th>Interval</th>
					</tr>
				</thead>
				<tbody>
					{details.map((detail, index) => {
						return (
							<tr key={detail.id}>
								<td>{detail.name_location}</td>
								<td>{detail.name_alert}</td>
								<td>{detail.interval_receiver}</td>
								<td>
									<Button
										className='mr-7'
										variant='danger'
										onClick={(key) => deleteReceiverDetails(detail.id)}>
										Delete
									</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
			{errors.bothNull !== undefined && (
				<Alert variant='danger'>{errors.bothNull}</Alert>
			)}

			<Form onSubmit={addReceiverDetails}>
				<Form.Select
					size='lg'
					aria-label='Default select example'
					onChange={handleLocation}
					className='mb-3'
					value={"null"}>
					<option value='null' disabled>
						Location
					</option>
					<option>null</option>
					{locations.map((location) => {
						return (
							<option key={location.id} value={location.id}>
								{location.name_location}
							</option>
						);
					})}
				</Form.Select>

				<Form.Select
					size='lg'
					aria-label='Default select example'
					onChange={handleAlertType}
					className='mb-3'
					value='null'>
					<option value='null' disabled>
						Type alert
					</option>
					<option>null</option>
					{alertType.map((type) => {
						return (
							<option key={type.id} value={type.id}>
								{type.name_alert}
							</option>
						);
					})}
				</Form.Select>

				<Form.Group>
					<FloatingLabel
						controlId='floatingInterval'
						label='Interval'
						className='mb-3'>
						<Form.Control
							type='number'
							placeholder='Interval'
							name='interval'
							value={interval}
							isInvalid={!!errors.interval}
							onChange={handleInterval}
						/>
					</FloatingLabel>
				</Form.Group>

				<Button
					className='float-end Formmargin'
					variant='primary'
					type='submit'>
					Add
				</Button>
				<Button
					className='float-end'
					variant='danger'
					onClick={() => {
						props.onCancel();
					}}>
					Cancel
				</Button>
			</Form>
		</Container>
	);
}

export default DetailsReceiver;
