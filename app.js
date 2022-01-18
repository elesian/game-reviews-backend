/** @format */

const express = require('express');
const app = express();
app.use(express.json());

const { getAPIs, getCategories, getReview } = require('./controllers/getControllers.js');
const { patchReviewVote } = require('./controllers/patchControllers.js');
app.get('/api', getAPIs);
app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReview)
app.patch('/api/reviews/:review_id', patchReviewVote)

module.exports = app