import {
  Role,
  Department,
  Gender,
  AttendanceStatus,
} from "../generated/prisma/index.js";

import prisma from "../db/db.config.js";

async function main() {
  // Clear existing data (optional - useful for testing)
  await prisma.$transaction([
    // prisma.attendanceRecord.deleteMany(),
    prisma.attendance.deleteMany(),
    prisma.teacherClass.deleteMany(),
    prisma.classSubject.deleteMany(),
    prisma.student.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.subject.deleteMany(),
    prisma.class.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log("Database cleared...");

  // Create users - teachers
  const teacherUser1 = await prisma.user.create({
    data: {
      name: "John Smith",
      email: "john.smith@university.edu",
      department: Department.CSE,
      role: Role.teacher,
      gender: Gender.male,
    },
  });

  const teacherUser2 = await prisma.user.create({
    data: {
      name: "Emily Chen",
      email: "emily.chen@university.edu",
      department: Department.ECE,
      role: Role.teacher,
      gender: Gender.female,
    },
  });

  // Create users - students
  const studentUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alice Johnson",
        email: "alice.j@university.edu",
        department: Department.CSE,
        role: Role.student,
        gender: Gender.female,
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Miller",
        email: "bob.m@university.edu",
        department: Department.CSE,
        role: Role.student,
        gender: Gender.male,
      },
    }),
    prisma.user.create({
      data: {
        name: "Carol Davis",
        email: "carol.d@university.edu",
        department: Department.ECE,
        role: Role.student,
        gender: Gender.female,
      },
    }),
    prisma.user.create({
      data: {
        name: "David Wang",
        email: "david.w@university.edu",
        department: Department.ECE,
        role: Role.student,
        gender: Gender.male,
      },
    }),
  ]);

  console.log("Users created...");

  // Create teachers
  const teacher1 = await prisma.teacher.create({
    data: {
      id: teacherUser1.id,
      teacher_id_no: "TCH001",
    },
  });

  const teacher2 = await prisma.teacher.create({
    data: {
      id: teacherUser2.id,
      teacher_id_no: "TCH002",
    },
  });

  console.log("Teachers created...");

  // Create classes
  const class1 = await prisma.class.create({
    data: {
      code: "CSE-2025",
      dept: Department.CSE,
      year: 2025,
    },
  });

  const class2 = await prisma.class.create({
    data: {
      code: "ECE-2025",
      dept: Department.ECE,
      year: 2025,
    },
  });

  console.log("Classes created...");

  // Create subjects
  const subject1 = await prisma.subject.create({
    data: {
      code: "CSE101",
      name: "Introduction to Computer Science",
    },
  });

  const subject2 = await prisma.subject.create({
    data: {
      code: "CSE201",
      name: "Data Structures and Algorithms",
    },
  });

  const subject3 = await prisma.subject.create({
    data: {
      code: "ECE101",
      name: "Basic Electronics",
    },
  });

  console.log("Subjects created...");

  // Link classes with subjects
  await prisma.classSubject.createMany({
    data: [
      {
        class_id: class1.id,
        subject_id: subject1.id,
      },
      {
        class_id: class1.id,
        subject_id: subject2.id,
      },
      {
        class_id: class2.id,
        subject_id: subject3.id,
      },
    ],
  });

  console.log("Classes linked with subjects...");

  // Link teachers with classes and subjects
  await prisma.teacherClass.createMany({
    data: [
      {
        teacher_id: teacher1.id,
        class_id: class1.id,
        subject_id: subject1.id,
      },
      {
        teacher_id: teacher1.id,
        class_id: class1.id,
        subject_id: subject2.id,
      },
      {
        teacher_id: teacher2.id,
        class_id: class2.id,
        subject_id: subject3.id,
      },
    ],
  });

  console.log("Teachers linked with classes and subjects...");

  // Create students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        id: studentUsers[0].id,
        class_id: class1.id,
        year: 2025,
        reg_no: "CSE2025001",
      },
    }),
    prisma.student.create({
      data: {
        id: studentUsers[1].id,
        class_id: class1.id,
        year: 2025,
        reg_no: "CSE2025002",
      },
    }),
    prisma.student.create({
      data: {
        id: studentUsers[2].id,
        class_id: class2.id,
        year: 2025,
        reg_no: "ECE2025001",
      },
    }),
    prisma.student.create({
      data: {
        id: studentUsers[3].id,
        class_id: class2.id,
        year: 2025,
        reg_no: "ECE2025002",
      },
    }),
  ]);

  console.log("Students created...");

  // // Create attendance records
  // const today = new Date();
  // const yesterday = new Date(today);
  // yesterday.setDate(yesterday.getDate() - 1);

  // // Create attendance for CSE class
  // const attendance1 = await prisma.attendance.create({
  //   data: {
  //     class_id: class1.id,
  //     subject_id: subject1.id,
  //     teacher_id: teacher1.id,
  //     date: today,
  //   },
  // });

  // // Create attendance for ECE class
  // const attendance2 = await prisma.attendance.create({
  //   data: {
  //     class_id: class2.id,
  //     subject_id: subject3.id,
  //     teacher_id: teacher2.id,
  //     date: today,
  //   },
  // });

  // console.log("Attendance records created...");

  // // Create attendance records for students
  // await prisma.attendanceRecord.createMany({
  //   data: [
  //     {
  //       attendance_id: attendance1.id,
  //       student_id: students[0].id,
  //       status: AttendanceStatus.present,
  //     },
  //     {
  //       attendance_id: attendance1.id,
  //       student_id: students[1].id,
  //       status: AttendanceStatus.absent,
  //     },
  //     {
  //       attendance_id: attendance2.id,
  //       student_id: students[2].id,
  //       status: AttendanceStatus.present,
  //     },
  //     {
  //       attendance_id: attendance2.id,
  //       student_id: students[3].id,
  //       status: AttendanceStatus.present,
  //     },
  //   ],
  // });

  // console.log("Student attendance records created...");

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
