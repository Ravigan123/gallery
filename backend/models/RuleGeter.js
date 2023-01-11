const { Model } = require("objection");
require("objection");
const knex = require("../config/database");
Model.knex(knex);

class Rulegeter extends Model {
	static tableName = "rule_geters";
}

module.exports = Rulegeter;
