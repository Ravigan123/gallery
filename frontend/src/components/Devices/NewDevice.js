import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

function NewDevice() {
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [location, setLocation] = useState("");
	const [interval, setInterval] = useState("");
	const [checked, setChecked] = useState(false);
	const [params, setParams] = useState("");
	const [details, setDetails] = useState("");
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
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

	async function addToBase(device) {
		let err;
		try {
			await axios.post(`${process.env.REACT_APP_API_URL}device`, device);
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

		if (backandValid === "No connection to the server")
			newErrors.server = backandValid;
		if (backandValid === "The given device already exists")
			newErrors.name = backandValid;
		if (backandValid === "Type and Location cannot be empty")
			newErrors.typeLocation = backandValid;

		return newErrors;
	};

	async function addDevice(e) {
		e.preventDefault();
		let formErrors;
		let backandValid;
		if (location === "" || type === "") {
			const err = "Type and Location cannot be empty";
			formErrors = validateForm(err);
		} else {
			let enabled;
			if (checked === true) enabled = 1;
			else enabled = 0;
			const device = {
				name,
				location,
				type,
				params,
				details,
				interval,
				enabled,
			};
			backandValid = await addToBase(device);
			formErrors = validateForm(backandValid);
		}

		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else navigate("/device");
	}

	return (
		<Container className='mt-3'>
			<h1>Add Device</h1>
			{errors.server !== undefined && (
				<Alert variant='danger'>{errors.server}</Alert>
			)}
			{errors.typeLocation !== undefined && (
				<Alert variant='danger'>{errors.typeLocation}</Alert>
			)}

			<Form onSubmit={addDevice}>
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
					defaultValue='null'>
					<option value='null' disabled>
						Type
					</option>
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
						controlId='floatingParams'
						label='Params'
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
						label='Details'
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

export default NewDevice;
