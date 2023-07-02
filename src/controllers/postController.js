const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRESUSER,
  host: process.env.POSTGRESIP,
  database: process.env.POSTGRESDB,
  password: process.env.POSTGRESPASSWORD,
  port: 5432,
});

exports.posts_get = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM posts ORDER BY post_time DESC"
    );
    const formattedPosts = result.rows.map((post) => ({
      ...post,
      formatted_timestamp: DateTime.fromJSDate(post.post_time).toLocaleString(
        DateTime.DATETIME_SHORT
      ),
    }));
    res.json(formattedPosts);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while retrieving posts");
  }
};

exports.post_message = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username must be specified."),
  body("message")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Message must be specified."),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
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

exports.post_delete = async (req, res, next) => {
  try {
    await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
    res.status(200).send("Post deleted successfully.");
  } catch (err) {
    console.log(err);
    res.status(500).send("There was an error deleting your post.");
  }
};
