/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("alert_types", (table) => {
		table.increments("id").primary();
		table.string("name_alert", 30).notNullable();
		table.integer("code").notNullable();
		table.integer("interval_alert").notNullable();
		table.timestamps(false, true);
		table.unique(["id"], "idx_id_alert_type");
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("alert_types");
};
