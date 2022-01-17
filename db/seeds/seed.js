/** @format */

const db = require('../connection.js');

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  //DROP ALL TABLES - IGNORE FOREIGN KEYS
  return (
    db
      .query(
        'DROP TABLE IF EXISTS categories, comments, reviews, users CASCADE;'
      )
      // .then(() => {
      //   //CREATE CATEGORIES TABLE
      //   return db.query('CREATE TABLES categories ();');
      // })
      .then((result) => result)
      .catch((err) => console.log(err))
  );
};

module.exports = seed;
