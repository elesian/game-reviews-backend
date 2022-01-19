\c nc_games_test;

SELECT setval('comments_comment_id_seq', (SELECT MAX(comment_id) from "comments"));

INSERT INTO comments (author, review_id, body)
values ('mallionaire', 2, 'test body');

select * from comments;
