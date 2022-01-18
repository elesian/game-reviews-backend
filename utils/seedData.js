/** @format */

exports.insertCategoryData = (categoryData) => {
  let insertedCategories = categoryData.map((element) => {
    return [element.slug, element.description];
  });
  return insertedCategories;
};

exports.insertUserData = (userData) => {
  let insertedUsers = userData.map((element) => {
    return [element.username, element.avatar_url, element.name];
  });
  return insertedUsers;
};

exports.insertReviewData = (reviewData) => {
  let currentID = 0;
  let insertedReviews = reviewData.map((element) => {
    currentID++;
    return [
      currentID,
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
  return insertedReviews;
};

exports.insertCommentData = (commentData) => {
  let currentID = 0;
  let insertedComments = commentData.map((element) => {
    currentID++;
    return [
      currentID,
      element.author,
      element.review_id,
      element.votes,
      element.created_at,
      element.body,
    ];
  });
  return insertedComments;
};
