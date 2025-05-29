export const transformCCEData = (subjectWiseMarks) => {
  const subjectMap = new Map();

  subjectWiseMarks.forEach(({ subjectName,semester, mark }) => {

    if (!subjectMap.has(subjectName)) {
      subjectMap.set(subjectName, {});
    }

    subjectMap.get(subjectName)[semester] = (subjectMap.get(subjectName)[semester] || 0)+mark;
  });

  const subjects = Array.from(subjectMap.entries()).map(([name, marks]) => ({
    name,
    marks,
  }));
  return {
    semester: ['Rabee’ Semester','Ramadan Semester'],
    subjects,
  };
};
