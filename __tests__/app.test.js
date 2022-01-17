const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js')

const request = require('supertest');
const app = require('../app.js');
require('jest-sorted');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Name of the group', () => {
    
});
