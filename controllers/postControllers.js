/** @format */

const { addComment } = require(`../models/postModels.js`);
const { hasPropertyValue } = require('../utils/queryBuilder.js');

exports.postComment = (request, response, next) => {
  const userNameExists = () => {
    return hasPropertyValue(`users`, `username`, request.body.username);
  };

  return userNameExists()
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: '404 - user does not exist',
        });
      } else return;
    })
    .then(() => {
      return addComment(request.params, request.body).then(({ rows }) => {
        if (rows !== 0) {
          return response.status(201).send({ comment: rows });
        } else return Promise.reject({ status: 404, msg: '404 - Not Found' });
      });
    })
    .catch((err) => next(err));
};
