/** @format */

const db = require('../db/connection.js');

exports.updateReviewVote = ({ review_id }, { inc_votes = 0 }) => {
  const patchQuery = `
    UPDATE reviews SET votes = votes + $1 WHERE reviews.review_id = $2
    RETURNING *;`;
  return db.query(patchQuery, [inc_votes, review_id]);
};

exports.updateCommentVote = ({ comment_id }, { inc_votes = 0 }) => {
  const patchQuery = `
  UPDATE comments SET votes = votes + $1 WHERE comments.comment_id = $2
  RETURNING *;`;
return db.query(patchQuery, [inc_votes, comment_id]);
};

