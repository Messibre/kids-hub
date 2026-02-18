import { Link } from "react-router-dom";
import { useLanguage } from "./i18n/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <section className="home">
      <div className="home-card">
        <h1 className="home-title">{t("home.title")}</h1>
        <p className="home-subtitle">
          {t("home.subtitle")}
        </p>
        <p className="home-prompt">{t("home.prompt")}</p>

        <div className="home-grid">
          <Link to="/painting">
            <button className="home-action-btn">{t("home.paint")}</button>
          </Link>
          <Link to="/quiz">
            <button className="home-action-btn">{t("home.quiz")}</button>
          </Link>
          <Link to="/story">
            <button className="home-action-btn">{t("home.story")}</button>
          </Link>
          <Link to="/piano">
            <button className="home-action-btn">{t("home.piano")}</button>
          </Link>
        </div>

        <footer className="home-footer">
          <p>
            {t("home.credit")}
            <br />
            messibre21@gmail.com
          </p>
        </footer>
      </div>
    </section>
  );
}
