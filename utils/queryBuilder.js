/** @format */

const db = require('../db/connection.js');

//Checks if query is valid

exports.queryBuilderReviews = async (query = {}) => {
  //takes a list of queries as parameters and uses these to build a complex query

  let queryStr = `SELECT owner, title, reviews.review_id, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comment_id)::int as comment_count FROM reviews 
      JOIN users ON reviews.owner=users.username 
      LEFT JOIN comments ON reviews.review_id=comments.review_id
      `;

  if (Object.keys(query).length > 0) {
    const whereKeys = Object.keys(query).filter((element) => {
      //filter out sort_by and order keys of query
      if (!['sort_by', 'order'].includes(element)) {
        return element;
      }
    });

    //list of valid keys to be used for WHERE
    console.log(whereKeys);

    if (
      !whereKeys.every((element) => {
        return [
          'owner',
          'title',
          'review_id',
          'designer',
          'review_img_url',
          'category',
          'created_at',
          'votes',
          'comment_count',
        ].includes(element);
      })
    ) {
      //reject if not a valid WHERE
      return Promise.reject({ status: 400, msg: 'Invalid WHERE query' });
    } else {
      // const queryKeys = Object.keys(query);
      // const propertyKeyValues = [];
      // queryKeys.forEach((element) => {
      //   if (
      //     [
      //       //can be extended for additional where clauses
      //       'owner',
      //       'title',
      //       'review_id',
      //       'designer',
      //       'review_img_url',
      //       'category',
      //       'created_at',
      //       'votes',
      //       'comment_count',
      //     ].includes(element)
      //   )
      //     propertyKeyValues.push(element);
      // });

      //build multiple WHERE clauses
      for (let i = 0; i < whereKeys.length; i++) {
        if (i === 0) {
          queryStr += ` WHERE ${whereKeys[i]}=$${i + 1}`;
        } else {
          queryStr += ` AND ${whereKeys[i]}=$${i + 1}`;
        }
      }
    }

    //Group by required between WHERE and ORDER
    queryStr += ' GROUP BY reviews.review_id';

    if (query.sort_by) {
      if (
        ![
          'owner',
          'title',
          'review_id',
          'designer',
          'review_img_url',
          'category',
          'created_at',
          'votes',
          'comment_count',
        ].includes(query.sort_by)
      ) {
        return Promise.reject({ status: 400, msg: 'Invalid SORT query' });
      } else queryStr += ` ORDER BY reviews.${query.sort_by}`;

      if (query.order) {
        if (!['asc', 'desc'].includes(query.order)) {
          return Promise.reject({ status: 400, msg: 'Invalid ORDER query' });
        } else return (queryStr += ` ${query.order};`);
      } else return (queryStr += ` DESC;`);
    } else return (queryStr += ' ORDER BY reviews.created_at DESC;');
  }

  queryStr += ' GROUP BY reviews.review_id ORDER BY reviews.created_at DESC';
  console.log(queryStr);
  return (queryStr += ';');
};

//checks if query param exists

exports.hasQuery = async (query) => {
  if (Object.keys(query).length !== 0) {
    return true;
  } else return false;
};

exports.hasPropertyValue = async (table, property, value) => {
  console.log(table, property, value);
  let queryString = `SELECT * from ${table} WHERE ${property} = $1;`;
  return db.query(queryString, [value]);
};
