/** @format */

const db = require('../db/connection.js');

exports.patchVote = ({ review_id }, { inc_votes }) => {
  const patchQuery = `
    UPDATE reviews SET votes = votes + $1 WHERE reviews.review_id = $2
    RETURNING *;`;
  return db.query(patchQuery, [inc_votes, review_id]).then(({ rows }) => rows);
};
