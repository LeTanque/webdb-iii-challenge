// Manage Roles (id, name)
const express = require('express');
const helmet = require('helmet');
const knex = require('knex');


// Knex CLI commands
// knex is not installed globally so all commands are prepended with yarn or npx
//
// Migrations allow for you to define sets of schema changes so upgrading a database is a breeze.
// yarn knex init                               // creates config file empty
// yarn knex migrate:make roles_table           // makes a migration roles_table
// yarn knex migrate:latest                     // updates to latest migration
// yarn knex migrate:rollback                   // Rollback migration. rollback will revert to most recent batch. 
// yarn knex migrate:make fix_roles_latinName   // makes a migration called fix_roles_latinName
//
// Seed files allow you to populate your database with test or seed data independent of your migration files.
// yarn knex seed:make seed_name                // makes a seed file called seed_name
// yarn knex seed:run                           // Runs seed files, populates you db with seed data


// Knex configuration. Then, assign it to 'db', invoking the config through knex
const knexConfig = {
    client: 'sqlite3',
    connection: {
      filename: './data/lambda.sqlite3',
    },
    useNullAsDefault: true,             // needed for sqlite
    debug: true,                        // Useful for development
};
const db = knex(knexConfig);

// Variables
const port = process.env.PORT || 5000;
const server = express();
const errors = { // Dynamic messaging based on sqlite codes
    '1': 'We ran into an error.',
    '4': 'Operation aborted',
    '9': 'Operation aborted',
    '19': 'Another record with that value exists, yo!'
};

// Middleware
server.use(helmet());
server.use(express.json());


// Endpoints
// GET all cohorts
server.get('/api/cohorts', async (req, res) => {
    try {
        const cohorts = await db('cohorts');
        res.status(200).json(cohorts);
    } catch (error) {
        res.status(500).json(error);
    }
});


// GET a cohort by id
server.get('/api/cohorts/:id', async (req, res) => {
    try {
        const cohort = await db('cohorts')
            .where({ id: req.params.id })
            .first();
        res.status(200).json(cohort);
    } catch (error) {
        res.status(500).json(error);
    }
});


// GET students in cohort by cohort ID
server.get('/api/cohorts/:id/students', async (req, res) => {
    try {
        const cohortStudents = await db('cohorts')
            .innerJoin('students', `cohorts.id`, 'students.cohort_id')
            .where('students.id', req.params.id)
        if (cohortStudents.length < 1) {
            return res.status(404).json({ message:"No students in given cohort" })
        }
        res.status(200).json(cohortStudents)
    } catch (error) {
        res.status(500).json(error)
    }
});


// POST create new cohort. Name is required.
server.post('/api/cohorts', async (req, res) => {
    if (!req.body.name) { return res.status(400).json({ message:"Please include a name to create a new cohort" })}
    try {
        const [id] = await db('cohorts').insert(req.body);
        const cohort = await db('cohorts')
            .where({ id })
            .first();
        res.status(201).json(cohort);
    } catch (error) {
        const message = errors[error.errno] || 'We ran into an error';
        res.status(500).json({ message });
    }
});


// PUT update without name param
server.put('/api/cohorts', async (req, res) => {
    res.status(400).json({ message:"Please include cohort ID to update" })
})


// PUT update cohort. body name required. Must be unique req.body.name
server.put('/api/cohorts/:id', async (req, res) => {
    if (!req.body.name) { return res.status(400).json({ message:"Please include a name to update a cohort" })}
    try {
        const count = await db('cohorts')
            .where({ id: req.params.id })
            .update(req.body);
        if (count > 0) {
            const cohort = await db('cohorts')
                .where({ id: req.params.id })
                .first();
            res.status(200).json(cohort);
        } else {
            res.status(404).json({ message: 'Records not found' });
        }
    } catch (error) {
        const message = errors[error.errno] || 'We ran into an error';
        res.status(500).json({ message });
    }
});


// DELETE remove cohort
server.delete('/api/cohorts/:id', async (req, res) => {
    try {
        const count = await db('cohorts')
            .where({ id: req.params.id })
            .del();
        if (count > 0) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Cohort not found' });
        }
    } catch (error) {
        const message = errors[error.errno] || 'We ran into an error';
        res.status(500).json({ message });
    }
});
  


// Server console
server.listen(port, () =>
  console.log(`\n\n--- API running on localhost:${port} ---`)
);
