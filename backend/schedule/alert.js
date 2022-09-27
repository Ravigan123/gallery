// const cron = require("node-cron");
// const Data = require("../models/Data");
// const Location = require("../models/Location");
// const Archive = require("../models/Archive");
// const { transaction } = require("objection");
// const axios = require("axios");

// async function Send() {
// 	cron.schedule(`* * * * * *`, async function Checksend() {
// 		const dataQuery = await Data.query()
// 			.select(
// 				"locations.name_location",
// 				"locations.url",
// 				"locations.interval_location",
// 				"data.id",
// 				"data.in",
// 				"data.out",
// 				"data.date_real",
// 				"data.date_out",
// 				"data.id_location",
// 				"data.id_device",
// 				"data.interval",
// 				"data.created_at"
// 			)
// 			.innerJoin("locations", "locations.id", "data.id_location")
// 			.where("locations.enabled", 1);

// 		for (const data of dataQuery) {
// 			const d = new Date();
// 			if (d.getMinutes() % data["interval_location"] == 0) {
// 				const now = d.toLocaleString("se-SE", {
// 					timeZone: "Europe/Warsaw",
// 				});

// 				let part = "";
// 				part = data["url"].split(",");
// 				for (const url of part) {
// 					axios
// 						.get(url)
// 						.then(async (resp) => {
// 							await transaction(Archive, async (Archive, trx) => {
// 								const archiveStore = await trx("archives").insert({
// 									id_location: data["id_location"],
// 									id_device: data["id_device"],
// 									interval: data["interval"],
// 									in: data["in"],
// 									out: data["out"],
// 									date_real: data["date_real"],
// 									date_out: now,
// 								});

// 								const dataDel = await Data.query(trx).deleteById(data["id"]);

// 								return {
// 									archiveStore,
// 									dataDel,
// 								};
// 							});
// 						})
// 						.then("error", async (err) => {
// 							try {
// 								const id = data["id"];
// 								const dataError = await Data.query().findById(id).patch({
// 									date_out: now,
// 									description: err.message,
// 									status: 0,
// 								});
// 							} catch (error) {
// 								// return res.status(422).json({ message: error.message });
// 								console.log("Error: " + error.message);
// 							}
// 						});
// 				}
// 			}
// 		}
// 	});
// }

// module.exports = Send();

const cron = require("node-cron");
const http = require("http");
const Server = require("./models/Server");
const Alert = require("./models/Alert");

function Telegram(params) {
	cron.schedule("* * * * * *", async function telegram(params) {
		const alerts = await Alert.query()
			.innerJoin("alert_receivers", "alerts.id", "alert_receivers.id_alert")
			.innerJoin("receivers", "alert_receivers.id_reveiver", "reveivers.id");

		console.log(alerts);
		// for (const alert of alerts) {
		// 	const values = await Server.query()
		// 		.select("qualities.code", "qualities.worth")
		// 		.innerJoin("server_titles", "servers.id", "server_titles.server_id")
		// 		.innerJoin("titles", "server_titles.title_id", "titles.id")
		// 		.innerJoin(
		// 			"qualities",
		// 			"qualities.server_titles_id",
		// 			"server_titles.id"
		// 		)
		// 		.where("qualities.date", alert.req_date)
		// 		.where("servers.name", alert.name)
		// 		.where("titles.name_title", alert.name_title);

		// 	if (alert.action == "suma") {
		// 		let suma = 0;
		// 		for (const value of values) {
		// 			suma += value.worth;
		// 		}
		// 		if (suma > alert.alert_worth) {
		// 			const message =
		// 				alert.name +
		// 				" " +
		// 				alert.name_title +
		// 				": " +
		// 				suma +
		// 				" " +
		// 				alert.type +
		// 				" " +
		// 				alert.alert_worth;

		// 			let part = "";
		// 			const str = alert.id_chat.replace(/\s/g, "");
		// 			part = str.split(",");
		// 			for (const chat of part) {
		// 				http
		// 					.get(
		// 						"http://pikora.wamasof2.vot.pl/config/message?user=DOWOLNANAZWA&sender=" +
		// 							alert.telegram_user +
		// 							"&message=" +
		// 							message +
		// 							"&receiver=" +
		// 							chat,
		// 						async (resp) => {
		// 							// const delAlert = await Alert.query().deleteById(alert.id);
		// 						}
		// 					)
		// 					.on("error", (err) => {
		// 						console.log("Error: " + err.message);
		// 					});
		// 			}
		// 		}
		// 	} else if (alert.action == "pojedynczo") {
		// 		let flag = 0;
		// 		let tab = "";
		// 		const count = values.length;
		// 		for (const value of values) {
		// 			if (value.worth > alert.alert_worth) {
		// 				tab += value.code;
		// 				tab += " - ";
		// 				tab += value.worth;
		// 				tab += ", ";
		// 				flag = 1;
		// 			}
		// 		}
		// 		if (flag == 1) {
		// 			const message =
		// 				alert.name +
		// 				" " +
		// 				alert.name_title +
		// 				": " +
		// 				tab +
		// 				" " +
		// 				alert.type +
		// 				" " +
		// 				alert.alert_worth;

		// 			let part = "";
		// 			part = alert.id_chat.split(",");
		// 			for (const chat of part) {
		// 				http
		// 					.get(
		// 						"http://pikora.wamasof2.vot.pl/config/message?user=DOWOLNANAZWA&sender=" +
		// 							alert.telegram_user +
		// 							"&message=" +
		// 							message +
		// 							"&receiver=" +
		// 							chat,
		// 						async (resp) => {
		// 							// const delAlert = await Alert.query().deleteById(alert.id);
		// 						}
		// 					)
		// 					.on("error", (err) => {
		// 						console.log("Error: " + err.message);
		// 					});
		// 			}
		// 		}
		// 	}
		// }
	});
}

module.exports = Telegram();
