import { Router } from "express";
import { startSession } from "../controllers/attendance.controller.js";

const attendanceRouter = Router();

attendanceRouter.route("/startSession").post(startSession);

export default attendanceRouter;
