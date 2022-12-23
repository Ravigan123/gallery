const { Model } = require("objection");
require("objection");
const knex = require("../config/database");
Model.knex(knex);

class Sender extends Model {
	static tableName = "senders";
}

module.exports = Sender;
