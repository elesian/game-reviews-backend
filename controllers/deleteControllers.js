/** @format */

const { removeComment } = require('../models/deleteModels.js');

exports.deleteComment = (request, response) => {
  return removeComment(request.params).then(({ rows }) => {
    console.log({rows});
    return response.status(204).send({ delete: rows });
  });
};
