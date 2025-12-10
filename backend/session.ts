import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASSWORD as string)}@todoapp.gn2y6mx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=todoApp`,
    ttl: 60 * 60 * 24 * 7,
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});
