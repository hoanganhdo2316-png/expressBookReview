const express = require('express');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

app.use('/customer', session({
  secret: 'fingerprint_customer',
  resave: true,
  saveUninitialized: true,
}));

app.use('/customer/auth', (req, res, next) => {
  if (!req.session.authorization) return res.status(403).json({ message: 'User is not logged in' });
  return next();
});

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(5000, () => console.log('Server is running'));
