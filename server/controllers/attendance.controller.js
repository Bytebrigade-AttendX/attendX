import prisma from "../db/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import path from "path";

const startSession = async (req, res) => {
  const { branch, semester, subjectName, teacherId } = req.body;
  try {
    // First, find the class that matches the branch and semester
    const classObj = await prisma.class.findFirst({
      where: {
        branch: branch,
        semester: semester,
        // Make sure this class has the given subject assigned
        subjects: {
          some: {
            subject: {
              name: subjectName,
            },
          },
        },
        // And the teacher teaches this subject for this class
        teacherClasses: {
          some: {
            teacher_id: teacherId,
            subject: {
              name: subjectName,
            },
          },
        },
      },
    });

    if (!classObj) {
      throw new Error("No matching class found with the given parameters");
    }

    // Now fetch all students from this class with their user information
    const students = await prisma.student.findMany({
      where: {
        class_id: classObj.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            gender: true,
            department: true,
          },
        },
      },
      orderBy: {
        reg_no: "asc", // Order by registration number
      },
    });

    const sessionStart = new Date();
    const sessionEnd = new Date(sessionStart.getTime() + 3 * 60 * 1000); // 3 minutes later

    console.log("done");

    // Initialize student_records as JSON (e.g., empty or with default attendance status)
    const studentRecords = students.reduce((acc, student) => {
      console.log("Error maybe here");
      acc[student.id] = { status: "absent" }; // Default to absent
      return acc;
    }, {});

    const subject = await prisma.subject.findFirst({
      where: {
        name: subjectName,
      },
      select: {
        id: true,
      },
    });

    // Create the attendance record
    await prisma.attendance.create({
      data: {
        class_id: classObj.id,
        subject_id: subject.id, // Use the subject ID from the class query
        teacher_id: teacherId,
        date: sessionStart,
        session_start: sessionStart,
        session_end: sessionEnd,
        student_records: studentRecords,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          students,
          "Students fetched and attendance session started"
        )
      );
  } catch (error) {
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

const getMarked = async (req, res) => {
  try {
    const { attendanceId, token } = req.body;
    const filePath = path.resolve(__dirname, "../records.temp.json");
    const rawData = await fs.readFile(filePath, "utf-8");
    subjects = rawData ? JSON.parse(rawData) : [];
    if (!token) {
      throw new ApiError(400, "Invalid login");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      throw new ApiError(400, "Wrong token provided");
    }
    const selectedUser = decodedToken.userId;
    const user = await prisma.user.findFirst({
      where: { id: selectedUser },
      select: {
        id: true,
      },
    });
    if (!user) {
      throw new ApiError(400, "User not found");
    }
    return res.status(200).json({ message: "Success" });
  } catch (error) {}
};

export { startSession, getMarked };
