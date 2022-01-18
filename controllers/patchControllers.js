/** @format */

const { patchVote } = require('../models/patchModels.js');

exports.patchReviewVote = (request, response) => {
  return patchVote(request.params, request.body).then((rows) => {
    return response.status(200).send({ review: rows });
  });
};
