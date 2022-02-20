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
  getCategories,
  getReview,
  getReviews,
  getReviewComments,
  getAPI,
  getUsers,
  getUser,
  getReviewByTitle,
} = require('./controllers/getControllers.js');

const {
  patchReviewVote,
  patchCommentVote,
  patchReviewBody,
  patchCommentBody,
} = require('./controllers/patchControllers.js');

const { postComment, postReview } = require(`./controllers/postControllers.js`);

const {
  deleteComment,
  deleteReview,
} = require('./controllers/deleteControllers');

app.get('/', (request, response) => {
  return response.status(200).send({
    Instructions:
      'Please add /api to the home URL for a description of implemented API end-points. A suitable JSON viewer, such as -JSON Viewer-, is recommended for accessible JSON string viewing',
  });
});

app.get('/api', getAPI);
app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReview);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id/comments', getReviewComments);
app.get('/api/users', getUsers);
app.get('/api/users/:username', getUser);
app.get('/api/review/:title', getReviewByTitle);

app.patch('/api/reviews/:review_id/vote', patchReviewVote);
app.patch('/api/reviews/:review_id/body', patchReviewBody);
app.patch('/api/comments/:comment_id/vote', patchCommentVote);
app.patch('/api/comments/:comment_id/body', patchCommentBody);

app.post('/api/reviews/:review_id/comment', postComment);
app.post('/api/reviews/review', postReview);

app.delete('/api/comments/:comment_id', deleteComment);
app.delete('/api/reviews/:review_id', deleteReview);

app.all('*', handle404Errors);
app.use(handle404Errors);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
