import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

function PastData() {
	const [location, setLocation] = useState("");
	const [dateStart, setDateStart] = useState("");
	const [dateEnd, setDateEnd] = useState("");
	const [hourInterval, setHourInterval] = useState("");
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
	const [locations, setlocations] = useState([]);

	useEffect(() => {
		feachLocations();
	}, []);

	async function feachLocations() {
		axios
			.get(`${process.env.REACT_APP_API_URL}getLocationSelect`)
			.then((res) => {
				const locations = res.data;
				setlocations(locations);
			});
	}

	async function addToBase(data) {
		let err;
		try {
			await axios.post(`${process.env.REACT_APP_API_URL}data/past`, data);
		} catch (error) {
			if (error.response.data === undefined)
				err = "No connection to the server";
			else err = error.response.data.message;
		}
		return err;
	}

	const handleLocation = (event) => {
		setLocation(event.target.value);
	};
	const handleDateStart = (event) => {
		setDateStart(event.target.value);
	};
	const handleDateEnd = (event) => {
		setDateEnd(event.target.value);
	};
	const handleHourInterval = (event) => {
		setHourInterval(event.target.value);
	};

	const validateForm = (backandValid) => {
		const newErrors = {};
		if (backandValid === "No connection to the server")
			newErrors.server = backandValid;
		if (backandValid === "Location cannot be empty")
			newErrors.location = backandValid;
		if (backandValid === "Start date is bigger than end date")
			newErrors.dateStart = backandValid;

		return newErrors;
	};

	async function getPastData(e) {
		e.preventDefault();
		let formErrors;
		let backandValid;
		if (location === "") {
			const err = "Location cannot be empty";
			formErrors = validateForm(err);
		} else if (dateStart > dateEnd) {
			const err = "Start date is bigger than end date";
			formErrors = validateForm(err);
		} else {
			const data = {
				location,
				dateStart,
				dateEnd,
				hourInterval,
			};

			backandValid = await addToBase(data);
			formErrors = validateForm(backandValid);
		}

		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else navigate("/");
	}

	return (
		<Container className='mt-3'>
			<h1>Get Past Data</h1>
			{errors.server !== undefined && (
				<Alert variant='danger'>{errors.server}</Alert>
			)}
			{errors.location !== undefined && (
				<Alert variant='danger'>{errors.location}</Alert>
			)}

			<Form onSubmit={getPastData}>
				<Form.Select
					size='lg'
					aria-label='Default select example'
					onChange={handleLocation}
					className='mb-3'
					defaultValue='null'>
					<option value='null' disabled>
						Location
					</option>
					{locations.map((loc) => {
						return (
							<option key={loc.id} value={loc.id}>
								{loc.name_location}
							</option>
						);
					})}
				</Form.Select>

				<Form.Group>
					<FloatingLabel
						controlId='floatingDateStart'
						label='Start date'
						className='mb-3'>
						<Form.Control
							type='date'
							placeholder='Start date'
							name='DateStart'
							value={dateStart}
							required
							isInvalid={!!errors.dateStart}
							onChange={handleDateStart}
						/>
					</FloatingLabel>
					<Form.Control.Feedback type='invalid'>
						{errors.dateStart}
					</Form.Control.Feedback>
				</Form.Group>

				<Form.Group>
					<FloatingLabel
						controlId='floatingDateEnd'
						label='End date'
						className='mb-3'>
						<Form.Control
							type='date'
							placeholder='Start end'
							name='DateEnd'
							value={dateEnd}
							required
							isInvalid={!!errors.dateStart}
							onChange={handleDateEnd}
						/>
					</FloatingLabel>
					<Form.Control.Feedback type='invalid'>
						{errors.dateStart}
					</Form.Control.Feedback>
				</Form.Group>

				<Form.Group>
					<FloatingLabel
						controlId='floatingHourInterval'
						label='Hour interval (ex. 2-10)'
						className='mb-3'>
						<Form.Control
							type='text'
							placeholder='hour interval'
							name='HourInterval'
							value={hourInterval}
							required
							isInvalid={!!errors.HourInterval}
							onChange={handleHourInterval}
						/>
					</FloatingLabel>
				</Form.Group>

				<Button className='float-end' variant='primary' type='submit'>
					Add
				</Button>
			</Form>
		</Container>
	);
}

export default PastData;
