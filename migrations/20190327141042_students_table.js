
exports.up = function(knex) {
    return knex.schema.createTable('students', tbl => {
        // primary key. Called ID and make it auto increment. Method for that.
        tbl.increments(); // Id by default, or whatever you pass in.

        tbl
        .string('name', 128)
        .notNullable()
        .unique()

        // tbl.unique('name')  
        tbl
        .integer('cohort_id')
        .unsigned()
        .references('id')
        .inTable('cohort')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('students');
};



