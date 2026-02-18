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
    return saved ? parseInt(saved, 10) : 0;
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

  const safeCurrentQIndex =
    filteredQuestions.length === 0
      ? 0
      : Math.min(currentQIndex, filteredQuestions.length - 1);
  const currentQuestion = filteredQuestions[safeCurrentQIndex];

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
    setCurrentQIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

  useEffect(() => {
    if (filteredQuestions.length === 0) {
      if (currentQIndex !== 0) setCurrentQIndex(0);
      return;
    }
    const lastIndex = filteredQuestions.length - 1;
    if (currentQIndex > lastIndex) {
      setCurrentQIndex(lastIndex);
    }
  }, [filteredQuestions.length, currentQIndex]);

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
      [safeCurrentQIndex]: optionIndex,
    });
  };

  const nextQuestion = () => {
    if (safeCurrentQIndex < filteredQuestions.length - 1) {
      setCurrentQIndex(safeCurrentQIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (safeCurrentQIndex > 0) {
      setCurrentQIndex(safeCurrentQIndex - 1);
    }
  };

  const finishQuiz = () => {
    let correct = 0;
    let answeredQuestions = 0;

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
    return currentQuestion
      ? optionIndex === currentQuestion.correctAnswerIndex
      : false;
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundImage: `url(${quiz})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 20,
    },
    button: {
      padding: "10px 18px",
      fontSize: "1rem",
      backgroundColor: "#ff3b4a",
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
      backgroundColor: "#2f8cff",
      color: "#fff",
      borderRadius: 10,
      cursor: "pointer",
      width: "100%",
      maxWidth: 400,
    },
    backButton: {
      padding: "8px 16px",
      fontSize: "1rem",
      backgroundColor: "#ff5fbf",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      color: "white",
      fontWeight: "bold",
      boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
    },

    selected: {
      backgroundColor: "#ff5fbf",
    },
    correct: {
      backgroundColor: "#43c465",
    },
    incorrect: {
      backgroundColor: "#ff5d6c",
    },
    questionCard: {
      background: "linear-gradient(140deg, #fffdf8 0%, #ffe8f6 48%, #fff2b1 100%)",
      padding: 20,
      borderRadius: 16,
      color: "#4a1b5f",
      width: "90%",
      maxWidth: 600,
      marginBottom: 20,
      border: "2px solid #ffd93d",
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
          style={{ color: "#fff8cf", fontSize: "1.2rem", fontWeight: "bold" }}
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
              {safeCurrentQIndex + 1}. {currentQuestion.question}
            </h3>
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(i)}
                style={{
                  ...styles.optionBtn,
                  ...(userAnswers[safeCurrentQIndex] === i
                    ? styles.selected
                    : {}),
                  ...(userAnswers[safeCurrentQIndex] !== undefined
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
            {safeCurrentQIndex > 0 && (
              <button onClick={prevQuestion} style={styles.button}>
                ⬅️ Previous
              </button>
            )}
            {safeCurrentQIndex < filteredQuestions.length - 1 && (
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
