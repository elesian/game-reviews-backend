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
  //   console.log(insertedReviews);
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
  //   console.log(insertedComments);
  return insertedComments;
};
