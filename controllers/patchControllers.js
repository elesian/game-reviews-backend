/** @format */

const { patchVote } = require('../models/patchModels.js');

exports.patchReviewVote = (request, response, next) => {
  return patchVote(request.params, request.body)
    .then(({ rows }) => {
      if (rows.length > 0) {
        return response.status(200).send({ review: rows[0] });
      } else return Promise.reject({ status: 404, msg: '404 - Not Found' });
    })
    .catch((err) => {
      next(err);
    });
};
