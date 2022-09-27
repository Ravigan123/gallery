import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

function NewLocation() {
	const [name, setName] = useState("");
	const [del, setDel] = useState("");
	const [url, setUrl] = useState("");
	const [interval, setInterval] = useState("");
	const [checked, setChecked] = useState(false);
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	async function addToBase(location) {
		let err;
		try {
			await axios.post("http://localhost:4000/location", location);
		} catch (error) {
			if (error.response.data === undefined)
				err = "No connection to the server";
			else err = error.response.data.message;
		}
		return err;
	}

	const handleName = (event) => {
		setName(event.target.value);
		if (!!errors[name])
			setErrors({
				...errors,
				[name]: null,
			});
	};
	const handleDel = (event) => {
		setDel(event.target.value);
	};
	const handleUrl = (event) => {
		setUrl(event.target.value);
	};
	const handleInterval = (event) => {
		setInterval(event.target.value);
	};
	const handleChange = (checked) => {
		setChecked(!checked);
	};

	const validateForm = (backandValid) => {
		const newErrors = {};
		if (backandValid === "No connection to the server")
			newErrors.server = backandValid;
		if (backandValid === "The given location already exists")
			newErrors.name = backandValid;

		return newErrors;
	};

	async function addLocation(e) {
		e.preventDefault();
		let enabled;
		if (checked === true) enabled = 1;
		else enabled = 0;
		const location = {
			name,
			del,
			url,
			interval,
			enabled,
		};

		const backandValid = await addToBase(location);
		const formErrors = validateForm(backandValid);

		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else navigate("/location");
	}

	return (
		<Container className='mt-3'>
			<h1>Add location</h1>
			{errors.server !== undefined && (
				<Alert variant='danger'>{errors.server}</Alert>
			)}

			<Form onSubmit={addLocation}>
				<Form.Group controlId='validationCustomName'>
					<FloatingLabel controlId='floatingName' label='Name' className='mb-3'>
						<Form.Control
							type='text'
							placeholder='Name'
							name='name'
							value={name}
							required
							isInvalid={!!errors.name}
							onChange={handleName}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.name}
						</Form.Control.Feedback>
					</FloatingLabel>
				</Form.Group>

				<Form.Group controlId='validationCustomDelete'>
					<FloatingLabel
						controlId='floatingDelete'
						label='Delete'
						className='mb-3'>
						<Form.Control
							type='number'
							placeholder='Delete time'
							name='delete'
							value={del}
							required
							isInvalid={!!errors.delete}
							onChange={handleDel}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.delete}
						</Form.Control.Feedback>
					</FloatingLabel>
				</Form.Group>

				<Form.Group controlId='validationCustomUrl'>
					<FloatingLabel controlId='floatingUrl' label='Url' className='mb-3'>
						<Form.Control
							type='text'
							placeholder='Url'
							name='url'
							value={url}
							required
							isInvalid={!!errors.url}
							onChange={handleUrl}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.url}
						</Form.Control.Feedback>
					</FloatingLabel>
				</Form.Group>

				<Form.Group controlId='validationCustomInterval'>
					<FloatingLabel
						controlId='floatingInterval'
						label='Interval'
						className='mb-3'>
						<Form.Control
							type='number'
							placeholder='Interval'
							name='interval'
							value={interval}
							required
							isInvalid={!!errors.interval}
							onChange={handleInterval}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.interval}
						</Form.Control.Feedback>
					</FloatingLabel>
				</Form.Group>
				<Form.Group className='mb-3' controlId='formBasicCheckbox'>
					<Form.Check
						type='checkbox'
						label='Enabled'
						name='checked'
						onChange={() => handleChange(checked)}
					/>
				</Form.Group>

				<Button className='float-end' variant='primary' type='submit'>
					Add
				</Button>
			</Form>
		</Container>
	);
}

export default NewLocation;
