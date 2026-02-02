import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import quiz from "../assets/quiz.jpg";
import quizDataJson from "../../quizData.json";

const quizData = {
  quizTitle: "Trivia Quiz",
  questions: quizDataJson,
};

export default function QuizApp() {
  const categories = [
    "All",
    ...new Set(quizData.questions.map((q) => q.category || "General")),
  ];

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const saved = sessionStorage.getItem("quizSelectedCategory");
    return saved || "All";
  });

  const filteredQuestions =
    selectedCategory === "All"
      ? quizData.questions
      : quizData.questions.filter(
          (q) => (q.category || "General") === selectedCategory,
        );

  const [currentQIndex, setCurrentQIndex] = useState(() => {
    const saved = sessionStorage.getItem("quizCurrentQIndex");
    return saved ? parseInt(saved) : 0;
  });
  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = sessionStorage.getItem("quizUserAnswers");
    return saved ? JSON.parse(saved) : {};
  });
  const [showResults, setShowResults] = useState(() => {
    const saved = sessionStorage.getItem("quizShowResults");
    return saved ? JSON.parse(saved) : false;
  });
  const [score, setScore] = useState(() => {
    const saved = sessionStorage.getItem("quizScore");
    return saved ? parseInt(saved) : 0;
  });

  const currentQuestion = filteredQuestions[currentQIndex];

  useEffect(() => {
    sessionStorage.setItem("quizSelectedCategory", selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    sessionStorage.setItem("quizCurrentQIndex", currentQIndex);
  }, [currentQIndex]);

  useEffect(() => {
    sessionStorage.setItem("quizUserAnswers", JSON.stringify(userAnswers));
  }, [userAnswers]);

  useEffect(() => {
    sessionStorage.setItem("quizShowResults", JSON.stringify(showResults));
  }, [showResults]);

  useEffect(() => {
    sessionStorage.setItem("quizScore", score);
  }, [score]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    // Reset quiz progress when category changes
    setCurrentQIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

  useEffect(() => {
    sessionStorage.setItem("quizCurrentQIndex", currentQIndex);
  }, [currentQIndex]);

  useEffect(() => {
    sessionStorage.setItem("quizUserAnswers", JSON.stringify(userAnswers));
  }, [userAnswers]);

  useEffect(() => {
    sessionStorage.setItem("quizShowResults", JSON.stringify(showResults));
  }, [showResults]);

  useEffect(() => {
    sessionStorage.setItem("quizScore", score);
  }, [score]);

  const handleOptionClick = (optionIndex) => {
    setUserAnswers({
      ...userAnswers,
      [currentQIndex]: optionIndex,
    });
  };

  const nextQuestion = () => {
    if (currentQIndex < filteredQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const finishQuiz = () => {
    let correct = 0;
    let answeredQuestions = 0;

    // Count how many questions have been answered
    filteredQuestions.forEach((q, i) => {
      if (userAnswers[i] !== undefined) {
        answeredQuestions++;
        if (userAnswers[i] === q.correctAnswerIndex) {
          correct++;
        }
      }
    });

    setScore(correct);
    setShowResults(true);
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const isAnswerCorrect = (optionIndex) => {
    return optionIndex === currentQuestion.correctAnswerIndex;
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundimage: `(url${quiz}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 20,
    },
    button: {
      padding: "10px 18px",
      fontSize: "1rem",
      backgroundColor: "#000066",
      color: "white",
      border: "none",
      borderRadius: 12,
      cursor: "pointer",
      margin: 5,
    },
    optionBtn: {
      padding: "10px 14px",
      fontSize: "1rem",
      margin: "8px 0",
      backgroundColor: "#003366",
      color: "white",
      borderRadius: 10,
      cursor: "pointer",
      width: "100%",
      maxWidth: 400,
    },
    backButton: {
      padding: "8px 16px",
      fontSize: "1rem",
      backgroundColor: "#00FFFF",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      color: "white",
      fontWeight: "bold",
      boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
    },

    selected: {
      backgroundColor: "#0055AA",
    },
    correct: {
      backgroundColor: "green",
    },
    incorrect: {
      backgroundColor: "red",
    },
    questionCard: {
      backgroundColor: "#004080",
      padding: 20,
      borderRadius: 16,
      color: "white",
      width: "90%",
      maxWidth: 600,
      marginBottom: 20,
    },
  };

  return (
    <div style={styles.container}>
      <Link to="/" style={{ position: "absolute", top: 20, left: 10 }}>
        <button style={styles.backButton}>⬅️ Back Home</button>
      </Link>
      <div style={{ marginBottom: 20, marginTop: 60 }}>
        <label
          htmlFor="category-select"
          style={{ color: "white", fontSize: "1.2rem" }}
        >
          Select Category:{" "}
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ padding: "5px", fontSize: "1rem" }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {filteredQuestions.length === 0 ? (
        <div style={{ ...styles.questionCard, fontSize: "1.5rem" }}>
          No questions available in this category. Please select another
          category.
        </div>
      ) : showResults ? (
        <div style={{ ...styles.questionCard, fontSize: "1.5rem" }}>
          📝 You scored {score} out of {Object.keys(userAnswers).length}
          {/* Display answers count instead of total questions */}
          <div>
            <button onClick={restartQuiz} style={styles.button}>
              🔁 Restart
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={styles.questionCard}>
            <h2>{quizData.quizTitle}</h2>
            <h3>
              {currentQIndex + 1}. {currentQuestion.question}
            </h3>
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(i)}
                style={{
                  ...styles.optionBtn,
                  ...(userAnswers[currentQIndex] === i ? styles.selected : {}),
                  ...(userAnswers[currentQIndex] !== undefined
                    ? isAnswerCorrect(i)
                      ? styles.correct
                      : styles.incorrect
                    : {}),
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          <div>
            {currentQIndex > 0 && (
              <button onClick={prevQuestion} style={styles.button}>
                ⬅️ Previous
              </button>
            )}
            {currentQIndex < quizData.questions.length - 1 && (
              <button onClick={nextQuestion} style={styles.button}>
                ➡️ Next
              </button>
            )}
            <button onClick={finishQuiz} style={styles.button}>
              ✅ Finish & Show Results
            </button>
          </div>
        </>
      )}
    </div>
  );
}
