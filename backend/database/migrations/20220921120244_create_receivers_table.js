/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("receivers", (table) => {
		table.increments("id").primary();
		table.string("name_receiver", 30).notNullable();
		table.string("type_receiver").notNullable();
		table.string("address").notNullable();
		table.string("addition");
		table.timestamps(false, true);
		table.unique(["id"], "idx_id_receiver");
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("receivers");
};
