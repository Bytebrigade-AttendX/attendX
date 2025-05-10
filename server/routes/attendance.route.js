import { Router } from "express";
import {
  startSession,
  getMarked,
  endSession,
} from "../controllers/attendance.controller.js";

const attendanceRouter = Router();

attendanceRouter.route("/startSession").post(startSession);
attendanceRouter.route("/getMarked").post(getMarked);
attendanceRouter.route("/endSession").post(endSession);

export default attendanceRouter;
