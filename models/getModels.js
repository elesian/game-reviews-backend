/** @format */

const db = require('../db/connection.js');

exports.fetchCategories = () => {
  return db.query('SELECT * FROM categories;').then(({ rows }) => rows);
};

exports.fetchReview(id) = () => {

    
}
