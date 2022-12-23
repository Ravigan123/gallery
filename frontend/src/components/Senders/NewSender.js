import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

function NewSender() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState("");
	const [phone, setPhone] = useState("");
	const [location, setLocation] = useState("");
	const [locations, setlocations] = useState([]);
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

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

	async function addToBase(sender) {
		let err;
		try {
			await axios.post(`${process.env.REACT_APP_API_URL}sender`, sender);
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
	const handleEmail = (event) => {
		setEmail(event.target.value);
	};
	const handleStatus = (event) => {
		setStatus(event.target.value);
	};
	const handlePhone = (event) => {
		setPhone(event.target.value);
	};

	const validateForm = (backandValid) => {
		const newErrors = {};

		if (backandValid === "No connection to the server")
			newErrors.server = backandValid;
		if (backandValid === "Status cannot be empty")
			newErrors.status = backandValid;
		return newErrors;
	};

	async function addSender(e) {
		e.preventDefault();
		let formErrors;
		let backandValid;

		if (status === "") {
			const err = "Status cannot be empty";
			formErrors = validateForm(err);
		} else {
			const sender = {
				email,
				location,
				status,
				phone,
			};
			backandValid = await addToBase(sender);
			formErrors = validateForm(backandValid);
		}

		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else navigate("/sender");
	}

	return (
		<Container className='mt-3'>
			<h1>Add Sender</h1>
			{errors.server !== undefined && (
				<Alert variant='danger'>{errors.server}</Alert>
			)}
			{errors.status !== undefined && (
				<Alert variant='danger'>{errors.status}</Alert>
			)}

			<Form onSubmit={addSender}>
				<Form.Group controlId='validationCustomEmail'>
					<FloatingLabel
						controlId='floatingEmail'
						label='Email'
						className='mb-3'>
						<Form.Control
							type='text'
							placeholder='Email'
							name='email'
							value={email}
							required
							onChange={handleEmail}
						/>
					</FloatingLabel>
				</Form.Group>

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

				<Form.Select
					size='lg'
					aria-label='Default select example'
					onChange={handleStatus}
					className='mb-3'
					defaultValue={"null"}>
					<option disabled value='null'>
						Status
					</option>
					<option value='active'>active</option>
					<option value='no active'>no active</option>
					<option value='suspended'>suspended</option>
				</Form.Select>

				<Form.Group>
					<FloatingLabel controlId='floating' label='Phone' className='mb-3'>
						<Form.Control
							type='text'
							placeholder='Phone'
							name='phone'
							value={phone}
							onChange={handlePhone}
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

export default NewSender;
