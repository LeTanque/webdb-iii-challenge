
exports.seed = function(knex) {
  // Deletes all existing entries
  // return knex('table_name').del()
  return knex('cohort')
    .truncate() // resets the primary key in addition to cleaning the table
    .then(function() {
      // Inserts seed entries
      return knex('cohort').insert([
        { name: 'WEB3' },
        { name: 'WEBPT4' },
        { name: 'WEB17' },
      ]);
    });
};
