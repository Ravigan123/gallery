import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";

function EditDevice(props) {
	const [name, setName] = useState(props.name);
	const [changedName, setchangedName] = useState(false);
	const [type, setType] = useState(props.type);
	const [location, setLocation] = useState(props.location);
	const [interval, setInterval] = useState(props.interval);
	const [checked, setChecked] = useState(props.enabled === 1 ? true : false);
	const [params, setParams] = useState(props.params);
	const [details, setDetails] = useState(props.details);
	const [errors, setErrors] = useState({});
	const [types, setTypes] = useState([]);
	const [locations, setlocations] = useState([]);

	useEffect(() => {
		feachTypes();
		feachLocations();
	}, []);

	async function feachTypes() {
		axios.get(`${process.env.REACT_APP_API_URL}typeSelect`).then((res) => {
			const types = res.data;
			setTypes(types);
		});
	}
	async function feachLocations() {
		axios
			.get(`${process.env.REACT_APP_API_URL}getLocationSelect`)
			.then((res) => {
				const locations = res.data;
				setlocations(locations);
			});
	}

	async function validDevice(device) {
		const id = device.id;
		let err;
		try {
			await axios.put(`${process.env.REACT_APP_API_URL}device/` + id, device);
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
	const handleLocation = (event) => {
		setLocation(event.target.value);
	};
	const handleType = (event) => {
		setType(event.target.value);
	};
	const handleInterval = (event) => {
		setInterval(event.target.value);
	};
	const handleDetails = (event) => {
		setDetails(event.target.value);
	};
	const handleParams = (event) => {
		setParams(event.target.value);
	};
	const handleChange = (checked) => {
		setChecked(!checked);
	};

	const validateForm = (backandValid) => {
		const newErrors = {};

		if (backandValid !== undefined) newErrors.name = backandValid;

		return newErrors;
	};

	async function editDevice(e) {
		e.preventDefault();
		let enabled;
		if (checked === true) enabled = 1;
		else enabled = 0;
		const device = {
			id: props.id,
			name,
			location,
			type,
			params,
			details,
			interval,
			enabled,
			changedName,
		};
		console.log(device);
		const backendValid = await validDevice(device);
		const formErrors = validateForm(backendValid);
		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else {
			window.location.reload(false);
			props.onCancel();
		}
	}

	return (
		<Container className='mt-3'>
			<h1>Edit Device</h1>
			<Form onSubmit={editDevice}>
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
					{types.map((type) => {
						return (
							<option key={type.id} value={type.id}>
								{type.name_type}
							</option>
						);
					})}
				</Form.Select>
				<Form.Select
					size='lg'
					aria-label='Default select example'
					onChange={handleLocation}
					className='mb-3'
					value={location}>
					<option disabled>Location</option>
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
						controlId='floatingParams'
						label='params'
						className='mb-3'>
						<Form.Control
							type='text'
							placeholder='Params'
							name='params'
							value={params}
							isInvalid={!!errors.params}
							onChange={handleParams}
						/>
					</FloatingLabel>
				</Form.Group>
				<Form.Group>
					<FloatingLabel
						controlId='floatingDetails'
						label='details'
						className='mb-3'>
						<Form.Control
							type='text'
							placeholder='Details'
							name='details'
							value={details}
							isInvalid={!!errors.details}
							onChange={handleDetails}
						/>
					</FloatingLabel>
				</Form.Group>

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
							required
							isInvalid={!!errors.interval}
							onChange={handleInterval}
						/>
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

export default EditDevice;
