const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');
const regd_users = express.Router();
const users = [];

const isValid = (username) => users.some((user) => user.username === username);
const authenticatedUser = (username, password) => users.some(
  (user) => user.username === username && user.password === password
);

regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!authenticatedUser(username, password)) return res.status(401).json({ message: 'Invalid login credentials' });
  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });
  req.session.authorization = { accessToken, username };
  return res.json({ message: 'User successfully logged in' });
});

regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  if (!books[isbn]) return res.status(404).json({ message: 'Book not found' });
  const username = req.session.authorization.username;
  books[isbn].reviews[username] = req.query.review;
  return res.json({ message: `The review for the book with ISBN ${isbn} has been added/updated` });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  if (!books[isbn]) return res.status(404).json({ message: 'Book not found' });
  const username = req.session.authorization.username;
  delete books[isbn].reviews[username];
  return res.json({ message: `The review for the book with ISBN ${isbn} has been deleted` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
