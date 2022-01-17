/** @format */
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

const request = require('supertest');
const app = require('../app.js');
//test that returned queries are sorted by a given field
require('jest-sorted');

beforeEach(() => seed(testData));
afterAll(() => db.end());

// Would prefer to test this for each stage of the seeding creation
// however, the output of the seeded tables will suffice

describe('Seeding database', () => {
  test('TABLES categories, reviews, users, comments EXIST in nc_games_test DB', () => {
    return seed(testData).then(({ rows }) => {
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
