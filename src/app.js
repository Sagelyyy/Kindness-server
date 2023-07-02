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
    "http://localhost:5173",
    "https://kindness-server-production.up.railway.app/",
    "https://main--gorgeous-kulfi-f739be.netlify.app/",
  ],
  credentials: true,
};

const port = process.env.PORT;
const app = express();

app.use(adminCheck);
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
