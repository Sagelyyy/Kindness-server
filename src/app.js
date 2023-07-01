const express = require("express");
const logger = require("morgan");
const dotenv = require("dotenv");
const responseTime = require("response-time");
const apiRouter = require("./routes/index");

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(responseTime());
app.use(express.json());

logger.token("emoji", function (req, res) {
  const speed = parseFloat(res.getHeader("X-Response-Time"));
  if (speed < 200) {
    return "🚀";
  } else if (speed < 500) {
    return "🚗";
  } else {
    return "🐢";
  }
});

app.use(logger(":method :url :status :response-time ms :emoji"));

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
