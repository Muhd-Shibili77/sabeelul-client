export const transformCCEData = (subjectWiseMarks) => {
  const phasesSet = new Set();
  const subjectMap = new Map();

  subjectWiseMarks.forEach(({ subjectName, phase, mark }) => {
    phasesSet.add(phase);

    if (!subjectMap.has(subjectName)) {
      subjectMap.set(subjectName, {});
    }

    subjectMap.get(subjectName)[phase] = mark;
  });

  const subjects = Array.from(subjectMap.entries()).map(([name, marks]) => ({
    name,
    marks,
  }));

  return {
    phases: Array.from(phasesSet),
    subjects,
  };
};
