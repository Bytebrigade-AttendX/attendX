import prisma from "../db/db.config.js";

const feed = async () => {
  try {
    const teacherUser1 = await prisma.user.create({
      data: {
        name: "John Smith",
        email: "john.smith@university.edu",
        department: "CSE",
        role: "teacher",
        gender: "male",
      },
    });

    const teacherUser2 = await prisma.user.create({
      data: {
        name: "Emily Chen",
        email: "emily.chen@university.edu",
        department: "ECE",
        role: "teacher",
        gender: "female",
      },
    });

    // Create users - students
    const studentUsers = await Promise.all([
      prisma.user.create({
        data: {
          name: "Alice Johnson",
          email: "alice.j@university.edu",
          department: "CSE",
          role: "student",
          gender: "female",
        },
      }),
      prisma.user.create({
        data: {
          name: "Bob Miller",
          email: "bob.m@university.edu",
          department: "CSE",
          role: "student",
          gender: "male",
        },
      }),
      prisma.user.create({
        data: {
          name: "Carol Davis",
          email: "carol.d@university.edu",
          department: "ECE",
          role: "student",
          gender: "female",
        },
      }),
      prisma.user.create({
        data: {
          name: "David Wang",
          email: "david.w@university.edu",
          department: "ECE",
          role: "student",
          gender: "male",
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
        dept: "CSE",
        year: 2025,
      },
    });

    const class2 = await prisma.class.create({
      data: {
        code: "ECE-2025",
        dept: "ECE",
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
    console.log("Created records");
  } catch (error) {
    console.log(error.message);
  }
};

feed();
