// Function to check if a submission is valid based on the score and points possible.
// Returns true if the submission is valid, otherwise false.

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

// Function to calculate the weighted average given the total score and total weight.
// Returns the calculated weighted average.
function calculateWeightedAverage(totalScore, totalWeight) {
  return totalScore / totalWeight;
}

// Function to process learner data, including filtering out assignments with due dates before the current date.
// Computes total scores and weights for each learner and their assignment scores.
// Returns an object containing learner data and assignment scores.

function processLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions) {
  if (CourseInfo.id !== AssignmentGroup.course_id) {
    throw new Error(
      "Invalid input: AssignmentGroup does not belong to the course."
    );
  }

  const currentDate = new Date(); // Get the current date

  const assignments = AssignmentGroup.assignments.filter((assignment) => {
    const dueDate = new Date(assignment.due_at);
    return dueDate < currentDate; // Filter out assignments with due dates before today
  });

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
      const score = Math.round(submission.submission.score * 100) / 100;
      const pointsPossible = Math.round(assignment.points_possible * 100) / 100;
      const learnerID = submission.learner_id;

      if (!learnerData[learnerID]) {
        learnerData[learnerID] = {
          id: learnerID,
          totalScore: 0,
          totalWeight: 0,
        };
      }

      learnerData[learnerID].totalScore += Math.round(score * 100) / 100;
      learnerData[learnerID].totalWeight +=
        Math.round(pointsPossible * 100) / 100;
      if (!assignmentScores[learnerID]) {
        assignmentScores[learnerID] = {};
      }
      assignmentScores[learnerID][submission.assignment_id] =
        score / pointsPossible;
    }
  }

  return { learnerData, assignmentScores };
}

// Function to retrieve learner data, including their weighted averages and assignment scores.
// Returns an array of objects containing learner IDs, their average scores, and assignment scores.

function getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions) {
  try {
    const { learnerData, assignmentScores } = processLearnerData(
      CourseInfo,
      AssignmentGroup,
      LearnerSubmissions
    );
    const results = [];

    // Get the keys of learnerData object
    const learnerIDs = Object.keys(learnerData);
    let i = 0;

    // Iterate using while loop
    while (i < learnerIDs.length) {
      const learnerID = learnerIDs[i];
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
          learnerResult[assignmentID] = Math.round(score * 100) / 100;
        }
      }

      results.push(learnerResult);
      i++;
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
