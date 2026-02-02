import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import quiz from "../assets/quiz.jpg";

const quizData = {
  quizTitle: "General Knowledge Quiz",
  questions: [
    {
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correctAnswerIndex: 1,
    },
    {
      question: "What color are bananas when they are ripe?",
      options: ["Red", "Blue", "Yellow", "Purple"],
      correctAnswerIndex: 2,
    },
    {
      question: "Which animal is known as the King of the Jungle?",
      options: ["Elephant", "Lion", "Tiger", "Bear"],
      correctAnswerIndex: 1,
    },
    {
      question: "How many legs does a spider have?",
      options: ["6", "8", "10", "12"],
      correctAnswerIndex: 1,
    },
    {
      question: "What is H2O commonly known as?",
      options: ["Fire", "Salt", "Water", "Oxygen"],
      correctAnswerIndex: 2,
    },
    {
      question: "What planet do we live on?",
      options: ["Mars", "Earth", "Venus", "Jupiter"],
      correctAnswerIndex: 1,
    },
    {
      question: "Which shape has three sides?",
      options: ["Square", "Triangle", "Circle", "Rectangle"],
      correctAnswerIndex: 1,
    },
    {
      question: "What do bees make?",
      options: ["Milk", "Cheese", "Honey", "Juice"],
      correctAnswerIndex: 2,
    },
    {
      question: "How many days are there in a week?",
      options: ["5", "6", "7", "8"],
      correctAnswerIndex: 2,
    },
    {
      question: "Which season comes after summer?",
      options: ["Winter", "Spring", "Fall", "Monsoon"],
      correctAnswerIndex: 2,
    },
    {
      question: "What is the opposite of 'up'?",
      options: ["Side", "Down", "Around", "Left"],
      correctAnswerIndex: 1,
    },
    {
      question: "Which bird can mimic human speech?",
      options: ["Eagle", "Sparrow", "Parrot", "Penguin"],
      correctAnswerIndex: 2,
    },
    {
      question: "What type of animal is a whale?",
      options: ["Fish", "Mammal", "Reptile", "Bird"],
      correctAnswerIndex: 1,
    },
    {
      question: "What is the main ingredient in bread?",
      options: ["Flour", "Sugar", "Salt", "Milk"],
      correctAnswerIndex: 0,
    },
    {
      question: "Which is the largest planet in our solar system?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswerIndex: 2,
    },
    {
      question: "Which ocean is the biggest?",
      options: ["Atlantic", "Pacific", "Indian", "Arctic"],
      correctAnswerIndex: 1,
    },
    {
      question: "What color is the sky on a clear sunny day?",
      options: ["Green", "Blue", "Purple", "Yellow"],
      correctAnswerIndex: 1,
    },
    {
      question: "Which holiday involves a jolly man in a red suit?",
      options: ["Halloween", "Thanksgiving", "Christmas", "Easter"],
      correctAnswerIndex: 2,
    },
    {
      question: "Which fruit is known for being sour and yellow?",
      options: ["Apple", "Banana", "Lemon", "Grapes"],
      correctAnswerIndex: 2,
    },
    {
      question: "What do you call a house made of ice?",
      options: ["Igloo", "Cabin", "Tent", "Castle"],
      correctAnswerIndex: 0,
    },
    {
      question: "How many fingers do humans usually have in total?",
      options: ["8", "10", "12", "5"],
      correctAnswerIndex: 1,
    },
    {
      question: "What is the freezing point of water?",
      options: ["0°C", "100°C", "50°C", "10°C"],
      correctAnswerIndex: 0,
    },
    {
      question: "Which animal is famous for jumping and having a pouch?",
      options: ["Koala", "Kangaroo", "Dog", "Cat"],
      correctAnswerIndex: 1,
    },
    {
      question: "What do caterpillars turn into?",
      options: ["Flies", "Moths", "Butterflies", "Spiders"],
      correctAnswerIndex: 2,
    },
    {
      question: "What is the tallest animal in the world?",
      options: ["Elephant", "Giraffe", "Kangaroo", "Horse"],
      correctAnswerIndex: 1,
    },
    {
      question: "Which day comes after Friday?",
      options: ["Sunday", "Monday", "Saturday", "Thursday"],
      correctAnswerIndex: 2,
    },
    {
      question: "Which vehicle flies in the sky?",
      options: ["Car", "Boat", "Plane", "Train"],
      correctAnswerIndex: 2,
    },
    {
      question: "Which superhero is known as the 'Caped Crusader'?",
      options: ["Superman", "Batman", "Spiderman", "Ironman"],
      correctAnswerIndex: 1,
    },
    {
      question: "Which country is famous for pizza?",
      options: ["France", "Italy", "China", "India"],
      correctAnswerIndex: 1,
    },
    {
      question: "What color are most leaves?",
      options: ["Red", "Yellow", "Green", "Blue"],
      correctAnswerIndex: 2,
    },
    {
      question: "What is the name of the fairy in Peter Pan?",
      options: ["Cinderella", "Tinker Bell", "Elsa", "Moana"],
      correctAnswerIndex: 1,
    },
  ],
};
export default function QuizApp() {
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
  const currentQuestion = quizData.questions[currentQIndex];

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
    if (currentQIndex < quizData.questions.length - 1) {
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
    quizData.questions.forEach((q, i) => {
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
      {showResults ? (
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
