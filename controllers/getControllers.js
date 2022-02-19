/** @format */

const fs = require('fs').promises;
const { hasQuery, hasPropertyValue } = require('../utils/queryBuilder');

const {
  fetchCategories,
  fetchReview,
  fetchReviews,
  fetchReviewComments,
  fetchUsers,
  fetchUser,
  returnReview,
} = require('../models/getModels.js');

exports.getCategories = (request, response) => {
  return fetchCategories()
    .then((values) => {
      return response.status(200).send({ categories: values });
    })
    .catch((err) => console.log(err));
};

exports.getReview = (request, response, next) => {
  return fetchReview(request.params)
    .then(({ rows }) => {
      if (rows.length !== 0) {
        return response.status(200).send({ review: rows });
      } else return Promise.reject({ status: 404, msg: '404 - Not Found' });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (request, response, next) => {
  const categoryExists = () =>
    hasPropertyValue('categories', 'slug', request.query.category);
  let categoryRows = 0;

  return categoryExists()
    .then(({ rows }) => {
      if (request.query.category && rows.length === 0) {
        return Promise.reject({ status: 404, msg: '404 - Invalid Category' });
      } else categoryRows = rows.length;
    })
    .then(() => {
      return fetchReviews(request.query);
    })
    .then(({ rows, totalCount }) => {
      if (
        rows.length === 0 &&
        (request.query.hasOwnProperty('limit') ||
          request.query.hasOwnProperty('p')) &&
        categoryRows !== 0
      ) {
        return response.status(200).send({ reviews: rows, count: totalCount });
      } else if (rows.length === 0 && categoryRows !== 0) {
        return response.status(200).send({ reviews: rows });
      } else if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: '404 - No reviews found' });
      } else return response.status(200).send({ reviews: rows });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewComments = (request, response, next) => {
  const IdExists = () =>
    hasPropertyValue('reviews', 'review_id', request.params.review_id);
  let idRows = 0;

  return IdExists()
    .then(({ rows }) => {
      idRows = rows.length;
    })
    .then(() => {
      if (idRows === 0) {
        return Promise.reject({ status: 404, msg: 'review_ID does not exist' });
      } else return fetchReviewComments(request.params, request.query);
    })
    .then(({ rows }) => {
      console.log(rows);
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'No comments found',
        });
      }
      return response.status(200).send({ comments: rows });
    })

    .catch((err) => {
      next(err);
    });
};

exports.getAPI = (request, response, next) => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, 'utf-8')
    .then((values) => {
      console.log(JSON.parse(values));
      return response.status(200).send({ api: JSON.parse(values) });
    });
};

exports.getUsers = (request, response, next) => {
  return fetchUsers()
    .then(({ rows }) => {
      return response.status(200).send({ users: rows });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUser = (request, response, next) => {
  return hasPropertyValue('users', 'username', request.params.username)
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: 'username not found' });
      } else return;
    })
    .then(() => {
      console.log(request.params);
      return fetchUser(request.params);
    })
    .then(({ rows }) => {
      console.log(rows);
      return response.status(200).send({ user: rows });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewByTitle = (request, response, next) => {
  return returnReview(request.params)
    .then(({ rows }) => {
      if (rows.length !== 0) {
        return response.status(200).send({ review: rows });
      } else return Promise.reject({ status: 404, msg: '404 - Not Found' });
    })
    .catch((err) => {
      next(err);
    });
};
