const cron = require("node-cron");
const Data = require("../models/Data");
const Location = require("../models/Location");
const Archive = require("../models/Archive");
const { transaction } = require("objection");
const axios = require("axios");

async function Send() {
	cron.schedule(`* * * * * *`, async function Checksend() {
		const dataQuery = await Data.query()
			.select(
				"locations.name_location",
				"locations.code_to_send",
				"locations.url",
				"locations.interval_location",
				"data.id",
				"data.in",
				"data.out",
				"data.hour",
				"data.date_real",
				"data.date_out",
				"data.id_location",
				"data.id_device",
				"data.interval",
				"devices.id_to_send"
			)
			.innerJoin("locations", "locations.id", "data.id_location")
			.innerJoin("devices", "devices.id", "data.id_device")
			.where("locations.enabled", 1);

		for (const entry of dataQuery) {
			const d = new Date();
			if (d.getSeconds() % entry["interval_location"] == 0) {
				const now = d.toLocaleString("se-SE", {
					timeZone: "Europe/Warsaw",
				});

				const date_real = entry["date_real"].toLocaleString("se-SE", {
					timeZone: "Europe/Warsaw",
				});

				const dateSplit = date_real.split(" ");
				const date = dateSplit[0];

				const data = [];
				const snededObject = {
					code: entry["code_to_send"],
					type_id: entry["id_to_send"],
					date,
					hour: entry["hour"],
					sumIn: entry["in"],
					sumOut: entry["out"],
				};
				data.push(snededObject);

				let part = "";
				part = entry["url"].split(",");

				for (const url of part) {
					axios
						.post(
							url,
							{ data },
							{
								params: { reAuth: process.env.BLUEYE_KEY },
								timeout: 1000 * 60 * 5,
							}
						)
						.then(async (res) => {
							await transaction(Archive, async (Archive, trx) => {
								const archiveStore = await trx("archives").insert({
									id_location: entry["id_location"],
									id_device: entry["id_device"],
									interval: entry["interval"],
									in: entry["in"],
									out: entry["out"],
									hour: entry["hour"],
									date_real: entry["date_real"],
									date_out: now,
								});

								const dataDel = await Data.query(trx).deleteById(entry["id"]);
							});
						})
						.catch("error", async (err) => {
							console.log(err);
							try {
								const id = entry["id"];
								const dataError = await Data.query().findById(id).patch({
									date_out: now,
									description: err.message,
									status: 0,
								});
							} catch (error) {
								console.log("Error: " + error.message);
							}
						});
				}
			}
		}
	});
}

module.exports = Send();
