import fs from "fs";

const data = JSON.parse(fs.readFileSync("quizData.json", "utf8"));

data.forEach((q) => {
  const lowerQ = q.question.toLowerCase();
  if (
    lowerQ.includes("nobel") ||
    lowerQ.includes("book") ||
    lowerQ.includes("author") ||
    lowerQ.includes("literature") ||
    lowerQ.includes("poet") ||
    lowerQ.includes("novel")
  ) {
    q.category = "Literature";
  } else if (
    lowerQ.includes("science") ||
    lowerQ.includes("physics") ||
    lowerQ.includes("chemistry") ||
    lowerQ.includes("biology") ||
    lowerQ.includes("astronomy") ||
    lowerQ.includes("mathematics") ||
    lowerQ.includes("math")
  ) {
    q.category = "Science";
  } else if (
    lowerQ.includes("history") ||
    lowerQ.includes("war") ||
    lowerQ.includes("president") ||
    lowerQ.includes("king") ||
    lowerQ.includes("empire")
  ) {
    q.category = "History";
  } else if (
    lowerQ.includes("geography") ||
    lowerQ.includes("country") ||
    lowerQ.includes("city") ||
    lowerQ.includes("continent") ||
    lowerQ.includes("ocean")
  ) {
    q.category = "Geography";
  } else if (
    lowerQ.includes("sport") ||
    lowerQ.includes("football") ||
    lowerQ.includes("olympic") ||
    lowerQ.includes("game")
  ) {
    q.category = "Sports";
  } else {
    q.category = "General Knowledge";
  }
});

fs.writeFileSync("quizData.json", JSON.stringify(data, null, 2));

console.log("Categories added!");
