function isValidSubmission(submission, assignment) {
  const score = submission.submission.score;
  const pointsPossible = assignment.points_possible;

  switch (true) {
    case pointsPossible === 0:
      return false;
    case typeof score !== "number" || isNaN(score):
      return false;
    default:
      return true;
  }
}

function calculateWeightedAverage(totalScore, totalWeight) {
  return totalScore / totalWeight;
}

function processLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions) {
  if (CourseInfo.id !== AssignmentGroup.course_id) {
    throw new Error(
      "Invalid input: AssignmentGroup does not belong to the course."
    );
  }

  const assignments = AssignmentGroup.assignments.filter(
    (assignment) => assignment.due_at !== "3156-11-15"
  );
  const assignmentScores = {};
  const learnerData = {};

  for (const submission of LearnerSubmissions) {
    const assignment = assignments.find(
      (a) => a.id === submission.assignment_id
    );

    if (!assignment) {
      continue;
    }

    const dueDate = new Date(assignment.due_at);
    const submittedDate = new Date(submission.submission.submitted_at);

    if (submittedDate > dueDate) {
      // Deduct 10% of the total points possible for late submissions
      submission.submission.score -= 0.1 * assignment.points_possible;
    }

    if (isValidSubmission(submission, assignment)) {
      const score = submission.submission.score;
      const pointsPossible = assignment.points_possible;
      const learnerID = submission.learner_id;

      if (!learnerData[learnerID]) {
        learnerData[learnerID] = {
          id: learnerID,
          totalScore: 0,
          totalWeight: 0,
        };
      }

      learnerData[learnerID].totalScore += score;
      learnerData[learnerID].totalWeight += pointsPossible;
      if (!assignmentScores[learnerID]) {
        assignmentScores[learnerID] = {};
      }
      assignmentScores[learnerID][submission.assignment_id] =
        score / pointsPossible;
    }
  }

  return { learnerData, assignmentScores };
}

function getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions) {
  try {
    const { learnerData, assignmentScores } = processLearnerData(
      CourseInfo,
      AssignmentGroup,
      LearnerSubmissions
    );
    const results = [];

    for (const learnerID in learnerData) {
      const learner = learnerData[learnerID];
      const weightedAverage = calculateWeightedAverage(
        learner.totalScore,
        learner.totalWeight
      );
      const learnerResult = { id: learner.id, avg: weightedAverage };

      for (const assignment of AssignmentGroup.assignments) {
        const assignmentID = assignment.id;
        if (assignmentID !== 3) {
          const score = assignmentScores[learnerID]?.[assignmentID] || 0;
          learnerResult[assignmentID] = score;
        }
      }

      results.push(learnerResult);
    }

    return results;
  } catch (error) {
    console.error(error.message);
  }
}

// Sample data
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: { submitted_at: "2023-01-25", score: 47 },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: { submitted_at: "2023-02-12", score: 150 },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: { submitted_at: "2023-01-25", score: 400 },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: { submitted_at: "2023-01-24", score: 39 },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: { submitted_at: "2023-03-07", score: 140 },
  },
];

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
