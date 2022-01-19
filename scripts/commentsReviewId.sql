\c nc_games_test

SELECT comment_id, comments.votes, comments.created_at, comments.author FROM comments 
  LEFT JOIN reviews ON comments.review_id = reviews.review_id
  WHERE reviews.review_id = 3;