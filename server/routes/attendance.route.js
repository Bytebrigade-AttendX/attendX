import { Router } from "express";
import {
  startSession,
  getMarked,
  endSession,
  storeRecords,
  getActiveattendance,
  redisConnect,
} from "../controllers/attendance.controller.js";

const attendanceRouter = Router();

attendanceRouter.route("/startSession").post(startSession);
attendanceRouter.route("/getMarked").post(getMarked);
attendanceRouter.route("/endSession").post(endSession);
attendanceRouter.route("/storeRecords").post(storeRecords);
attendanceRouter.route("/getActiveAttendance").post(getActiveattendance);
attendanceRouter.route("/connect").get(redisConnect);

export default attendanceRouter;
