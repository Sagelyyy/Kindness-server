import express from "express";
import logger from "morgan";
import dotenv from "dotenv";
import responseTime from "response-time";
import { router as apiRouter } from "./routes/index.js";
import cors from "cors";
import { adminCheck } from "./utils/admin.js";

dotenv.config();

const corsOptions = {
  origin: [
    "http://localhost:5174",
    // front-end
    "https://do-good.netlify.app",
  ],
  credentials: true,
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(adminCheck);
app.use(responseTime());

const port = process.env.PORT;

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

logger.token("origin", function (req, res) {
  return req.headers.origin;
});

logger.token("ip", function (req, res) {
  return req.ip;
});

app.use(
  logger(":method :url :status :response-time ms :emoji - :origin - :ip")
);

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is Live!`);
});
