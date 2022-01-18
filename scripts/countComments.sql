\c nc_games_test

select reviews.title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, count(comment_id) as comment_count from reviews left join comments on reviews.review_id = comments.review_id
where reviews.review_id = '3'
group by reviews.review_id;


