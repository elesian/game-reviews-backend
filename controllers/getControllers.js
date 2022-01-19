/** @format */

const {
  fetchCategories,
  fetchReview,
  fetchReviews,
  fetchReviewComments,
} = require('../models/getModels.js');

exports.getAPIs = (request, response) => {
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
      'N',
    ],

    [
      'GET /api/reviews/:review_id/comments',
      'responds with an array of comments for the given review_id',
      'N',
    ],

    [
      'POST /api/reviews/:review_id/comments',
      'post a comment to a review, responds with the posted comment',
      'N',
    ],

    [
      'DELETE /api/comments/:comment_id',
      'deletes the comment for a given comment_id',
      'N',
    ],

    ['GET /api/users', 'responds with a list of users', 'N'],

    ['GET /api/users/:username', 'responds with a given user object', 'N'],

    [
      'PATCH /api/comments/:comment_id',
      'add/substract votes for a given comment',
      'N',
    ],
  ];
  const endPoints = endPointData.map((element) => {
    return {
      endpoint: element[0],
      description: element[1],
      completed: element[2],
    };
  });

  return response.status(200).send(endPoints);
};

exports.getCategories = (request, response) => {
  return fetchCategories()
    .then((values) => {
      return response.status(200).send({ categories: values });
    })
    .catch((err) => console.log(err));
};

exports.getReview = (request, response) => {
  return fetchReview(request.params)
    .then(({ rows }) => {
      return response.status(200).send({ review: rows });
    })
    .catch((err) => console.log(err));
};

exports.getReviews = (request, response) => {
  return fetchReviews(request.query)
    .then(({ rows }) => {
      if (rows.length) {
        console.log(rows.length);
        return response.status(200).send({ reviews: rows });
      } else return Promise.reject('404 content not found');
    })
    .catch((err) => {
      return response.status(404).send(err);
    });
};

exports.getReviewComments = (request, response) => {
  return fetchReviewComments(request.params)
    .then(({ rows }) => {
      return response.status(200).send({ comments: rows });
    })
    .catch((err) => console.log(err));
};
