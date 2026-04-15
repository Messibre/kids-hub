import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import quiz from "../assets/quiz.jpg";
import quizDataJson from "../../quizData.json";
import { useLanguage } from "./i18n/LanguageContext";
import { getToken } from "./utils/jwt";
import {
  createQuizHistory,
  fetchMyBestQuizStats,
  fetchMyOverallRank,
  fetchMyQuizHistory,
} from "./api/quizHistory";

const quizData = {
  quizTitle: "Trivia Quiz",
  questions: quizDataJson,
};

export default function QuizApp() {
  const { t } = useLanguage();
  const token = getToken();
  const isLoggedIn = Boolean(token);

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
  const [answeredCount, setAnsweredCount] = useState(() => {
    const saved = sessionStorage.getItem("quizAnsweredCount");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [bestStats, setBestStats] = useState(null);
  const [rankStats, setRankStats] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isDesktopLayout, setIsDesktopLayout] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false,
  );

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
  useEffect(() => {
    sessionStorage.setItem("quizAnsweredCount", answeredCount);
  }, [answeredCount]);

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
    const handleResize = () => {
      setIsDesktopLayout(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadStats = async () => {
    if (!token) {
      setBestStats(null);
      setRankStats(null);
      setStatsError("");
      return;
    }

    setStatsLoading(true);
    setStatsError("");

    try {
      const [best, rank] = await Promise.all([
        fetchMyBestQuizStats(token),
        fetchMyOverallRank(token),
      ]);

      const history = await fetchMyQuizHistory(
        token,
        selectedCategory === "All" ? "" : selectedCategory,
      );

      setBestStats(best);
      setRankStats(rank);
      setHistoryItems(history);
    } catch (error) {
      setStatsError(error?.message || t("quiz.statsError"));
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedCategory]);

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
    setAnsweredCount(answeredQuestions);
    setShowResults(true);

    if (token && answeredQuestions > 0) {
      createQuizHistory({
        token,
        category: selectedCategory === "All" ? "Mixed" : selectedCategory,
        numberQuestionsDid: answeredQuestions,
        numberQuestionsGot: correct,
      })
        .then(() => {
          setSaveMessage(t("quiz.savedHistory"));
          loadStats();
        })
        .catch((error) => {
          setSaveMessage(error?.message || t("quiz.saveError"));
        });
    } else if (!token) {
      setSaveMessage(t("quiz.loginToSave"));
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setAnsweredCount(0);
    setSaveMessage("");
    setShowLeaderboard(false);
  };

  const isAnswerCorrect = (optionIndex) => {
    return currentQuestion
      ? optionIndex === currentQuestion.correctAnswerIndex
      : false;
  };

  const getOptionStyle = (optionIndex) => {
    const selectedIndex = userAnswers[safeCurrentQIndex];
    const isSelected = selectedIndex === optionIndex;

    if (!isSelected) return {};

    return isAnswerCorrect(optionIndex) ? styles.correct : styles.incorrect;
  };

  const topThree = Array.isArray(rankStats?.leaderboard)
    ? rankStats.leaderboard.slice(0, 3)
    : [];

  const bestByCategory = Array.isArray(bestStats?.bestByCategory)
    ? bestStats.bestByCategory
    : [];

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundImage: `linear-gradient(rgba(246, 243, 255, 0.68), rgba(246, 243, 255, 0.62)), url(${quiz})`,
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
      width: "100%",
      maxWidth: "100%",
      marginBottom: 20,
      border: "2px solid #8ea2bd",
    },
    statsCard: {
      background: "rgba(248, 243, 255, 0.95)",
      border: "2px solid #8ea2bd",
      borderRadius: 12,
      width: "100%",
      maxWidth: "100%",
      padding: 14,
      marginBottom: 14,
      color: "#1b1f40",
      fontSize: "0.94rem",
    },
    leaderboardItem: {
      display: "flex",
      justifyContent: "space-between",
      gap: 10,
      padding: "6px 0",
      borderBottom: "1px solid rgba(92, 110, 160, 0.25)",
      fontSize: "0.88rem",
    },
    subtleText: {
      fontSize: "0.82rem",
      opacity: 0.92,
      marginTop: 4,
    },
    categoryChip: {
      display: "inline-block",
      marginRight: 6,
      marginTop: 6,
      padding: "4px 8px",
      borderRadius: 999,
      background: "rgba(90, 111, 181, 0.14)",
      border: "1px solid rgba(90, 111, 181, 0.3)",
      fontSize: "0.8rem",
      fontWeight: 600,
    },
    panelsWrap: {
      width: "92%",
      maxWidth: 1180,
      display: "grid",
      gap: 14,
      gridTemplateColumns: isDesktopLayout
        ? "minmax(300px, 0.95fr) minmax(460px, 1.45fr)"
        : "1fr",
      alignItems: "start",
    },
    panelSticky: {
      position: isDesktopLayout ? "sticky" : "static",
      top: isDesktopLayout ? 82 : "auto",
    },
  };

  const quizMainCard =
    filteredQuestions.length === 0 ? (
      <div style={{ ...styles.questionCard, fontSize: "1.1rem" }}>
        {t("quiz.noQuestions")}
      </div>
    ) : showResults ? (
      <div style={{ ...styles.questionCard, fontSize: "1.2rem" }}>
        📝 {t("quiz.scored")} {score} {t("quiz.outOf")} {answeredCount}
        <div style={{ fontSize: "0.95rem", marginTop: 10 }}>{saveMessage}</div>
        {statsLoading && (
          <div style={{ fontSize: "0.92rem", marginTop: 8 }}>
            {t("quiz.loadingStats")}
          </div>
        )}
        {statsError && (
          <div style={{ fontSize: "0.92rem", marginTop: 8, color: "#8b1c1c" }}>
            {statsError}
          </div>
        )}
        {rankStats?.leaderboard?.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => setShowLeaderboard((prev) => !prev)}
              style={{
                ...styles.button,
                fontSize: "0.9rem",
                padding: "8px 14px",
              }}
            >
              {showLeaderboard
                ? t("quiz.hideLeaderboard")
                : t("quiz.showLeaderboard")}
            </button>
            {showLeaderboard && (
              <div style={{ marginTop: 6, fontSize: "0.88rem" }}>
                {rankStats.leaderboard.map((entry, index) => (
                  <div
                    key={entry.userId || index}
                    style={styles.leaderboardItem}
                  >
                    <span>
                      #{index + 1} {entry.username || "User"}
                    </span>
                    <span>{entry.bestScore}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
    );

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

      <div style={styles.panelsWrap}>
        <div style={styles.panelSticky}>
          <div style={styles.statsCard}>
            <div style={{ fontWeight: "bold", marginBottom: 6 }}>
              {t("quiz.progressTitle")}
            </div>
            {!isLoggedIn && <div>{t("quiz.loginToSave")}</div>}
            {isLoggedIn && statsLoading && <div>{t("quiz.loadingStats")}</div>}
            {isLoggedIn &&
              !statsLoading &&
              !bestStats?.bestOverall &&
              !rankStats?.rank && <div>{t("quiz.noHistoryYet")}</div>}
            {isLoggedIn && bestStats?.bestOverall && (
              <div>
                {t("quiz.bestScore")}:{" "}
                {bestStats.bestOverall.numberQuestionsGot}/
                {bestStats.bestOverall.numberQuestionsDid} (
                {bestStats.bestOverall.scorePercent}%)
              </div>
            )}
            {isLoggedIn && rankStats?.rank && (
              <div>
                {t("quiz.myRank")}: #{rankStats.rank} /{" "}
                {rankStats.totalRankedUsers}
              </div>
            )}
            {isLoggedIn && topThree.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: "bold" }}>{t("quiz.topThree")}</div>
                {topThree.map((entry, index) => (
                  <div key={entry.userId || index} style={styles.subtleText}>
                    #{index + 1} {entry.username || "User"} - {entry.bestScore}%
                  </div>
                ))}
              </div>
            )}
            {isLoggedIn && bestByCategory.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: "bold" }}>
                  {t("quiz.bestByCategory")}
                </div>
                <div>
                  {bestByCategory.slice(0, 6).map((entry) => (
                    <span key={entry.category} style={styles.categoryChip}>
                      {entry.category}: {entry.bestAttempt?.scorePercent ?? 0}%
                    </span>
                  ))}
                </div>
              </div>
            )}
            {isLoggedIn && historyItems.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: "bold" }}>
                  {t("quiz.recentAttempts")}
                </div>
                {historyItems.slice(0, 3).map((item) => (
                  <div key={item._id} style={styles.subtleText}>
                    {item.category}: {item.numberQuestionsGot}/
                    {item.numberQuestionsDid} ({item.scorePercent}%)
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>{quizMainCard}</div>
      </div>
    </div>
  );
}
