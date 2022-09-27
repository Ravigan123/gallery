/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("types", (table) => {
		table.increments("id").primary();
		table.string("name_type", 30).notNullable();
		table.boolean("enabled").notNullable();
		table.timestamps(false, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("types");
};
