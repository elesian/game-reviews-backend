\c nc_games_test

SELECT owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comment_id)::int as comment_count FROM reviews 
JOIN users ON reviews.owner=users.username 
LEFT JOIN comments ON reviews.review_id=comments.review_id 
GROUP BY reviews.review_id;

