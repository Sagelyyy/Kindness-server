import { body, validationResult } from "express-validator";
import { DateTime } from "luxon";
import pkg from "pg";
import dotenv from "dotenv";
import { createAvatar } from "@dicebear/core";
import { personas } from "@dicebear/collection";
import swearjar from "swearjar";

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRESUSER,
  host: process.env.POSTGRESIP,
  database: process.env.POSTGRESDB,
  password: process.env.POSTGRESPASSWORD,
  port: 5432,
});

export const posts_get = async (req, res, next) => {
  if (req.admin) {
    console.log("Admin Connected");
  }
  try {
    const result = await pool.query(
      "SELECT * FROM posts ORDER BY post_time DESC"
    );
    const formattedPosts = result.rows.map((post) => {
      let avatar = createAvatar(personas, {
        size: 128,
        seed: post.username,
      }).toDataUriSync();
      return {
        ...post,
        filtered_message: swearjar.censor(post.message),
        formatted_timestamp: DateTime.fromJSDate(post.post_time).toLocaleString(
          DateTime.DATETIME_SHORT
        ),
        avatar: avatar,
      };
    });
    res.json(formattedPosts);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while retrieving posts");
  }
};

export const post_message = [
  body("username")
    .custom((value) => {
      if (swearjar.profane(value)) {
        throw new Error("Username cannot contain profanity");
      }
      return true;
    })
    .trim()
    .isLength({ min: 1, max: 500 })
    .escape()
    .withMessage("Username must be specified, and less than 500 characters."),
  body("message")
    .custom((value) => {
      if (swearjar.profane(value)) {
        throw new Error("Message cannot contain profanity");
      }
      return true;
    })
    .trim()
    .isLength({ min: 1, max: 500 })
    .escape()
    .withMessage("Message must be specified, and less than 500 characters."),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const result = await pool.query(
          "INSERT INTO posts (username, message) VALUES ($1, $2)",
          [req.body.username, req.body.message]
        );
        res.json(result.rows);
      } catch (err) {
        console.log(err);
        res.status(500).send("There was an error submitting your message");
      }
    }
  },
];

export const post_delete = async (req, res, next) => {
  if (req.admin) {
    try {
      await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
      res.status(200).send("Post deleted successfully.");
    } catch (err) {
      console.log(err);
      res.status(500).send("There was an error deleting your post.");
    }
  } else {
    console.log("Attempted Deletion");
    res.status(403).send("Forbidden");
  }
};
