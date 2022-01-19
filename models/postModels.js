/** @format */

const db = require('../db/connection.js');

exports.addComment = ({ review_id }, body) => {
  console.log(review_id, body);
};
