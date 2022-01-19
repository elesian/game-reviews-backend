/** @format */

const { addComment } = require(`../models/postModels.js`);

exports.postComment = (request, response) => {
  return addComment(request.params, request.body).then(({ rows }) => {
    return response.status(201).send({ comment: rows });
  });
};
