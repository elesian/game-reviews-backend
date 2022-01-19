\c nc_games_test

SELECT owner, reviews.review_id, designer, category, reviews.created_at, reviews.votes, COUNT(comment_id)::int as comment_count FROM reviews 
          JOIN users ON reviews.owner=users.username 
          LEFT JOIN comments ON reviews.review_id=comments.review_id 
          GROUP BY reviews.review_id
           ORDER BY reviews.votes DESC;

