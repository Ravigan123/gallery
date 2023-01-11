const cron = require("node-cron");
const Device = require("../models/Device");
const Data = require("../models/Data");
const Location = require("../models/Location");
const DataController = require("../controllers/DataController");
const axios = require("axios");
const GlobalGeter = require("./GlobalGeter");

// `2,7,12,17,22,27,32,37,42,47,52,57 * * * *`,

class EntranceGeter extends GlobalGeter.constructor {
	async getData(days_back, hour_back, dateStart) {
		try {
			// const urlToGetData = ["http://localhost:8989/file"];
			// const urlToGetData = [
			// 	"http://10.110.2.40:8989/file",
			// 	"http://10.110.2.41:8989/file",
			// ];
			const urlToGetData = ["http://10.110.2.40:8989/file"];
			const date = new Date();
			let hour;
			if (days_back !== "") {
				const date = new Date();
				date.setDate(date.getDate() - days_back);

				const romaniaTime = date.toLocaleString("se-SE", {
					timeZone: "Europe/Bucharest",
				});

				const d = romaniaTime.split(" ");
				dateStart = d[0];

				if (hour_back.length === 1 || hour_back.length === 2) {
					const splitHour = d[1].split(":");
					const onlyHour = splitHour[0];
					const hourPom = parseInt(onlyHour) - hour_back;
					hour = hourPom;
				} else hour = hour_back;
			} else {
				hour = hour_back;
			}

			let result = [];
			for (const url of urlToGetData) {
				await axios
					.get(`${url}?date=${dateStart}&hour=${hour}`)
					.then(async (res) => {
						console.log(`GETTING: data from ${url}`);
						const data = res.data;
						const lengthData = res.data["Ora"].length;
						for (const title in data) {
							for (let i = 0; i < lengthData; i++) {
								const splitTime = data["Ora"][i].split(":");
								let hour;
								let noFullHour;
								if (splitTime[1] !== "00") {
									hour = parseInt(splitTime[0], 10);
									noFullHour = true;
								} else {
									hour = parseInt(splitTime[0], 10) - 1;
									noFullHour = false;
								}
								if (title !== "Ora") {
									const sumIn = data[title]["INTRATI"][i];
									const sumOut = data[title]["IESITI"][i];
									const toStore = {
										location: "targujiu",
										device: title,
										sumIn: parseInt(sumIn),
										sumOut: parseInt(sumOut),
										hour,
										date: dateStart,
										description: "",
										noFullHour,
									};
									result.push(toStore);
									// console.log(toStore);
									// store = await storeData(toStore);
									// if (store !== "OK") throw store;
								}
							}
						}
					})
					.catch(async (err) => {
						console.error(`ERROR: ${err}`);
					});
			}

			return result;
		} catch (error) {
			console.error(`ERROR: ${error.message}`);
		}
	}

	async checkData(data) {
		return data;
	}

	async storeData(data) {
		let newData;
		try {
			for (const entry of data) {
				const findLocation = await Location.query().findOne({
					code_to_receive: entry["location"],
				});

				if (findLocation === undefined) return "location not recognized";
				const findDevice = await Device.query().findOne({
					name_device: entry["device"],
				});
				if (findDevice === undefined) return "device not recognized";

				const {
					location,
					device,
					sumIn,
					sumOut,
					hour,
					description,
					date,
					noFullHour,
				} = entry;

				const checkData = await Data.query()
					.select("id")
					.where("id_location", findLocation["id"])
					.where("id_device", findDevice["id"])
					.where("hour", hour)
					.where("date_real", date);

				if (checkData.length === 0) {
					newData = await Data.query().insert({
						id_location: findLocation["id"],
						id_device: findDevice["id"],
						in: sumIn,
						out: sumOut,
						hour,
						status: 1,
						date_real: date,
					});
				} else {
					const id = checkData[0]["id"];
					newData = await Data.query().findById(id).patch({
						in: sumIn,
						out: sumOut,
						status: 1,
					});
					// if (noFullHour === true) {
					// 	newData = await Data.query().findById(id).patch({
					// 		in: sumIn,
					// 		out: sumOut,
					// 	});
					// }
				}
			}
		} catch (error) {
			return error.message;
		}
		return "OK";
	}
}

module.exports = new EntranceGeter();
