const { addComment } = require(`../models/postModels.js`)

exports.postComment = (request, response) => {
    return addComment(request.params, request.body)


}