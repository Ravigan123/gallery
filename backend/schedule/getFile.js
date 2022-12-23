const cron = require("node-cron");
const Device = require("../models/Device");
const Data = require("../models/Data");
const Location = require("../models/Location");
const DataController = require("../controllers/DataController");
const axios = require("axios");

function getFile() {
	cron.schedule(`*/2 * * * * *`, async function del() {
		// console.log("object");
		const date = new Date();
		const romaniaTime = date.toLocaleString("se-SE", {
			timeZone: "Europe/Bucharest",
		});
		const d = romaniaTime.split(" ");
		const onlyDate = d[0];
		axios
			.get(`http://localhost:8989/file?data=${onlyDate}`)
			.then(async (res) => {
				// console.log(res.data);
				// zrobic rumunska strefe czasowa
				// dane np z godziny 11:00 to maja byc dane z 10
				const data = res.data;
				for (const title in data) {
					for (let i = 0; i < 11; i++) {
						const splitTime = data["Ora"][i].split(":");
						const hour = parseInt(splitTime[0], 10);
						if (title !== "Ora") {
							const toStore = {
								location: "321",
								device: title,
								interval: 5,
								sumIn: data[title]["INTRATI"][i],
								sumOut: data[title]["IESITI"][i],
								hour,
								date: onlyDate,
								description: "",
							};
							store = await storeData(toStore);
							if (store !== "OK") throw store;
						}
					}
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	});
}

async function storeData(data) {
	console.log(data);
	let newData;
	try {
		const findLocation = await Location.query().findOne({
			code_to_receive: data.location,
		});

		if (findLocation === undefined) return "location not recognized";

		const findDevice = await Device.query().findOne({
			id_to_receive: data.device,
		});

		if (findDevice === undefined) return "device not recognized";

		const {
			location,
			device,
			interval,
			sumIn,
			sumOut,
			hour,
			description,
			date,
		} = data;

		newData = await Data.query().insert({
			id_location: findLocation["id"],
			id_device: findDevice["id"],
			interval,
			in: sumIn,
			out: sumOut,
			hour,
			status: 1,
			date_real: date,
		});
	} catch (error) {
		return error.message;
	}
	return "OK";
}

module.exports = getFile();
