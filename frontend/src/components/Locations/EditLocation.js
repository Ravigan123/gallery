import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";

function EditLocation(props) {
	const [name, setName] = useState(props.name);
	const [code, setCode] = useState(props.code);
	const [codeSend, setCodeSend] = useState(props.codeSend);
	const [codeReceive, setCodeReceive] = useState(props.codeReceive);
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
	const handleCodeSend = (event) => {
		setCodeSend(event.target.value);
	};
	const handleCodeReceive = (event) => {
		setCodeReceive(event.target.value);
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
			codeSend,
			codeReceive,
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

				<Form.Group controlId='validationCustomCodeSend'>
					<FloatingLabel
						controlId='floatingCodeSend'
						label='CodeSend'
						className='mb-3'>
						<Form.Control
							type='text'
							placeholder='Code To Send'
							name='codeSend'
							value={codeSend}
							required
							onChange={handleCodeSend}
						/>
					</FloatingLabel>
				</Form.Group>
				<Form.Group controlId='validationCustomCodeReceive'>
					<FloatingLabel
						controlId='floatingCodeReceive'
						label='CodeReceive'
						className='mb-3'>
						<Form.Control
							type='text'
							placeholder='Code to Receive'
							name='codeReceive'
							value={codeReceive}
							required
							onChange={handleCodeReceive}
						/>
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
							min='0'
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
							min='0'
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
