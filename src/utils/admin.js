import dotenv from "dotenv";
dotenv.config();

export const adminCheck = (req, res, next) => {
  const adminIps = [process.env.ADMINIP, process.env.DEVIP];
  const userIp = req.headers["x-forwarded-for"];

  if (adminIps.includes(userIp)) {
    req.admin = true;
  } else {
    req.admin = false;
  }
  next();
};
