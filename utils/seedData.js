/** @format */

exports.insertCategoryData = (categoryData) => {
  let insertedCategories = categoryData.map((element) => {
    return [element.slug, element.description];
  });
  //   console.log(insertedCategories);

  return insertedCategories;
};

exports.insertUserData = (userData) => {
  let insertedUsers = userData.map((element) => {
    return [element.username, element.avatar_url, element.name];
  });
  //   console.log(insertedUsers);
  return insertedUsers;
};

exports.insertReviewData = (reviewData) => {
  let current_id = 0;
  let insertedReviews = reviewData.map((element) => {
    current_id++;
    return [
      current_id,
      element.title,
      element.review_body,
      element.designer,
      element.review_img_url,
      element.votes,
      element.category,
      element.owner,
      element.created_at,
    ];
  });
  //   console.log(insertedReviews);
  return insertedReviews;
};

exports.insertCommentData = (commentData) => {
  let current_id = 0;
  let insertedComments = commentData.map((element) => {
    current_id++;
    return [
      current_id,
      element.author,
      element.review_id,
      element.votes,
      element.created_at,
      element.body,
    ];
  });
  //   console.log(insertedComments);
  return insertedComments;
};
