/** @format */

const { addComment, addReview } = require(`../models/postModels.js`);
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

exports.postReview = (request, response, next) => {
  const doesUserExist = () =>
    hasPropertyValue('users', 'username', request.body.owner);

  const doesCategoryExist = () =>
    hasPropertyValue('categories', 'slug', request.body.category);

  return doesUserExist()
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 400,
          msg: 'username invalid',
        });
      }
    })
    .then(() => {
      return doesCategoryExist();
    })
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 400,
          msg: 'category invalid',
        });
      }
    })
    .then(() => {
      return addReview(request.body);
    })
    .then(({ rows }) => {
      return response.status(201).send({ review: rows });
    })
    .catch((err) => next(err));
};
