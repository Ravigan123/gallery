const Data = require("../models/Data");
const Location = require("../models/Location");
const Device = require("../models/Device");
const Archive = require("../models/Archive");
const Sender = require("../models/Sender");

class DataController {
	async getDataToDashboard(req, res) {
		try {
			const getDate = await Data.query()
				.select("id_device")
				.max("date_real", { as: "date" })
				.groupBy("id_device");

			let dates = [];
			for (const entry of getDate) {
				const getHour = await Data.query()
					.select("id_device", "hour", "date_real")
					.max("hour", { as: "hour" })
					.where("date_real", entry["date"]);

				dates.push(getHour);
			}

			let data = [];
			for (const entry of dates) {
				const getData = await Data.query()
					.select("id_device", "in", "out", "hour", "date_real")
					.where("id_device", entry[0]["id_device"])
					.where("date_real", entry[0]["date_real"])
					.where("hour", entry[0]["hour"]);
				const date_real = getData[0]["date_real"].toLocaleString("se-SE", {
					timeZone: "Europe/Warsaw",
				});
				const dateSplit = date_real.split(" ");
				const date = dateSplit[0];
				const oneData = {
					id_device: getData[0]["id_device"],
					in: getData[0]["in"],
					out: getData[0]["out"],
					hour: getData[0]["hour"],
					date,
				};
				data.push(oneData);
			}

			res.status(200).json(data);
		} catch (error) {
			console.log(error.message);
			res.status(422).json({ status: "ERROR", message: error.message });
		}
	}

	async getData(req, res) {
		res.send("dziala12");
	}

	async translateData(req, res) {
		const data = {
			interval: req.query.interval,
			in: req.query.in,
			out: req.query.out,
			location: req.query.location,
			device: req.query.device,
			date_real: req.query.date,
		};
		storeData(data, res);
	}

	async deleteData(req, res) {
		res.render("index");
	}

	async takeData(req, res) {
		let store;
		try {
			if (req.body.token === undefined)
				return res
					.status(422)
					.json({ status: "ERROR", message: "Empty token" });
			if (req.body.data === undefined)
				return res.status(422).json({ status: "ERROR", message: "Empty data" });

			const { token, data } = req.body;

			const checkToken = await Sender.query().count("id").where("token", token);

			if (checkToken[0]["count(`id`)"] === 0)
				return res
					.status(422)
					.json({ status: "ERROR", message: "Invalid Token" });

			for (const entry of data) {
				const data = {
					location: entry["location"],
					device: entry["device"],
					interval: entry["interval"],
					sumIn: entry["in"],
					sumOut: entry["out"],
					hour: entry["hour"],
					date: entry["date"],
					description: entry["description"],
				};

				store = await storeData(data);
				if (store !== "OK") throw store;
			}
		} catch (error) {
			res.status(422).json({ status: "ERROR", message: error.message });
		}
		if (store === "OK") res.status(201).json({ status: "OK" });
	}

	async deleteData(req, res) {
		res.render("index");
	}
}

async function storeData(data) {
	console.log("data");
	// let newData;
	// try {
	// 	const findLocation = await Location.query().findOne({
	// 		code_to_receive: data.location,
	// 	});

	// 	if (findLocation === undefined) return "location not recognized";

	// 	const findDevice = await Device.query().findOne({
	// 		id_to_receive: data.device,
	// 	});

	// 	if (findDevice === undefined) return "device not recognized";

	// 	const {
	// 		location,
	// 		device,
	// 		interval,
	// 		sumIn,
	// 		sumOut,
	// 		hour,
	// 		description,
	// 		date,
	// 	} = data;

	// 	newData = await Data.query().insert({
	// 		id_location: findLocation["id"],
	// 		id_device: findDevice["id"],
	// 		interval,
	// 		in: sumIn,
	// 		out: sumOut,
	// 		hour,
	// 		status: 1,
	// 		date_real: date,
	// 	});
	// } catch (error) {
	// 	return error.message;
	// }
	return "OK";
}

module.exports = new DataController();
