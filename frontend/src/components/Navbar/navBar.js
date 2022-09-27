import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavBar() {
	return (
		<Navbar bg='primary' variant='dark'>
			<Container>
				<Navbar.Brand href='/'>Home</Navbar.Brand>
				<Nav className='me-auto'>
					<Nav.Link href='/location'>Location</Nav.Link>
					<Nav.Link href='/device'>Device</Nav.Link>
					<Nav.Link href='/type'>Type</Nav.Link>
					<Nav.Link href='/receiver'>Receiver</Nav.Link>
					<Nav.Link href='/alert'>Alert</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	);
}

export default NavBar;
