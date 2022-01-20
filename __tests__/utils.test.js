/** @format */

const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const { seedData, queryBuilder } = require('../utils/index.js');
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require('../db/data/test-data/index.js');
const { seed } = require('../db/seeds/seed.js');
const app = require('../app.js');
beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('INSERT Data into CATEGORIES TABLE', () => {
  test('should return an array', () => {
    let inserted = seedData.insertCategoryData(categoryData);
    expect(typeof inserted).toEqual('object');
  });
  test('should not mutate the original array', () => {
    let inserted = seedData.insertCategoryData(categoryData);
    expect(inserted).not.toBe(categoryData);
  });
  test('should return an object of length 3', () => {
    let inserted = seedData.insertCategoryData(categoryData);
    expect(inserted.length).toEqual(4);
  });
  test('should contain two elements in each array', () => {
    let inserted = seedData.insertCategoryData(categoryData);
    expect(inserted.every((element) => element.length === 2)).toEqual(true);
  });
});

describe('INSERT data into USERS TABLE', () => {
  test('should return an array', () => {
    let inserted = seedData.insertUserData(userData);
    expect(typeof inserted).toEqual('object');
  });
  test('should not mutate the original array', () => {
    let inserted = seedData.insertUserData(userData);
    expect(inserted).not.toBe(userData);
  });
  test('should return an object of length 4', () => {
    let inserted = seedData.insertUserData(userData);
    expect(inserted.length).toEqual(4);
  });
  test('should contain three elements in each array', () => {
    let inserted = seedData.insertUserData(userData);
    expect(inserted.every((element) => element.length === 3)).toEqual(true);
  });
});

describe('INSERT data into REVIEWS table', () => {
  test('should return an array', () => {
    let inserted = seedData.insertReviewData(reviewData);
    expect(typeof inserted).toEqual('object');
  });
  test('should not mutate the original array', () => {
    let inserted = seedData.insertReviewData(reviewData);
    expect(inserted).not.toBe(reviewData);
  });
  test('should return an object of length 13', () => {
    let inserted = seedData.insertReviewData(reviewData);
    expect(inserted.length).toEqual(13);
  });
  test('should contain three elements in each array', () => {
    let inserted = seedData.insertReviewData(reviewData);
    expect(inserted.every((element) => element.length === 9)).toEqual(true);
  });
});

describe('INSERT data into comments table', () => {
  test('should return an array', () => {
    let inserted = seedData.insertCommentData(commentData);
    expect(typeof inserted).toEqual('object');
  });
  test('should not mutate the original array', () => {
    let inserted = seedData.insertCommentData(commentData);
    expect(inserted).not.toBe(reviewData);
  });
  test('should return an object of length 13', () => {
    let inserted = seedData.insertCommentData(commentData);
    expect(inserted.length).toEqual(6);
  });
  test('should contain three elements in each array', () => {
    let inserted = seedData.insertCommentData(commentData);
    expect(inserted.every((element) => element.length === 6)).toEqual(true);
  });
});

describe('QUERY BUILDER', () => {
  test('should return a string', () => {
    return queryBuilder.queryBuilderReviews().then((string) => {
      console.log(string);
      expect(typeof string).toEqual('string');
    });
  });
  test('should return a valid sql query', () => {
    return queryBuilder.queryBuilderReviews().then((string) => {
      expect(string)
        .toEqual(`SELECT owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comment_id)::int as comment_count FROM reviews 
      JOIN users ON reviews.owner=users.username 
      LEFT JOIN comments ON reviews.review_id=comments.review_id 
      GROUP BY reviews.review_id
       ORDER BY reviews.created_at ASC;`);
    });
  });
  test('should reject invalid WHERE clause', () => {
    return queryBuilder
      .queryBuilderReviews({ invalid: 'invalid' })
      .catch(({ msg }) => expect(msg).toEqual('Invalid WHERE query'));
  });
  test('should accept a valid WHERE clause (category)', () => {
    return queryBuilder
      .queryBuilderReviews({ category: 'test' })
      .then((string) => {
        console.log(string);
        expect(string.includes('WHERE category=$1')).toEqual(true);
      });
  });
  test('should be able to sort by any valid column', () => {
    return queryBuilder
      .queryBuilderReviews({ sort_by: 'category' })
      .then((string) => {
        console.log(string);
        expect(string.includes('ORDER BY reviews.category DESC')).toEqual(true);
      });
  });
  test('should 400 on an invalid column', () => {
    return queryBuilder
      .queryBuilderReviews({ sort_by: 'invalid' })
      .catch(({ status }) => {
        expect(status).toEqual(400);
      });
  });
  test('should accept ordering', () => {
    return queryBuilder
      .queryBuilderReviews({ sort_by: 'category', order: 'asc' })
      .then((string) => {
        let lowerCase = string.toLowerCase();
        expect(lowerCase.includes('order by reviews.category asc')).toEqual(
          true
        );
      });
  });
  test('should accept complex queries', () => {
    return queryBuilder
      .queryBuilderReviews({
        sort_by: 'title',
        order: 'asc',
        category: 'test',
      })
      .then((string) => {
        let lowerCase = string.toLowerCase();
        expect(lowerCase.includes('order by reviews.votes asc')).toEqual(true);
        expect(lowerCase.includes('where category=$1')).toEqual(true);
      });
  });
});

describe('Category Validator', () => {
  test.only('should return an object', () => {
    return queryBuilder.hasCategory('dexterity').then(({ rows }) => {
      console.log(rows);
      expect(typeof rows).toEqual('object');
      expect(rows.length).toEqual(1);
    });
  });
  test.only('should return zero rows for an invalid category', () => {
    return queryBuilder.hasCategory('INVALID').then(({ rows }) => {
      console.log(rows);
      expect(typeof rows).toEqual('object');
      expect(rows.length).toEqual(0);
    });
  });
  test.only('should return 1 rows for a valid category', () => {
    return queryBuilder.hasCategory('social deduction').then(({ rows }) => {
      console.log(rows);
      expect(typeof rows).toEqual('object');
      expect(rows.length).toEqual(1);
    });
  });
});
