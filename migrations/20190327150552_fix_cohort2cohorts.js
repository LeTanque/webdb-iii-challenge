
exports.up = function(knex) {
    return knex.schema.renameTable('cohort', 'cohorts');
};
  
exports.down = function(knex) {
    return knex.schema.renameTable('cohorts', 'cohort');
};