var express = require('express');
var jwt = require('express-jwt');
var authConfig = require('../config/authConfig');

//require controllers
var userController = require('../users/userController.js');
var productController = require('../products/productController.js');
var stripeController = require('../stripe/stripeController');
var transactionController = require('../transactions/transactionController');

var authCheck = jwt({
  secret: new Buffer(authConfig.secret, 'base64'),
  audience: authConfig.clientId
});

//deployment
// var authCheck = jwt({
//   secret: new Buffer(process.env.authSecret, 'base64'),
//   audience: process.env.authClientID
// });

module.exports = function(app, express) {
  // NOTE: To protect a route, simply pass authCheck as the middle argument for a request route.
  // E.g. app.get('/api/someroute', authCheck, controller.method);

  //User routes
  app.get('/api/users', userController.getAllUsers);
  app.get('/api/users/:id', userController.getUserById);
  app.post('/api/users', userController.createUser);
  app.put('/api/users/:id', userController.updateUser);

  //Product routes
  app.get('/api/products', productController.getProducts);
  app.get('/api/products/byuser/:id', productController.getProductsByUser);
  app.get('/api/products/search', productController.getProducts);
  app.get('/api/products/:id', productController.getProductById);
  // app.get('/api/products/images/:id', productController.getImages);
  app.post('/api/products', productController.createProduct);
  app.put('/api/products/:id', productController.updateProduct);
  // app.delete('/api/products/:id', productController.deleteProduct);

  //Review routes
  // app.get('/api/reviews', productController.getReviews);
  app.get('/api/reviews/:id', productController.getReviewByProductId);
  app.post('/api/reviews', productController.createReview);
  app.post('/api/reviews/:id', productController.deleteReview);
  app.put('/api/reviews', productController.updateReview);

  //Transaction routes
  app.get('/api/transactions/seller/:id', transactionController.getTransactionsBySellerId);
  app.get('/api/transactions/buyer/:id', transactionController.getRentalsByBuyerId);
  app.get('/api/transactions/:id', transactionController.getInvalidDays);
  app.get('/api/transactions/active/all', transactionController.getActiveTransactions);
  app.put('/api/transactions/:id', transactionController.updateTransaction);

  // Stripe routes
  app.get('/connect', stripeController.getCode);
  app.post('/api/charge', stripeController.createCharge);

};





