import prisma from "../db/db.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

    return res
      .status(200)
      .json(new ApiResponse(200, students, "Students fetched"));
  } catch (error) {
    console.error("Error fetching students:", error.message);
  }
};

export { startSession };
