// context/TeacherContext.tsx
import React, { createContext, useContext, useState } from "react";

const TeacherContext = createContext(null);

export const TeacherProvider = ({ children }) => {
  const [subjectsBySemester, setSubjectsBySemester] = useState([]);

  return (
    <TeacherContext.Provider
      value={{ subjectsBySemester, setSubjectsBySemester }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => useContext(TeacherContext);
