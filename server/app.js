import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import adminRouter from "./routes/admin.route.js";
import { Server } from "socket.io";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT"] },
});

app.use(cors("*"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

app.use("/api/v1/admin", adminRouter);

export { app, io, server };
