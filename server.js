'use strict'

const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;
const client = new pg.Client(process.env.DATABASE_URL);

client.connect();
client.on('error', err => console.error(err));
app.use(cors());
app.get('/', (req, res) => res.send('Testing 1, 2, 3'));



app.get('/about', (req, res) => res.send('about page'));


app.get('/test', (req, res) => res.send('Testing test1, 2, 3'));

app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT * from books;`)
    .then(results => res.send(results.rows))
    .catch(console.log('changes'));
});

app.get('/api/v1/books/:id', (req, res) => {
    client.query(`SELECT * FROM books
    WHERE book_id=$1;`,[1])
    .then(results => res.send(results.rows))
    .catch(console.log('changes'));

});








app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    book(id serial primary key, title varchar(255), description varchar(255), author varchar(255), image_url varchar(255));
    `)
}
