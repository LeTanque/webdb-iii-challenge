
exports.up = function(knex) {
    return knex.schema.createTable('students', table => {
        // primary key. Called ID and make it auto increment. Method for that.
        table.increments(); // Id by default, or whatever you pass in.

        table.string('name', 128).notNullable().unique()

        table.integer('cohort_id').unsigned().references('cohort.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('students');
};

