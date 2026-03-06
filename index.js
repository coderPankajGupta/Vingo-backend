import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://vingo-frontend-ten.vercel.app"],
    credentials: true,
    methods:['POST','GET']
  },
});

app.set("io",io)

const PORT = process.env.PORT || 5001;
connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://vingo-frontend-ten.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/item", itemRouter);
app.use("/api/shop", shopRouter);
app.use("/api/order", orderRouter);

socketHandler(io)
server.listen(PORT, () => {
  console.log(`Server is listing on : ${PORT}`);
});
