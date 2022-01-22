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

exports.addReview = ({ owner, title, review_body, designer, category }) => {
  const query = `INSERT INTO reviews (owner, title, review_body, designer, category)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`;

  let currentRow = 0;

  return db
    .query(
      `SELECT setval('reviews_review_id_seq', (SELECT MAX(review_id) from "reviews"));`
    )
    .then(({ rows }) => {
      console.log(rows[0].setval);
      currentRow = rows[0].setval;
      return db.query(query, [owner, title, review_body, designer, category]);
    })
    .then(({ rows }) => {
      console.log(rows);
      return db.query(
        `SELECT owner, title, review_body, designer, category, reviews.review_id, reviews.votes, reviews.created_at, COUNT(comment_id)::int as comment_count FROM reviews 
      JOIN users ON reviews.owner=users.username 
      LEFT JOIN comments ON reviews.review_id=comments.review_id 
       WHERE reviews.review_id=$1
       GROUP BY reviews.review_id;`,
        [currentRow]
      );
    });
};
