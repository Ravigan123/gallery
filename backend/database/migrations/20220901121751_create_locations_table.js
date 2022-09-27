/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("locations", (table) => {
		table.increments("id").primary();
		table.string("name_location", 30).notNullable();
		table.integer("enabled").notNullable();
		table.boolean("delete").notNullable();
		table.string("url").notNullable();
		table.integer("interval_location").notNullable();
		table.timestamps(false, true);
		table.unique(["id"], "idx_id_location");
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("locations");
};
