
exports.seed = function(knex) {
  return knex('students')
    .truncate() 
    .then(() => {
      return knex('students').insert([
        {name: 'Hack the Gibson'},
        {name: 'Nick the NSA'}
      ]);
    });
};
