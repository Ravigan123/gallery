import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

function NewReceiver() {
	const [nameReceiver, setNameReceiver] = useState("");
	const [type, setType] = useState("");
	const [address, setAddress] = useState("");
	const [addition, setAddition] = useState("");
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	async function addToBase(receiver) {
		let err;
		try {
			await axios.post("http://localhost:4000/receiver", receiver);
		} catch (error) {
			if (error.response.data === undefined)
				err = "No connection to the server";
			else err = error.response.data.message;
		}
		return err;
	}

	const handleNameReceiver = (event) => {
		setNameReceiver(event.target.value);
		if (!!errors[nameReceiver])
			setErrors({
				...errors,
				[nameReceiver]: null,
			});
	};
	const handleType = (event) => {
		setType(event.target.value);
	};
	const handleAddress = (event) => {
		setAddress(event.target.value);
	};
	const handleAddition = (event) => {
		setAddition(event.target.value);
	};

	const validateForm = (backandValid) => {
		const newErrors = {};
		if (backandValid === "No connection to the server")
			newErrors.server = backandValid;
		if (backandValid === "The given receiver already exists")
			newErrors.nameReceiver = backandValid;
		if (backandValid === "Type cannot be empty") newErrors.type = backandValid;

		return newErrors;
	};

	async function addReceiver(e) {
		e.preventDefault();
		let formErrors;
		let backandValid;
		if (type === "") {
			const err = "Type cannot be empty";
			formErrors = validateForm(err);
		} else {
			const receiver = {
				nameReceiver,
				type,
				addition,
				address,
			};
			backandValid = await addToBase(receiver);
			formErrors = validateForm(backandValid);
		}

		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else navigate("/receiver");
	}

	return (
		<Container className='mt-3'>
			<h1>Add Receiver</h1>
			{errors.server !== undefined && (
				<Alert variant='danger'>{errors.server}</Alert>
			)}
			{errors.type !== undefined && (
				<Alert variant='danger'>{errors.type}</Alert>
			)}

			<Form onSubmit={addReceiver}>
				<Form.Group controlId='validationCustomNameReceiver'>
					<FloatingLabel
						controlId='floatingNameReceiver'
						label='Name'
						className='mb-3'>
						<Form.Control
							type='text'
							placeholder='Name'
							name='name'
							value={nameReceiver}
							required
							isInvalid={!!errors.nameReceiver}
							onChange={handleNameReceiver}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.nameReceiver}
						</Form.Control.Feedback>
					</FloatingLabel>
				</Form.Group>

				<Form.Select
					size='lg'
					aria-label='Default select example'
					onChange={handleType}
					className='mb-3'
					defaultValue={"null"}>
					<option disabled value='null'>
						Type
					</option>
					<option value='email'>email</option>
					<option value='telegram'>telegram</option>
				</Form.Select>

				<Form.Group controlId='validationCustomAddress'>
					<FloatingLabel
						controlId='floatingAddress'
						label='Address'
						className='mb-3'>
						<Form.Control
							type='text'
							placeholder='address'
							name='address'
							value={address}
							required
							onChange={handleAddress}
						/>
					</FloatingLabel>
				</Form.Group>

				<Form.Group controlId='validationCustomAddition'>
					<FloatingLabel
						controlId='floatingAddition'
						label='Addition'
						className='mb-3'>
						<Form.Control
							type='text'
							placeholder='addition'
							name='addition'
							value={addition}
							onChange={handleAddition}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.addition}
						</Form.Control.Feedback>
					</FloatingLabel>
				</Form.Group>
				<Button className='float-end' variant='primary' type='submit'>
					Add
				</Button>
			</Form>
		</Container>
	);
}

export default NewReceiver;
