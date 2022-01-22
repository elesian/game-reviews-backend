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
} = require('../models/getModels.js');

exports.getDevStatus = (request, response, next) => {
  const endPointData = [
    [
      'GET /api',
      'responds with a list of endpoints and their current developmental status',
      'Y',
    ],

    ['GET /api/categories', 'responds with an array of category objects', 'Y'],

    ['GET /api/reviews/:review_id', 'responds with a review object', 'Y'],

    [
      'PATCH /api/reviews/:review_id',
      'add/substract votes for a given review, responds with updated review',
      'Y',
    ],

    [
      'GET /api/reviews',
      'responds with a reviews array of review objects',
      'Y',
    ],

    [
      'GET /api/reviews/:review_id/comments',
      'responds with an array of comments for the given review_id',
      'Y',
    ],

    [
      'POST /api/reviews/:review_id/comments',
      'post a comment to a review, responds with the posted comment',
      'Y',
    ],

    [
      'DELETE /api/comments/:comment_id',
      'deletes the comment for a given comment_id',
      'Y',
    ],

    ['GET /api/users', 'responds with a list of users', 'Y'],

    ['GET /api/users/:username', 'responds with a given user object', 'Y'],

    [
      'PATCH /api/comments/:comment_id',
      'add/substract votes for a given comment',
      'Y',
    ],
  ];
  const endPoints = endPointData.map((element) => {
    return {
      endpoint: element[0],
      description: element[1],
      completed: element[2],
    };
  });

  return hasQuery(request.query)
    .then((isQuery) => {
      if (isQuery === false) {
        return response.status(200).send(endPoints);
      } else
        return Promise.reject({ status: 404, msg: 'Queries not accepted' });
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

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
