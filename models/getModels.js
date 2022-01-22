/** @format */

const { query_timeout } = require('pg/lib/defaults');
const db = require('../db/connection.js');
const categories = require('../db/data/test-data/categories.js');
const { queryBuilderReviews } = require('../utils/queryBuilder.js');

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

exports.fetchReviews = (query) => {
  //Build a list of queries that are not sort_by/order

  let columns = [];
  Object.keys(query).forEach((element) => {
    if (!['sort_by', 'order', 'limit', 'p'].includes(element)) {
      columns.push(query[`${element}`]);
    }
  });

  //sql injection protection
  return queryBuilderReviews(query).then((values) => {
    console.log(values);
    const regex = /\$/gi;
    const dynamicParameters = values.match(regex);
    let numDynamicParameters = 0;
    if (dynamicParameters !== null) {
      numDynamicParameters = dynamicParameters.length;
    }

    console.log(numDynamicParameters);

    //default limit = 10, offset = 0
    let limit = 100;
    let offset = 0;

    if (query.limit && query.p) {
      (limit = query.limit), (offset = query.limit * (query.p - 1));
    } else if (query.limit) {
      limit = query.limit;
    } else if (query.p) {
      offset = 10 * (query.p - 1);
    }

    return db.query(
      `${values} LIMIT $${numDynamicParameters + 1} OFFSET $${
        numDynamicParameters + 2
      };`,
      [...columns, limit, offset]
    );
  });
};

exports.fetchReviewComments = ({ review_id }, { limit = 10, p = 1 }) => {
  const currentRow = (p - 1) * limit;
  console.log(limit, p);

  const query = `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments 
  LEFT JOIN reviews ON comments.review_id = reviews.review_id
  WHERE reviews.review_id = $1 ORDER BY reviews.review_id desc
  LIMIT $2 OFFSET $3;`;

  return db.query(query, [review_id, limit, currentRow]);
};
