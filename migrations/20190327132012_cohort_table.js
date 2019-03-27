// What new changes we need to make
exports.up = function(knex) {
    return knex.schema.createTable('cohort', tbl => {
        // primary key. Called ID and make it auto increment. Method for that.
        tbl.increments('id'); // Id by default, or whatever you pass in.
        tbl.string('name', 128).notNullable().unique()
    })
};


// how to undo the changes made in the up function
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('cohort')
};


