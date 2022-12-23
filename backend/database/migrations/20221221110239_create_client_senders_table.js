/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("senders", (table) => {
		table.increments("id").primary();
		table.integer("id_location").unsigned().notNullable();
		table
			.foreign("id_location")
			.references("locations.id")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table.string("token", 64).notNullable();
		table.string("email").notNullable();
		table.string("status", 50).notNullable();
		table.string("phone", 20).notNullable();
		table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
		table
			.timestamp("updated_at")
			.defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
		table.unique(["id"], "idx_id_senders");
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("senders");
};
