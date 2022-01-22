/** @format */

const { removeComment, removeReview} = require('../models/deleteModels.js');
const { hasPropertyValue } = require('../utils/queryBuilder.js');

exports.deleteComment = (request, response, next) => {
  return hasPropertyValue('comments', 'comment_id', request.params.comment_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'non existent comment ID' });
      } else return;
    })
    .then(() => {
      return removeComment(request.params);
    })
    .then(() => {
      return response.sendStatus(204);
    })
    .catch((err) => next(err));
};

exports.deleteReview = (request, response, next) => {
  return hasPropertyValue('reviews', 'review_id', request.params.review_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'non existent review ID' });
      } else return;
    })
    .then(() => {
      return removeReview(request.params);
    })
    .then(() => {
      return response.sendStatus(204);
    })
    .catch((err) => next(err));
};
