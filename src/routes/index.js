const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/", (req, res, next) => {
  res.json({
    message: "Welcome to the Kindness Chat API!",
  });
});

// Post Routes
router.get("/posts", postController.posts_get);
router.post("/posts", postController.post_message);
router.delete("/posts/:id", postController.post_delete);

module.exports = router;
