const { Model } = require("objection");
const knex = require("../config/database");
const Data = require("./Data");
const Device = require("./Device");
const Archive = require("./Archive");
const AlertTypeReceiver = require("./AlertTypeReceiver");
const Sender = require("./Sender");
const RuleGeter = require("./RuleGeter");
Model.knex(knex);

class Location extends Model {
	static tableName = "locations";

	static relationMappings = {
		data: {
			relation: Model.HasManyRelation,
			modelClass: Data,
			join: {
				from: "locations.id",
				to: "data.id_location",
			},
		},
	};

	static relationMappings = {
		archive: {
			relation: Model.HasManyRelation,
			modelClass: Archive,
			join: {
				from: "locations.id",
				to: "archives.id_location",
			},
		},
	};

	static relationMappings = {
		device: {
			relation: Model.HasManyRelation,
			modelClass: Device,
			join: {
				from: "locations.id",
				to: "devices.id_location",
			},
		},
	};

	static relationMappings = {
		alert_type_receivers: {
			relation: Model.HasManyRelation,
			modelClass: AlertTypeReceiver,
			join: {
				from: "locations.id",
				to: "alert_type_receivers.id_location",
			},
		},
	};

	static relationMappings = {
		sender: {
			relation: Model.HasManyRelation,
			modelClass: Sender,
			join: {
				from: "locations.id",
				to: "senders.id_location",
			},
		},
	};

	static relationMappings = {
		rule_geter: {
			relation: Model.HasManyRelation,
			modelClass: RuleGeter,
			join: {
				from: "locations.id",
				to: "rule_geter.id_location",
			},
		},
	};
}

module.exports = Location;
