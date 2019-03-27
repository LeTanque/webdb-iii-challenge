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
// yarn knex migrate:rollback                   // Rollback migration
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








// Server console
server.listen(port, () =>
  console.log(`\n\n--- API running on localhost:${port} ---`)
);
