const express = require("express");
const logger = require("morgan");
const dotenv = require("dotenv");
const responseTime = require("response-time");
const apiRouter = require("./routes/index");
const cors = require("cors");

dotenv.config();

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

const port = process.env.PORT;
const app = express();

app.use(responseTime());
app.use(express.json());
app.use(cors(corsOptions));

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
