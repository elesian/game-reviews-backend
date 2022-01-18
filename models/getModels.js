/** @format */

const db = require('../db/connection.js');

exports.fetchCategories = () => {
  return db.query('SELECT * FROM categories;').then(({ rows }) => rows);
};

exports.fetchReview = ({ review_id }) => {
  const query = `SELECT reviews.title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, count(comment_id)::int as comment_count FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`;

  return db.query(query, [review_id]);
};
