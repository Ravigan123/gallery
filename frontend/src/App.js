import React from "react";
import Location from "./components/Locations/Locations";
import NavBar from "./components/Navbar/navBar";
import Data from "./components/Data/Data";
import NewLocation from "./components/Locations/NewLocation";
import NewDevice from "./components/Devices/NewDevice";
import Device from "./components/Devices/Device";
import Type from "./components/Types/Types";
import Alert from "./components/Alerts/Alerts";
import Receiver from "./components/Receivers/Receivers";
import NewReceiver from "./components/Receivers/NewReceiver";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
	return (
		<>
			<NavBar />
			<Router>
				<Routes>
					<Route path='/' element={<Data />} />
				</Routes>
				<Routes>
					<Route path='/location' element={<Location />} />
				</Routes>
				<Routes>
					<Route path='/location/create' element={<NewLocation />} />
				</Routes>
				<Routes>
					<Route path='/device' element={<Device />} />
				</Routes>
				<Routes>
					<Route path='/device/create' element={<NewDevice />} />
				</Routes>
				<Routes>
					<Route path='/type' element={<Type />} />
				</Routes>
				<Routes>
					<Route path='/receiver' element={<Receiver />} />
				</Routes>
				<Routes>
					<Route path='/receiver/create' element={<NewReceiver />} />
				</Routes>
				<Routes>
					<Route path='/alert' element={<Alert />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
