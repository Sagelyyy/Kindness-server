import dotenv from "dotenv";
dotenv.config();

export const adminCheck = (req, res, next) => {
  const adminIps = [process.env.ADMINIP, process.env.DEVIP];
  const userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const adminKey = localStorage.getItem("admin");

  if (adminIps.includes(userIp) || adminKey == process.env.ADMINKEY) {
    req.admin = true;
  } else {
    req.admin = false;
  }
  next();
};
