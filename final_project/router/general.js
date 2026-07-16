const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
  if (isValid(username)) return res.status(409).json({ message: 'User already exists' });
  users.push({ username, password });
  return res.json({ message: 'User successfully registered. Now you can login' });
});

public_users.get('/', (req, res) => res.type('json').send(JSON.stringify(books, null, 4)));

public_users.get('/isbn/:isbn', async (req, res) => {
  const book = await Promise.resolve(books[req.params.isbn]);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.send(book);
});

public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  const matches = await Promise.resolve(Object.values(books).filter((book) => book.author.toLowerCase() === author));
  return res.json(matches);
});

public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  const matches = await Promise.resolve(Object.values(books).filter((book) => book.title.toLowerCase() === title));
  return res.json(matches);
});

public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.json(book.reviews);
});

module.exports.general = public_users;

// Task 10: Get all books using async callback function
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error in getAllBooks:', error.message);
  }
}

// Task 11: Search by ISBN using Promises
function getBookByISBN(isbn) {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    })
    .catch((error) => {
      console.error('Error in getBookByISBN:', error.message);
    });
}

// Task 12: Search by Author using async/await
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error in getBooksByAuthor:', error.message);
  }
}

// Task 13: Search by Title using Promises
function getBooksByTitle(title) {
  return axios.get(`http://localhost:5000/title/${title}`)
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    })
    .catch((error) => {
      console.error('Error in getBooksByTitle:', error.message);
    });
}

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
