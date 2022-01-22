/** @format */
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const { seed, listOfTables } = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app.js');
const { notify } = require('../app.js');

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

describe('*', () => {
  describe('*/invalid', () => {
    test('should return a 404 error ', () => {
      return request(app)
        .get('/api/categories&query')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('404 - Not Found');
        });
    });
  });
});

describe('GET', () => {
  describe('/api/developmentalStatus returns with a list of endpoints', () => {
    test('should return an array of endpoints with fields', () => {
      return request(app)
        .get('/api/devStatus')
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
    test('should ignore queries', () => {
      return request(app)
        .get('/api/devStatus?test=2')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('Queries not accepted');
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
    test('should return a review object with an aggregated comment total of 0 for a review with no comments', () => {
      return request(app)
        .get('/api/reviews/1')
        .expect(200)
        .then(({ body: { review } }) => {
          console.log(review);
          expect(typeof review).toEqual('object');
          expect(review.length).toEqual(1);
          review.every((element) =>
            expect(element).toEqual({
              title: expect.any(String),
              review_id: expect.any(Number),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: 0,
            })
          );
        });
    });
    test('should return a review object with an aggregated comment total of > 0 for a review with comments', () => {
      return request(app)
        .get('/api/reviews/3')
        .expect(200)
        .then(({ body: { review } }) => {
          console.log(review);
          expect(review.length).toEqual(1);
          expect(review[0].comment_count).toEqual(3);
        });
    });
    test('Should return status 400 for an invalid ID', () => {
      return request(app)
        .get('/api/reviews/INVALID')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('Invalid input');
        });
    });
    test('Should return status 404 for a non-existance ID', () => {
      return request(app)
        .get('/api/reviews/600')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('404 - Not Found');
        });
    });
  });

  describe('/api/reviews', () => {
    test('should return an array of review objects', () => {
      const enquiry = `?category=social+deduction&sort_by=votes&order=desc`;
      return request(app)
        .get(`/api/reviews${enquiry}`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          console.log(reviews);
          expect(typeof reviews).toEqual('object');
          expect(reviews.length).toEqual(11);
          reviews.every((element) =>
            expect(isNaN(Date.parse(element.created_at))).toBe(false)
          );
          reviews.every((element) =>
            expect(element).toEqual(
              expect.objectContaining({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                category: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            )
          );
        });
    });
    test('should be sorted automatically by date of creation, desc', () => {
      return request(app)
        .get(`/api/reviews`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });
    test('should accept a sort criteria', () => {
      return request(app)
        .get(`/api/reviews?sort_by=votes`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy('votes', {
            descending: true,
          });
        });
    });
    test('should accept a sort and ordering criteria', () => {
      return request(app)
        .get(`/api/reviews?sort_by=votes&order=asc`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy('votes', {
            descending: false,
          });
        });
    });
    test('should accept a category criteria', () => {
      return request(app)
        .get(`/api/reviews?category=dexterity`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy('created_by', {
            descending: false,
          });
          expect(reviews.length).toEqual(1);
        });
    });
    test('should return status 400 when sent an invalid sort category ', () => {
      return request(app)
        .get(`/api/reviews?sort_by=bananas`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('Invalid SORT query');
        });
    });
    test('should return status 400 when sent an invalid order', () => {
      return request(app)
        .get(`/api/reviews?sort_by=owner&order=INVALID`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('Invalid ORDER query');
        });
    });
    test('should return 404 on an invalid category ', () => {
      const enquiry = `?category=INVALID&sort_by=votes&order=desc`;
      return request(app)
        .get(`/api/reviews${enquiry}`)
        .expect(404)
        .then(({ body: { msg } }) =>
          expect(msg).toEqual('404 - Invalid Category')
        );
    });
    test('category valid but has no review, responds with an empty array', () => {
      return request(app)
        .get(`/api/reviews?category=children%27s+games`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          console.log(reviews);
          expect(reviews).toEqual([]);
        });
    });
    test('should accept pagination of results', () => {
      return request(app)
        .get(`/api/reviews?category=social+deduction&limit=2&p=2`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews.length).toEqual(2);
        });
    });
    test('should return 200 if row limit is exceeded but category exists', () => {
      return request(app)
        .get(`/api/reviews?category=social+deduction&limit=100&p=20`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toEqual([]);
        });
    });
    test('should return the total number of results before limits', () => {
      return request(app)
        .get(`/api/reviews?category=social+deduction&limit=100&p=20`)
        .expect(200)
        .then(({ body: { reviews, count } }) => {
          expect(reviews).toEqual([]);
          expect(count).toEqual(11);
        });
    });
  });

  describe('/api/users ', () => {
    test('should return an object', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toEqual(4);
        });
    });
    test('should return a user object with specific properties', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: { users } }) => {
          users.every((element) => {
            expect(element).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe('/api/users/:username', () => {
    test('should return a user object of length one', () => {
      return request(app)
        .get('/api/users/mallionaire')
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user.length).toEqual(1);
          expect(user[0].username).toEqual('mallionaire');
        });
    });
    test('should return 404 for non existance ID', () => {
      return request(app)
        .get('/api/users/1')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('username not found');
        });
    });
  });

  describe('/api/reviews/:review_id/comments', () => {
    test('should return an object ', () => {
      return request(app)
        .get(`/api/reviews/2/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(typeof comments).toEqual('object');
        });
    });
    test('should have specific properties', () => {
      return request(app)
        .get(`/api/reviews/2/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          comments.every((element) => {
            expect(element).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test('Status 400, with an invalid ID', () => {
      return request(app)
        .get(`/api/reviews/INVALID/comments`)
        .expect(400)
        .then(({ body: { msg } }) => expect(msg).toEqual('Invalid input'));
    });
    test('Returns Status 404 with a non-existance ID, e.g 999', () => {
      return request(app)
        .get(`/api/reviews/999/comments`)
        .expect(404)
        .then(({ body: { msg } }) =>
          expect(msg).toEqual('review_ID does not exist')
        );
    });
    test('Status 200 for valid ID but has no comments. Responds with empty array', () => {
      return request(app)
        .get(`/api/reviews/1/comments`)
        .expect(404)
        .then(({ body: { msg } }) => expect(msg).toEqual('No comments found'));
    });
    test('should accept pagination of results', () => {
      return request(app)
        .get(`/api/reviews/3/comments?limit=1&p=2`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toEqual(1);
        });
    });
    test('should return 404 not found if pagination is beyond db row count', () => {
      return request(app)
        .get(`/api/reviews/3/comments?limit=5&p=2`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('No comments found');
        });
    });
  });

  describe('/api', () => {
    test('returns with a JSON object', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body: { api } }) => {
          expect(typeof api).toEqual('object');
          const whatIs = JSON.stringify(api);
          console.log(typeof whatIS);
          expect(typeof whatIs).toEqual('string');
        });
    });
  });
});

describe('PATCH', () => {
  describe('/api/reviews/:review_id', () => {
    test('should increment the votes count for a given review_id', () => {
      return request(app)
        .patch('/api/reviews/1')
        .send({ inc_votes: -100 })
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review.votes).toEqual(-99);
        });
    });
    test('should return 400 on an invalid ID', () => {
      return request(app)
        .patch('/api/reviews/test')
        .send({ inc_votes: -100 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('Invalid input');
        });
    });
    test('should return 400 on an invalid inc_votes type', () => {
      return request(app)
        .patch('/api/reviews/test')
        .send({ inc_votes: 'INVALID' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('Invalid input');
        });
    });
    test('should return 404 on a non existent ID', () => {
      return request(app)
        .patch('/api/reviews/999')
        .send({ inc_votes: -100 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('404 - Not Found');
        });
    });
    test('should return status 200 with missing inc_votes key', () => {
      return request(app)
        .patch('/api/reviews/1')
        .send({})
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review.votes).toEqual(1);
        });
    });
  });
  describe('/api/comments/:comment_id', () => {
    test('should increment the votes count for a given review_id', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: -100 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toEqual(-84);
        });
    });
    test('should return 400 on an invalid ID', () => {
      return request(app)
        .patch('/api/comments/test')
        .send({ inc_votes: -100 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('Invalid input');
        });
    });
    test('should return 400 on an invalid inc_votes type', () => {
      return request(app)
        .patch('/api/comments/test')
        .send({ inc_votes: 'INVALID' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('Invalid input');
        });
    });
    test('should return 404 on a non existent ID', () => {
      return request(app)
        .patch('/api/comments/999')
        .send({ inc_votes: -100 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('404 - Not Found');
        });
    });
    test('should return status 200 with missing inc_votes key', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({})
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toEqual(16);
        });
    });
  });
});

describe('POST', () => {
  describe('/api/reviews/:review_id/comments', () => {
    test('should return a posted comment ', () => {
      return request(app)
        .post('/api/reviews/1/comments')
        .send({
          username: 'mallionaire',
          body: `I'd buy that for a dollar !!!`,
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          console.log(comment);
          expect(typeof comment).toEqual('object');
          expect(comment.hasOwnProperty('author'));
          expect(comment.length).toEqual(1);
          expect(comment[0].comment_id).toEqual(7);
        });
    });
    test('should be able to do multiple updates', () => {
      return request(app)
        .post('/api/reviews/2/comments')
        .send({
          username: 'mallionaire',
          body: `I'd buy that for a dollar !!!`,
        })
        .expect(201)
        .then(() => {
          return request(app)
            .post('/api/reviews/2/comments')
            .send({
              username: 'mallionaire',
              body: `I'd buy that for two dollars !!!`,
            })
            .expect(201);
        })
        .then(({ body: { comment } }) => {
          console.log(comment);
          expect(typeof comment).toEqual('object');
          expect(comment.hasOwnProperty('author'));
          expect(comment.length).toEqual(1);
          expect(comment[0].comment_id).toEqual(8);
        });
    });
    test('should return a body that matches the sent body', () => {
      return request(app)
        .post('/api/reviews/2/comments')
        .send({
          username: 'mallionaire',
          body: `I'd buy that for a dollar !!!`,
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment[0].body).toEqual("I'd buy that for a dollar !!!");
        });
    });
    test('should reject an invalid ID', () => {
      return request(app)
        .post('/api/reviews/INVALID/comments')
        .send({
          username: 'mallionaire',
          body: `I'd buy that for a dollar !!!`,
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('Invalid input');
        });
    });
    test('should return 400 for a non-existant review ID', () => {
      return request(app)
        .post('/api/reviews/999/comments')
        .send({
          username: 'mallionaire',
          body: `I'd buy that for a dollar !!!`,
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('Invalid input');
        });
    });
    test('should return 404 for missing required fields - i.e no user-name or body properties', () => {
      return request(app)
        .post('/api/reviews/1/comments')
        .send({
          body: `I'd buy that for a dollar !!!`,
        })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('404 - user does not exist');
        });
    });
    test('should return 400 for missing required fields - i.e no user-name or body properties', () => {
      return request(app)
        .post('/api/reviews/1/comments')
        .send({
          username: 'mallionaire',
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('Invalid input');
        });
    });
    test('should return 404 for a username that does not exist', () => {
      return request(app)
        .post('/api/reviews/1/comments')
        .send({
          username: 'INVALID',
          body: `I'd buy that for a dollar !!!`,
        })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('404 - user does not exist');
        });
    });
    test('ignores unnecessary properties - STATUS 201 returned', () => {
      return request(app)
        .post('/api/reviews/1/comments')
        .send({
          username: 'mallionaire',
          body: `I'd buy that for a dollar !!!`,
          invalid: 'invalid body',
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment.length).toEqual(1);
          expect(comment[0]).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              author: expect.any(String),
              review_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              body: expect.any(String),
            })
          );
        });
    });
  });
});

describe('DELETE', () => {
  describe('Delete comment', () => {
    test('should return a 204 status code with no body', () => {
      return request(app)
        .delete('/api/comments/2')
        .expect(204)
        .then(({ statusCode }) => {
          expect(statusCode).toEqual(204);
        });
    });
    test('should return 404 for a non-existent ID', () => {
      return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then(({ statusCode }) => {
          expect(statusCode).toEqual(404);
        });
    });
    test('should return 400 for an invalid ID', () => {
      return request(app)
        .delete('/api/comments/INVALID')
        .expect(400)
        .then(({ statusCode }) => {
          expect(statusCode).toEqual(400);
        });
    });
  });
});
