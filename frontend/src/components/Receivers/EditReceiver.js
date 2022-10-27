import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";

function EditReceiver(props) {
	const [changedName, setchangedName] = useState(false);
	const [name, setName] = useState(props.name);
	const [type, setType] = useState(props.type);
	const [address, setAddress] = useState(props.address);
	const [addition, setAddition] = useState(props.addition);
	const [errors, setErrors] = useState({});

	async function validReceiver(receiver) {
		const id = receiver.id;
		let err;
		try {
			await axios.put(
				`${process.env.REACT_APP_API_URL}receiver/` + id,
				receiver
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

		if (backandValid !== undefined) newErrors.name = backandValid;

		return newErrors;
	};

	async function editReceiver(e) {
		e.preventDefault();

		const receiver = {
			id: props.id,
			name,
			type,
			address,
			addition,
			changedName,
		};

		const backendValid = await validReceiver(receiver);
		const formErrors = validateForm(backendValid);
		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else {
			window.location.reload(false);
			props.onCancel();
		}
	}

	return (
		<Container className='mt-3'>
			<h1>Edit Receiver</h1>
			<Form onSubmit={editReceiver}>
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

				<Form.Select
					size='lg'
					aria-label='Default select example'
					onChange={handleType}
					className='mb-3'
					value={type}>
					<option disabled>Type</option>
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
					</FloatingLabel>
				</Form.Group>

				<Button
					className='float-end Formmargin'
					variant='success'
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

export default EditReceiver;
