'use strict'

const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;
const conString = 'postgres://postgres:sql@localhost:5432';
const client = new pg.Client(conString);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.get('/tasks', (req, res) => {
  client.query(`SELECT * from tasks;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    tasks(id serial primary key, title varchar(255), description varchar(255), contact varchar(255), status varchar(255), category varchar(255), due varchar(255));
    `)
}
