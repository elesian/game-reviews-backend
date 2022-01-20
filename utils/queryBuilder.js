/** @format */

//Checks if query is valid

exports.queryBuilderReviews = async (query = {}) => {
  //takes a list of queries as parameters and uses these to build a complex query

  let queryStr = `SELECT owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comment_id)::int as comment_count FROM reviews 
      JOIN users ON reviews.owner=users.username 
      LEFT JOIN comments ON reviews.review_id=comments.review_id
      `;

  if (Object.keys(query).length > 0) {
    let customKeys = Object.keys(query).filter((element) => {
      //filter out sort_by and order keys of query
      if (!['sort_by', 'order'].includes(element)) {
        return element;
      }
    });

    //list of valid keys to be used for WHERE
    console.log(customKeys);

    if (
      !customKeys.every((element) => {
        return ['category'].includes(element);
      })
    ) {
      //reject if not a valid WHERE
      return Promise.reject({ status: 400, msg: 'Invalid WHERE query' });
    } else {
      let queryKeys = Object.keys(query);
      const propertyKeyValues = [];
      queryKeys.forEach((element) => {
        if (
          [
            //can be extended for additional where clauses
            'category',
          ].includes(element)
        )
          propertyKeyValues.push(element);
      });

      //build multiple WHERE clauses
      for (let i = 0; i < propertyKeyValues.length; i++) {
        if (i == 0) {
          queryStr += ` WHERE ${propertyKeyValues[i]}=$${i + 1}`;
        } else {
          queryStr += ` AND ${propertyKeyValues[i]}=$${i + 1}`;
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
          'category',
          'review_img_url',
          'created_at',
          'votes',
          'comment_count',
        ].includes(query.sort_by)
      ) {
        return Promise.reject({ status: 400, msg: 'Invalid SORT query' });
      } else queryStr += ` ORDER BY reviews.${query.sort_by}`;
    }

    if (query.order) {
      if (!['asc', 'desc'].includes(query.order)) {
        return Promise.reject({ status: 400, msg: 'Invalid ORDER query' });
      } else queryStr += ` ${query.order}`;
    } else queryStr += ` DESC`;
  } else {
    queryStr += ' GROUP BY reviews.review_id ORDER BY reviews.created_at ASC';
  }
  return (queryStr += ';');
};

//checks if query param exists

exports.hasQuery = async (query) => {
  if (Object.keys(query).length !== 0) {
    return true;
  } else return false;
};
