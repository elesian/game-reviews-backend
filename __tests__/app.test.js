/** @format */
const db = require('../db/connection.js');
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

const request = require('supertest');
const app = require('../app.js');
//test that returned queries are sorted by a given field
require('jest-sorted');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Name of the group', () => {});
