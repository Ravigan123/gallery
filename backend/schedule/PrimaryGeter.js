const cron = require("node-cron");
const GlobalGeter = require("../Geters/GlobalGeter");
const EntranceGeter = require("../Geters/EntranceGeter");
const RuleGeter = require("../models/RuleGeter");

async function PrimaryGeter() {
	cron.schedule(`* * * * *`, async function del() {
		try {
			const date = new Date();
			const checkRules = await RuleGeter.query()
				.select(
					"rule_geters.id",
					"id_location",
					"scripts.name as script",
					"interval",
					"days_back",
					"hour_back ",
					"date_run"
				)
				.innerJoin("scripts", "scripts.id", "rule_geters.id_script")
				.where("rule_geters.enabled", 1)
				.where("scripts.enabled", 1)
				.where("date_run", "<=", date);

			for (const rule of checkRules) {
				// if (rule["script"] === "global") {
				// 	const data = await GlobalGeter.getData();
				// 	const checkData = await GlobalGeter.checkData(data);
				// 	const storeData = await GlobalGeter.storeData(checkData)
				// 		.then((result) => {
				// 			console.log(result);
				// 		})
				// 		.catch((error) => {
				// 			console.error(error);
				// 		});
				// }
				console.log(rule);
				const {
					id,
					id_location,
					script,
					interval,
					days_back,
					hour_back,
					date_run,
				} = rule;

				if (script === "targujiu") {
					const data = await EntranceGeter.getData(days_back, hour_back);
					const checkData = await EntranceGeter.checkData(data);
					const storeData = await EntranceGeter.storeData(checkData)
						.then(async (result) => {
							console.log(`Data saved to database`);
							date_run.setMinutes(date_run.getMinutes() + interval);
							const updateDateRun = await RuleGeter.query().findById(id).patch({
								date_run,
							});
						})
						.catch((error) => {
							console.error(`ERROR: ${error}`);
						});
				}
			}
		} catch (error) {
			console.error(`ERROR: ${error.message}`);
		}
	});
}
module.exports = PrimaryGeter();
