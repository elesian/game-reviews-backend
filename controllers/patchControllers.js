/** @format */

const { updateReviewVote, updateCommentVote } = require('../models/patchModels.js');

exports.patchReviewVote = (request, response, next) => {
  return updateReviewVote(request.params, request.body)
    .then(({ rows }) => {
      if (rows.length > 0) {
        return response.status(200).send({ review: rows[0] });
      } else return Promise.reject({ status: 404, msg: '404 - Not Found' });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentVote = (request, response, next) => {
  return updateCommentVote(request.params, request.body)
    .then(({ rows }) => {
      if (rows.length > 0) {
        return response.status(200).send({ comment: rows[0] });
      } else return Promise.reject({ status: 404, msg: '404 - Not Found' });
    })
    .catch((err) => {
      next(err);
    });
};
