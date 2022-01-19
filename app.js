/** @format */

const express = require('express');
const app = express();
app.use(express.json());

const {
  getAPIs,
  getCategories,
  getReview,
  getReviews,
  getReviewComments,
} = require('./controllers/getControllers.js');

const { patchReviewVote } = require('./controllers/patchControllers.js');

const { postComment } = require(`./controllers/postControllers.js`)

app.get('/api', getAPIs);
app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReview);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id/comments', getReviewComments)

app.patch('/api/reviews/:review_id', patchReviewVote);

app.post('/api/reviews/:review_id/comments', postComment)

module.exports = app;
