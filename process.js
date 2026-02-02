import XLSX from "xlsx";
import fs from "fs";

const workbook = XLSX.readFile("Questions-main.xlsx");
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

const quizData = [];

data.forEach((row) => {
  const content = row["Literature Trivia "];
  if (content && content.includes("|")) {
    const parts = content.split("|").map((p) => p.trim());
    if (parts.length >= 6) {
      const question = parts[2];
      const options = [parts[3], parts[4], parts[5]];
      const answer = parts[parts.length - 1];
      const correctIndex = options.indexOf(answer);
      if (correctIndex !== -1 && question && options.every((opt) => opt)) {
        quizData.push({
          question,
          options,
          correctAnswerIndex: correctIndex,
        });
      }
    }
  }
});

fs.writeFileSync("quizData.json", JSON.stringify(quizData, null, 2));
console.log(`Extracted ${quizData.length} questions`);
