/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("data", (table) => {
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
		table.integer("in").notNullable();
		table.integer("out").notNullable();
		table.integer("hour").notNullable();
		table.integer("status").notNullable();
		table.string("description", 100).nullable();
		table.date("date_real").notNullable();
		table.dateTime("date_out");
		table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
		table
			.timestamp("updated_at")
			.defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
		table.unique(["id"], "idx_id_data");
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("data");
};
