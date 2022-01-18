/** @format */

const express = require('express');
const app = express();
app.use(express.json());

const { getAPIs, getCategories, getReview } = require('./controllers/getControllers.js');

app.get('/api', getAPIs);
app.get('/api/categories', getCategories);

module.exports = app;
