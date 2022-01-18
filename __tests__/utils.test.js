/** @format */

const { seedData } = require('../utils/index.js');
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require('../db/data/test-data/index.js');

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

describe.only('INSERT data into comments table', () => {
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
