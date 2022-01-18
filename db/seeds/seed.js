/** @format */

const db = require('../connection.js');
const format = require('pg-format');
const { seedData } = require('../../utils/index.js');

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  //DROP ALL TABLES - IGNORE FOREIGN KEYS
  return db
    .query('DROP TABLE IF EXISTS categories, comments, reviews, users CASCADE;')
    .then(() => {
      //CREATE CATEGORIES TABLE
      return db.query(`
        CREATE TABLE categories (
          slug VARCHAR(255) PRIMARY KEY,
          description VARCHAR(255)
        );`);
    })
    .then(() => {
      //CREATE USERS TABLE
      return db.query(`
        CREATE TABLE users (
          username VARCHAR(255) PRIMARY KEY,
          avatar_url TEXT,
          name VARCHAR(255)
        );`);
    })
    .then(() => {
      //CREATE REVIEWS TABLE
      return db.query(`
        CREATE TABLE reviews (
          review_id SERIAL PRIMARY KEY,
          title VARCHAR(255),
          review_body TEXT,
          designer VARCHAR(255),
          review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          votes INT DEFAULT 0,
          category VARCHAR(255) REFERENCES categories(slug) ON DELETE SET NULL,
          owner VARCHAR(255) REFERENCES users(username) ON DELETE SET NULL,
          created_at DATE DEFAULT CURRENT_TIMESTAMP
        );`);
    })
    .then(() => {
      //CREATE COMMENTS TABLE
      return db.query(`
          CREATE TABLE comments (
            comment_id SERIAL PRIMARY KEY,
            author VARCHAR(255) REFERENCES users(username) ON DELETE SET NULL,
            review_id INT REFERENCES reviews(review_id) ON DELETE SET NULL,
            votes INT DEFAULT 0,
            created_at DATE DEFAULT CURRENT_TIMESTAMP,
            body TEXT
          );`);
    })
    .then(() => {
      //INSERT DATA INTO CATEGORIES
      let getCategoryValues = seedData.insertCategoryData(categoryData);
      const insertCategoryValues = format(
        `INSERT INTO categories
        (slug, description)
        VALUES
        %L
        RETURNING *;
        `,
        getCategoryValues
      );
      return db.query(insertCategoryValues);
    })
    .then(() => {
      //INSERT DATA INTO USERS
      let getUserValues = seedData.insertUserData(userData);
      const insertUserValues = format(
        `INSERT INTO users
        (username, avatar_url, name)
        VALUES
        %L
        RETURNING *;
        `,
        getUserValues
      );
      return db.query(insertUserValues);
    })
    .then(() => {
      //INSERT DATA INTO REVIEWS
      let getReviewValues = seedData.insertReviewData(reviewData);
      const insertReviewValues = format(
        `INSERT INTO reviews
        (review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at)
        VALUES
        %L
        RETURNING *;
        `,
        getReviewValues
      );
      return db.query(insertReviewValues);
    })
    .then(() => {
      //INSERT DATA INTO COMMENTS
      let getCommentValues = seedData.insertCommentData(commentData);
      const insertCommentValues = format(
        `INSERT INTO comments
        (comment_id, author, review_id, votes, created_at, body)
        VALUES
        %L
        RETURNING *;
        `,
        getCommentValues
      );
      return db.query(insertCommentValues);
    })
    .catch((err) => console.log(err));
};

const listOfTables = () => {
  return db
    .query(
      `SELECT *
  FROM pg_catalog.pg_tables
  WHERE schemaname != 'pg_catalog' AND 
  schemaname != 'information_schema';
  `
    )
    .then((values) => values)
    .catch((err) => err);
};

module.exports = { seed, listOfTables };
