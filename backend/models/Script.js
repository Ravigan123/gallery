const { Model } = require("objection");
require("objection");
const knex = require("../config/database");
const RuleGeter = require("./RuleGeter");
Model.knex(knex);

class Script extends Model {
	static tableName = "scripts";

	static relationMappings = {
		rule_geter: {
			relation: Model.HasManyRelation,
			modelClass: RuleGeter,
			join: {
				from: "scripts.id",
				to: "rule_geter.id_script",
			},
		},
	};
}

module.exports = Script;
