import { Link } from "react-router-dom";

export default function HomePage() {
  const buttonStyle = {
    padding: "10px 18px",
    fontSize: "1rem",
    backgroundColor: "#000066",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
    margin: "5px",
  };
  return (
    <div className="home">
      <h1 style={{ fontSize: "3rem", color: "#ff6f61" }}>
        Welcome to Kids hub! 🎈
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          margin: "1rem 0",
          color: "#333",
          fontStyle: "italic",
        }}
      >
        Playing as Guest – Sign up to save your progress and creations!
      </p>
      <p style={{ fontSize: "1.5rem", margin: "1rem 0", color: "#0000ff" }}>
        Pick your magical adventure:
      </p>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <Link to="/painting">
          <button style={buttonStyle}>🎨 Paint like Picasso!</button>
        </Link>
        <Link to="/quiz">
          <button style={buttonStyle}>🧠 Brainy Quiz Time!</button>
        </Link>

        <Link to="/story">
          <button style={buttonStyle}>📖 Story Magic!</button>
        </Link>
        <Link to="/piano">
          <button style={buttonStyle}>🎹 Play Piano!</button>
        </Link>
      </div>
      <footer>
        <p
          style={{
            fontSize: "1rem",
            fontFamily: "amatic sc",
            color: "#ff6f61",
          }}
        >
          Brought to life by Meseret Birhanu <br /> messibre21@gmail.com
        </p>
      </footer>
    </div>
  );
}
