import express from "express";
import * as postController from "../controllers/postController.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({
    message: "Welcome to the Kindness Chat API!",
  });
});

// Post Routes
router.get("/posts", postController.posts_get);
router.post("/posts", postController.post_message);
router.delete("/posts/:id", postController.post_delete);

export { router };
