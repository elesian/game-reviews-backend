/** @format */
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const { seed, listOfTables } = require('../db/seeds/seed.js');

const request = require('supertest');
const app = require('../app.js');
const { response } = require('express');
//test that returned queries are sorted by a given field
require('jest-sorted');

beforeEach(() => seed(testData));
afterAll(() => db.end());

// Would prefer to test this for each stage of the seeding creation
// however, the output of the seeded tables will suffice

describe('Seeding database', () => {
  test('TABLES categories, reviews, users, comments EXIST in nc_games_test DB', () => {
    return seed(testData)
      .then(() => {
        return listOfTables();
      })
      .then(({ rows }) => {
        expect(
          rows.every((element) => {
            return ['categories', 'reviews', 'users', 'comments'].includes(
              element.tablename
            );
          })
        ).toEqual(true);
        expect(rows.length).toEqual(4);
        expect(process.env.PGDATABASE).toEqual('nc_games_test');
      });
  });
});

describe('GET', () => {
  describe('/api returns with a list of endpoints', () => {
    test('should return an object', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          expect(typeof body).toEqual('object');
          expect(body[0].completed).toEqual('Y');
          expect(body.length).toEqual(11);
          body.every((element) =>
            expect(element).toEqual(
              expect.objectContaining({
                endpoint: expect.any(String),
                description: expect.any(String),
                completed: expect.any(String),
              })
            )
          );
        });
    });
  });
  describe('/api/categories', () => {
    test('should return an object containing a list of categories', () => {
      return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          expect(typeof body).toEqual('object');
          expect(Object.keys(body)[0]).toEqual('categories');
          body.categories.every((element) =>
            expect(element).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            )
          );
        });
    });
  });
  describe('/api/reviews/:review_id', () => {
    test('should return a review object ', () => {

    });
  });

});
