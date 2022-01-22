/** @format */

const express = require('express');
const app = express();
app.use(express.json());

const {
  handle404Errors,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./errors/errors.js');

const {
  getDevStatus,
  getCategories,
  getReview,
  getReviews,
  getReviewComments,
  getAPI,
  getUsers,
  getUser,
} = require('./controllers/getControllers.js');

const {
  patchReviewVote,
  patchCommentVote,
  patchReviewBody,
} = require('./controllers/patchControllers.js');

const { postComment } = require(`./controllers/postControllers.js`);

const { deleteComment } = require('./controllers/deleteControllers');

app.get('/api', getAPI);
app.get('/api/devStatus', getDevStatus);
app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReview);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id/comments', getReviewComments);
app.get('/api/users', getUsers);
app.get('/api/users/:username', getUser);

app.patch('/api/reviews/:review_id', patchReviewVote);
app.patch('/api/comments/:comment_id', patchCommentVote);
app.patch('/api/reviews/:review_id/body', patchReviewBody);


app.post('/api/reviews/:review_id/comments', postComment);

app.delete('/api/comments/:comment_id', deleteComment);

app.all('*', handle404Errors);
app.use(handle404Errors);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
