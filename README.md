## Description

This is a custom API project which forms the back-end for a future front-end game review website. The back-end is designed using the MVC model.

## Technologies

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## Installation

Please see https://jp-nc-be-games.herokuapp.com/ for a live demo.

### Prerequisites

- Ensure you have 14.x (Node v14 Fermium LTS).
- Install PostgreSQL. This software was built and tested using v14.1.

### NPM Instructions

1. Clone the repository locally using `git clone https://github.com/elesian/game-reviews-backend.git`.
2. Run `npm install` to install dependencies or `npm install -D` if you wish to additionally run the test-suites.
3. You will need to create two additional files which specify the database to connect to: `.env.test` and `.env.development`. These files specify which database the program connects to for either test or development data.
4. The `.env.test` file should contain `PGDATABASE=nc_games_test`. 
5. The `.env.development` file should contain `PGDATABASE=nc_games`.
6. Express will automatically seed and connect to the `nc_games_test` database if you wish to run the test-suites. Run `npm run app.test.js` to execute all test suites. Run `npm run utils.test.js' to test utility functions. **Run the test suites SEPARATELY**.
7. The development data should not be forced to run with the test suites, as this may break some of the tests. The development data should be used to seed the database for a third-party hosting solution such as Heroku. 

## Features
 
- Range of API endpoints. Please see the instructions at the live demo for a list of available API end-points and responses.
- Pagination is available for review lists and review comments.
- Queries (category, sort_by, order, p) are available when retrieving list of reviews.

## Project status

The core functionality of the project has been implemented. Future features would include:

- Extend the range of optional queries that can be added to API end-points.
- Add back-end authorisation, for example, Auth0. 

## Licensing

The software is released under the terms of the ISC license. Further information is available <a href="https://opensource.org/licenses/ISC">here.</a>
