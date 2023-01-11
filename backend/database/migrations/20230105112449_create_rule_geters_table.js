/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("rule_geters", (table) => {
		table.increments("id").primary();
		table.integer("id_location").unsigned().notNullable();
		table
			.foreign("id_location")
			.references("locations.id")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table.integer("id_script").unsigned().notNullable();
		table
			.foreign("id_script")
			.references("scripts.id")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table.integer("interval").notNullable();
		table.integer("days_back").notNullable().defaultTo(0);
		table.string("hour_back ").notNullable();
		table.datetime("date_run").notNullable();
		table.boolean("enabled").notNullable();
		table.string("params");
		table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
		table
			.timestamp("updated_at")
			.defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
		table.unique(["id"], "idx_id_rule_geters");
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("rule_geters");
};
