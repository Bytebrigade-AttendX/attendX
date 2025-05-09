import prisma from "../db/db.config.js";
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
