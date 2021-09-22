const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addCommentController,
  postCommentController,
  deleteCommentController,
} = require("../controllers/commentController");

//express validation required;
const {
  commentValidators,
} = require("../validators/comment-Validation/commentValidators");
const {
  commentValidate,
} = require("../validators/comment-Validation/commentValidate");

//get comment page for add comment route /ideas/:id/comments/new
router.get("/new", addCommentController);

//post comments route /ideas/:id/comments
router.post("/", commentValidators(), commentValidate, postCommentController);

//delete comment rotue /ideas/:id/comments/:comment_id
router.delete("/:comment_id", deleteCommentController);

module.exports = router;
