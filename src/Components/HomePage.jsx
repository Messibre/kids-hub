import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="home">
      <div className="home-card">
        <h1 className="home-title">Welcome to Kids Hub</h1>
        <p className="home-subtitle">
          Playing as guest - sign up to save your progress and creations.
        </p>
        <p className="home-prompt">Pick your magical adventure:</p>

        <div className="home-grid">
          <Link to="/painting">
            <button className="home-action-btn">Paint like Picasso</button>
          </Link>
          <Link to="/quiz">
            <button className="home-action-btn">Brainy Quiz Time</button>
          </Link>
          <Link to="/story">
            <button className="home-action-btn">Story Magic</button>
          </Link>
          <Link to="/piano">
            <button className="home-action-btn">Play Piano</button>
          </Link>
        </div>

        <footer className="home-footer">
          <p>
            Brought to life by Meseret Birhanu
            <br />
            messibre21@gmail.com
          </p>
        </footer>
      </div>
    </section>
  );
}
