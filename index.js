// Manage Roles (id, name)
const express = require('express');
const helmet = require('helmet');
const knex = require('knex');


// yarn knex init                        // creates config file empty
// yarn knex migrate:make roles_table    // makes a table called roles
// yarn knex migrate:latest              // creates latest migration
// yarn knex migrate:rollback            //
// Knex configuration. Then, assign it to 'db', invoking the config through knex
const knexConfig = {
    client: 'sqlite3',
    connection: {
      filename: './data/lambda.sqlite3',
    },
    useNullAsDefault: true,     // needed for sqlite
    debug: true,                // Useful for development
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
