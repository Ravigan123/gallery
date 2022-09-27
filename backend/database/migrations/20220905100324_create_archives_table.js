/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("archives", (table) => {
		table.increments("id").primary();
		table.integer("id_location").unsigned().notNullable();
		table
			.foreign("id_location")
			.references("locations.id")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table.integer("id_device").unsigned().notNullable();
		table
			.foreign("id_device")
			.references("devices.id")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table.integer("interval").nullable();
		table.integer("in").notNullable();
		table.integer("out").notNullable();
		table.dateTime("date_real").notNullable();
		table.dateTime("date_out").notNullable();
		table.timestamps(false, true);
		table.unique(["id"], "idx_id_archive");
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("archives");
};
