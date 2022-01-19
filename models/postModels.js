/** @format */

const db = require('../db/connection.js');

exports.addComment = ({ review_id }, { username, body }) => {
  const query = `INSERT INTO comments (author, body, review_id)
    VALUES ($1, $2, $3)
    RETURNING *;`;

  return db
    .query(
      `SELECT setval('comments_comment_id_seq', (SELECT MAX(comment_id) from "comments"));`
    )
    .then(({ rows }) => {
      console.log('Current serial value for comments_id: ' + rows[0].setval);
      return db.query(query, [username, body, review_id]);
    });
};
