/** @format */

const express = require('express');
const app = express();
app.use(express.json());

const {
  getDevStatus,
  getCategories,
  getReview,
  getReviews,
  getReviewComments,
  getAPI,
} = require('./controllers/getControllers.js');

const { patchReviewVote } = require('./controllers/patchControllers.js');

const { postComment } = require(`./controllers/postControllers.js`);

const { deleteComment } = require('./controllers/deleteControllers');

app.get('/api', getAPI)
app.get('/api/developmentStatus', getDevStatus);
app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReview);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id/comments', getReviewComments);

app.patch('/api/reviews/:review_id', patchReviewVote);

app.post('/api/reviews/:review_id/comments', postComment);

app.delete('/api/comments/:comment_id', deleteComment);

module.exports = app;
