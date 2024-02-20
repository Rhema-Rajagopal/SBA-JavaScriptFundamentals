console.log("Welcome To SBA");
// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
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
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },

  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

// function getLearnerData(course, ag, submissions) {
function getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions) {
  // Validate course ID
  if (AssignmentGroup.course_id !== CourseInfo.id) {
    throw new Error("AssignmentGroup does not belong to the specified course.");
  }

  // Calculate total weight of all assignments
  const totalWeight = AssignmentGroup.assignments.reduce(
    (acc, assignment) => acc + assignment.points_possible,
    0
  );

  // Process learner submissions
  const result = [];
  LearnerSubmissions.forEach((submission) => {
    // Initialize learner data object
    const learnerData = {
      id: submission.learner_id,
      avg: 0,
    };

    console.log(learnerData);

    // Initialize total score and count for calculating average

    let count = 0;

    // Process each assignment submission
    AssignmentGroup.assignments.forEach((assignment) => {
      // Check if the submission is for this assignment
      if (submission.assignment_id === assignment.id) {
        // Check if submission is not late
        if (submission.submission.submitted_at <= assignment.due_at) {
          // Calculate score percentage
          const scorePercentage =
            submission.submission.score / assignment.points_possible;
          // Deduct 10% if submission is late
          if (submission.submission.submitted_at > assignment.due_at) {
            totalScore =
              totalScore + scorePercentage * assignment.points_possible * 0.9;
          } else {
            totalScore =
              totalScore + scorePercentage * assignment.points_possible;
          }

          console.log("2" + learnerData);
          count++;
          // Add assignment score to learner data object
          learnerData[assignment.id] = scorePercentage * 1.0; // Convert to percentage
        }
      }
    });

    // Calculate weighted average score
    learnerData.avg = (totalScore / totalWeight) * 100; // Convert to percentage

    // Add learner data to result
    result.push(learnerData);
  });

  return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log("cour" + CourseInfo);

console.log(result);
