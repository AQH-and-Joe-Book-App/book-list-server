'use strict'

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;
const client = new pg.Client(process.env.DATABASE_URL);

client.connect();
client.on('error', err => console.error(err));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.get('/about', (req, res) => res.send('about page'));
app.get('/test', (req, res) => res.send('Testing test1, 2, 3'));

app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT * from books;`)
    .then(results => res.send(results.rows))
    .catch(console.log('app get books'));
});

app.get('/api/v1/books/:id', (req, res) => {
    client.query(`SELECT * FROM books
    WHERE book_id=${req.params.id};`)
    .then(results => res.send(results.rows))
    .catch(console.log('app get single book'));
});


app.post('/api/v1/books/', (req, res) => {
  let {title, author, isbn, image_url, description} = req.body;
    client.query(`INSERT INTO books(title, author, isbn, image_url, description)
    VALUES($1,$2,$3,$4,$5)`,[title, author, isbn, image_url, description])
    .then(results => res.sendStatus(201))
    .catch(console.error);
});

// ask about this
app.put('/api/v1/books/:id', (req, res) => {
  client.query(`
    UPDATE books
    SET title = $1, author = $2, isbn = $3, image_url = $4, description = $5
    WHERE book_id = $6;`,[req.body.title, req.body.author, req.body.isbn, req.body.image_url, req.body.description, req.params.id])
  .then(results => res.sendStatus(200))
  .catch(console.log('Update a book'));
});

// ask about this
app.delete('/api/v1/books/:id', (req, res) => {
    client.query(`DELETE FROM books WHERE book_id=${req.params.id};`)
    .then(results => res.sendStatus(204))
    .catch(console.log('deleted'));
});




app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
