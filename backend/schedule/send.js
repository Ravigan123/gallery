const cron = require("node-cron");
const Data = require("../models/Data");
const Location = require("../models/Location");
const Archive = require("../models/Archive");
const { transaction } = require("objection");
const axios = require("axios");

const https = require("https");
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function Send() {
	cron.schedule(`* * * * *`, async function Checksend() {
		try {
			const locations = await Location.query()
				.select(
					"locations.code_to_send",
					"locations.url",
					"locations.interval_location"
				)
				.where("locations.enabled", 1);

			for (const location of locations) {
				const d = new Date();
				const now = d.toLocaleString("se-SE", {
					timeZone: "Europe/Bucharest",
				});

				if (d.getMinutes() % location["interval_location"] == 0) {
					const data = [];

					const getData = await Data.query()
						.select(
							"locations.code_to_send",
							"locations.url",
							"locations.interval_location",
							"data.id",
							"data.in",
							"data.out",
							"data.hour",
							"data.status",
							"data.date_real",
							"data.date_out",
							"data.id_location",
							"data.id_device",
							"devices.id_to_send"
						)
						.innerJoin("locations", "locations.id", "data.id_location")
						.innerJoin("devices", "devices.id", "data.id_device")
						.where("locations.code_to_send", location["code_to_send"])
						.where("locations.enabled", 1)
						.where("data.status", 1)
						.orderBy("data.id_device")
						.orderBy("data.date_real")
						.orderBy("data.hour");

					console.log(getData);
					let sumIn = 0;
					let pomSumIn = 0;
					let sumOut = 0;
					let pomSumOut = 0;
					let prevEntry;

					for (const entry of getData) {
						let prevDate_real;
						if (prevEntry !== undefined) {
							prevDate_real = prevEntry["date_real"].toLocaleString("se-SE", {
								timeZone: "Europe/Warsaw",
							});
						}

						const date_real = entry["date_real"].toLocaleString("se-SE", {
							timeZone: "Europe/Warsaw",
						});

						const dateSplit = date_real.split(" ");
						const date = dateSplit[0];

						if (prevEntry === undefined) {
							sumIn = entry["in"];
							pomSumIn = entry["in"];
							sumOut = entry["out"];
							pomSumOut = entry["out"];
						} else if (
							prevEntry["id_device"] !== entry["id_device"] ||
							prevDate_real != date_real
						) {
							sumIn = entry["in"];
							pomSumIn = entry["in"];
							sumOut = entry["out"];
							pomSumOut = entry["out"];
						} else {
							if (entry["hour"] == 24) {
								sumIn = entry["in"];
								pomSumIn = entry["in"];
								sumOut = entry["out"];
								pomSumOut = entry["out"];
							} else if (entry["hour"] > 24) {
								sumIn = entry["sumIn"] - pomSumIn;
								pomSumIn = entry["sumIn"];
								sumOut = entry["sumOut"] - pomSumOut;
								pomSumOut = entry["sumOut"];
							} else {
								sumIn = entry["in"] - pomSumIn;
								pomSumIn = entry["in"];
								sumOut = entry["out"] - pomSumOut;
								pomSumOut = entry["out"];
							}
						}

						const snededObject = {
							code: entry["code_to_send"],
							type_id: entry["id_to_send"],
							date,
							hour: entry["hour"],
							sumIn,
							sumOut,
						};
						data.push(snededObject);
						prevEntry = entry;
					}
					let part = "";
					part = location["url"].split(",");

					for (const url of part) {
						console.log(`SENDING: ${data.length} data entries to ${url}`);
						axios
							.post(
								url,
								{ data },
								{
									params: { reAuth: process.env.BLUEYE_KEY },
									timeout: 1000 * 60 * 5,
									httpsAgent,
								}
							)
							.then(async (res) => {
								console.log(`SENT: ${data.length} data entries to ${url}`);

								for (const entry of getData) {
									const id = entry["id"];
									const updateData = await Data.query().findById(id).patch({
										status: 0,
										date_out: now,
									});
								}

								// for (const entry of getData) {
								// 	await transaction(Archive, async (Archive, trx) => {
								// 		const archiveStore = await trx("archives").insert({
								// 			id_location: entry["id_location"],
								// 			id_device: entry["id_device"],
								// 			in: entry["in"],
								// 			out: entry["out"],
								// 			hour: entry["hour"],
								// 			date_real: entry["date_real"],
								// 			date_out: now,
								// 		});
								// 		const dataDel = await Data.query(trx).deleteById(
								// 			entry["id"]
								// 		);
								// 	});
								// }
							})
							.catch(async (err) => {
								console.error(`ERROR: data push to ${url} failed [${err}]`);

								for (const entry of getData) {
									const id = entry["id"];
									const dataError = await Data.query().findById(id).patch({
										date_out: now,
										description: err.message,
										status: 1,
									});
								}
							});
					}
				}
			}
		} catch (error) {
			console.error(`ERROR: ${error.message}`);
		}
	});
}

module.exports = Send();
