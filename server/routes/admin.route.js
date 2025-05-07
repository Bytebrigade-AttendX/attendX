import { Router } from "express";
import { addTeacher } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.route("/addTeacher").post(addTeacher);

export default adminRouter;
