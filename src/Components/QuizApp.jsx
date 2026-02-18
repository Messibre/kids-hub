import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import quiz from "../assets/quiz.jpg";
import quizDataJson from "../../quizData.json";
import { useLanguage } from "./i18n/LanguageContext";

const quizData = {
  quizTitle: "Trivia Quiz",
  questions: quizDataJson,
};

export default function QuizApp() {
  const { t } = useLanguage();
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

  const getOptionStyle = (optionIndex) => {
    const selectedIndex = userAnswers[safeCurrentQIndex];
    const isSelected = selectedIndex === optionIndex;

    if (!showResults) {
      return isSelected ? styles.selected : {};
    }

    if (isAnswerCorrect(optionIndex)) {
      return styles.correct;
    }

    if (isSelected && !isAnswerCorrect(optionIndex)) {
      return styles.incorrect;
    }

    return {};
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
      backgroundColor: "#5a6fb5",
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
      backgroundColor: "#8ea2bd",
      color: "#fff",
      border: "2px solid #c7b8ef",
      borderRadius: 10,
      cursor: "pointer",
      width: "100%",
      maxWidth: 400,
    },
    backButton: {
      padding: "8px 16px",
      fontSize: "1rem",
      backgroundColor: "#252a56",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      color: "white",
      fontWeight: "bold",
      boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
    },

    selected: {
      backgroundColor: "#5a6fb5",
      border: "2px solid #ffffff",
      boxShadow: "0 0 0 3px rgba(255, 226, 207, 0.7)",
    },
    correct: {
      backgroundColor: "#7ca98f",
    },
    incorrect: {
      backgroundColor: "#9d6f87",
    },
    questionCard: {
      background:
        "linear-gradient(140deg, #f6f3ff 0%, #e9deff 50%, #ffe2cf 100%)",
      padding: 20,
      borderRadius: 16,
      color: "#1b1f40",
      width: "90%",
      maxWidth: 600,
      marginBottom: 20,
      border: "2px solid #8ea2bd",
    },
  };

  return (
    <div style={styles.container}>
      <Link to="/" style={{ position: "absolute", top: 20, left: 10 }}>
        <button style={styles.backButton}>⬅️ {t("quiz.backHome")}</button>
      </Link>
      <div style={{ marginBottom: 20, marginTop: 60 }}>
        <label
          htmlFor="category-select"
          style={{ color: "#f6f3ff", fontSize: "1.2rem", fontWeight: "bold" }}
        >
          {t("quiz.selectCategory")}{" "}
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
          {t("quiz.noQuestions")}
        </div>
      ) : showResults ? (
        <div style={{ ...styles.questionCard, fontSize: "1.5rem" }}>
          📝 {t("quiz.scored")} {score} {t("quiz.outOf")}{" "}
          {Object.keys(userAnswers).length}
          {/* Display answers count instead of total questions */}
          <div>
            <button onClick={restartQuiz} style={styles.button}>
              🔁 {t("quiz.restart")}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={styles.questionCard}>
            <h2>{t("quiz.title")}</h2>
            <h3>
              {safeCurrentQIndex + 1}. {currentQuestion.question}
            </h3>
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(i)}
                style={{
                  ...styles.optionBtn,
                  ...getOptionStyle(i),
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          <div>
            {safeCurrentQIndex > 0 && (
              <button onClick={prevQuestion} style={styles.button}>
                ⬅️ {t("quiz.previous")}
              </button>
            )}
            {safeCurrentQIndex < filteredQuestions.length - 1 && (
              <button onClick={nextQuestion} style={styles.button}>
                ➡️ {t("quiz.next")}
              </button>
            )}
            <button onClick={finishQuiz} style={styles.button}>
              ✅ {t("quiz.finish")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
