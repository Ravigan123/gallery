import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";

function EditLocation(props) {
	const [name, setName] = useState(props.name);
	const [changedName, setchangedName] = useState(false);
	const [del, setDel] = useState(props.delete);
	const [url, setUrl] = useState(props.url);
	const [interval, setInterval] = useState(props.interval);
	let [checked, setChecked] = useState(props.enabled === 1 ? true : false);
	const [errors, setErrors] = useState({});

	async function validLocation(location) {
		const id = location.id;
		let err;
		try {
			await axios.put(
				`${process.env.REACT_APP_API_URL}location/` + id,
				location
			);
		} catch (error) {
			err = error.response.data.message;
		}
		return err;
	}

	const handleName = (event) => {
		setName(event.target.value);
		setchangedName(true);
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

		if (backandValid !== undefined) newErrors.name = backandValid;

		return newErrors;
	};

	async function editLocation(e) {
		e.preventDefault();
		let enabled;
		if (checked === true) enabled = 1;
		else enabled = 0;
		const location = {
			id: props.id,
			name,
			enabled,
			del,
			url,
			interval,
			changedName,
		};

		const backendValid = await validLocation(location);
		const formErrors = validateForm(backendValid);
		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else {
			window.location.reload(false);
			props.onCancel();
		}
	}

	return (
		<Container className='mt-3'>
			<h1>Edit location</h1>
			<Form onSubmit={editLocation}>
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
							isInvalid={!!errors.del}
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
						checked={checked}
						onChange={() => handleChange(checked)}
					/>
				</Form.Group>

				<Button
					className='float-end Formmargin'
					variant='success'
					type='submit'>
					Edit
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

export default EditLocation;
