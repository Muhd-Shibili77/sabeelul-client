export const transformCCEData = (subjectWiseMarks, allSubjects) => {
  // Create a map to store marks for subjects that have them
  const subjectMarkMap = new Map();

  // Process existing marks
  subjectWiseMarks.forEach(({ subjectName, semester, mark }) => {
    if (!subjectMarkMap.has(subjectName)) {
      subjectMarkMap.set(subjectName, {});
    }
    
    subjectMarkMap.get(subjectName)[semester] = 
      (subjectMarkMap.get(subjectName)[semester] || 0) + mark;
  });

  // Create subjects array including all subjects from the class
  const subjects = allSubjects.map(subject => {
    const subjectName = subject.name || subject.subjectName || subject;
    
    return {
      name: subjectName,
      marks: subjectMarkMap.get(subjectName) || {}, // Empty object if no marks
    };
  });

  return {
    semester: ['Rabee Semester', 'Ramadan Semester'],
    subjects,
  };
};