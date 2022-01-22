/** @format */

const db = require('../db/connection.js');

exports.removeComment = ({ comment_id }) => {
  const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;
  return db.query(query, [comment_id]);
};

exports.removeReview = ({ review_id }) => {
  const query = `DELETE FROM reviews WHERE review_id = $1 RETURNING *;`;
  return db.query(query, [review_id]);
};
