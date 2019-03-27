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

// Middleware
server.use(helmet());
server.use(express.json());


// Endpoints
// Get all cohorts
server.get('/api/cohorts', async (req, res) => {
    try {
        const cohorts = await db('cohorts');
        res.status(200).json(cohorts);
    } catch (error) {
        res.status(500).json(error);
    }
});

// list a cohort by id
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

// const errors = {
//     '19': 'Another record with that value exists',
// };

// // create roles
// server.post('/api/roles', async (req, res) => {
//     try {
//         const [id] = await db('roles').insert(req.body);

//         const role = await db('roles')
//         .where({ id })
//         .first();

//         res.status(201).json(role);
//     } catch (error) {
//         const message = errors[error.errno] || 'We ran into an error';
//         res.status(500).json({ message, error });
//     }
// });

// // update roles
// server.put('/api/roles/:id', async (req, res) => {
//     try {
//         const count = await db('roles')
//         .where({ id: req.params.id })
//         .update(req.body);

//         if (count > 0) {
//         const role = await db('roles')
//             .where({ id: req.params.id })
//             .first();

//         res.status(200).json(role);
//         } else {
//         res.status(404).json({ message: 'Records not found' });
//         }
//     } catch (error) {}
// });

// // remove roles (inactivate the role)
// server.delete('/api/roles/:id', async (req, res) => {
//     try {
//         const count = await db('roles')
//         .where({ id: req.params.id })
//         .del();

//         if (count > 0) {
//         res.status(204).end();
//         } else {
//         res.status(404).json({ message: 'Records not found' });
//         }
//     } catch (error) {}
// });
  


// Server console
server.listen(port, () =>
  console.log(`\n\n--- API running on localhost:${port} ---`)
);
