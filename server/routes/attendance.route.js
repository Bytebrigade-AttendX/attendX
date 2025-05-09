import { Router } from "express";
import {
  startSession,
  getMarked,
} from "../controllers/attendance.controller.js";

const attendanceRouter = Router();

attendanceRouter.route("/startSession").post(startSession);
attendanceRouter.route("/getMarked").get(getMarked);

export default attendanceRouter;
