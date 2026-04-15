import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import storiesData from "./storiesData.js";
import content from "../assets/quiz_background.jpg";
import { useLanguage } from "./i18n/LanguageContext";

export default function StoryTeller() {
  const { t } = useLanguage();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState(null);

  const englishStories = Array.isArray(storiesData?.english)
    ? storiesData.english
    : [];
  const amharicStories = Array.isArray(storiesData?.amharic)
    ? storiesData.amharic
    : [];
  const allStories = [...englishStories, ...amharicStories];

  useEffect(() => {
    if (allStories.length === 0) {
      setError(t("story.noStories"));
    } else {
      setError(null);
    }
  }, [allStories.length, t]);

  const categories = [
    "All",
    ...new Set(allStories.map((story) => story.category)),
  ];
  const filteredStories =
    selectedCategory === "All"
      ? allStories
      : allStories.filter((story) => story.category === selectedCategory);

  const currentStory = filteredStories[currentStoryIndex];

  const handleNext = () => {
    if (filteredStories.length === 0) return;
    setCurrentStoryIndex((prev) => (prev + 1) % filteredStories.length);
  };

  const handlePrevious = () => {
    if (filteredStories.length === 0) return;
    setCurrentStoryIndex(
      (prev) => (prev - 1 + filteredStories.length) % filteredStories.length,
    );
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentStoryIndex(0);
  };

  const setCategory = (category) => {
    setSelectedCategory(category);
    setCurrentStoryIndex(0);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      background:
        "radial-gradient(circle at top left, rgba(255, 209, 102, 0.22), transparent 28%), radial-gradient(circle at top right, rgba(126, 211, 255, 0.2), transparent 24%), linear-gradient(135deg, #11172f 0%, #1b2550 36%, #384c7a 72%, #5f759f 100%)",
      display: "flex",
      justifyContent: "center",
      padding: "24px 18px 40px",
      fontFamily: "'Trebuchet MS', 'Verdana', sans-serif",
      color: "#fff",
    },
    ambient: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      overflow: "hidden",
    },
    blobOne: {
      position: "absolute",
      width: "280px",
      height: "280px",
      borderRadius: "50%",
      background: "rgba(255, 196, 143, 0.22)",
      top: "40px",
      left: "-90px",
      filter: "blur(10px)",
    },
    blobTwo: {
      position: "absolute",
      width: "260px",
      height: "260px",
      borderRadius: "50%",
      background: "rgba(109, 214, 255, 0.18)",
      right: "-100px",
      top: "120px",
      filter: "blur(16px)",
    },
    backgroundImage: {
      position: "absolute",
      inset: "10% 8% auto auto",
      width: "280px",
      height: "180px",
      objectFit: "cover",
      borderRadius: "28px",
      opacity: 0.14,
      filter: "blur(1px) saturate(1.2)",
      transform: "rotate(6deg)",
      boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
    },
    contentWrap: {
      position: "relative",
      zIndex: 1,
      width: "100%",
      maxWidth: "1180px",
    },
    hero: {
      display: "grid",
      gridTemplateColumns: "1.2fr 0.8fr",
      gap: "18px",
      alignItems: "stretch",
      marginTop: "70px",
      marginBottom: "22px",
    },
    heroCard: {
      background:
        "linear-gradient(145deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.08))",
      border: "1px solid rgba(255, 255, 255, 0.18)",
      borderRadius: "30px",
      padding: "24px",
      boxShadow: "0 28px 80px rgba(6, 10, 26, 0.42)",
      backdropFilter: "blur(18px)",
    },
    heroKicker: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 14px",
      borderRadius: "999px",
      background: "rgba(255, 255, 255, 0.12)",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      fontSize: "0.95rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    },
    heroTitle: {
      margin: "16px 0 10px",
      fontSize: "clamp(2.2rem, 4vw, 4.25rem)",
      lineHeight: 1.02,
      letterSpacing: "-0.04em",
      textShadow: "0 14px 30px rgba(0, 0, 0, 0.25)",
    },
    heroText: {
      margin: 0,
      fontSize: "1.08rem",
      lineHeight: 1.75,
      maxWidth: "62ch",
      color: "rgba(248, 248, 255, 0.88)",
    },
    heroMetaGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "12px",
      marginTop: "18px",
    },
    metaCard: {
      borderRadius: "22px",
      padding: "16px 14px",
      background: "rgba(8, 12, 31, 0.28)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
    },
    metaLabel: {
      display: "block",
      fontSize: "0.82rem",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "rgba(255, 255, 255, 0.64)",
      marginBottom: "6px",
    },
    metaValue: {
      fontSize: "1.1rem",
      fontWeight: 800,
      color: "#fff",
    },
    explorerCard: {
      background:
        "linear-gradient(180deg, rgba(255, 241, 217, 0.18), rgba(255, 255, 255, 0.08))",
      border: "1px solid rgba(255, 255, 255, 0.16)",
      borderRadius: "30px",
      padding: "22px",
      boxShadow: "0 28px 80px rgba(6, 10, 26, 0.34)",
      backdropFilter: "blur(18px)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: "16px",
    },
    explorerTitle: {
      margin: 0,
      fontSize: "1.2rem",
      fontWeight: 800,
      color: "#fff",
    },
    explorerText: {
      margin: 0,
      color: "rgba(255, 255, 255, 0.82)",
      lineHeight: 1.65,
    },
    progressWrap: {
      width: "100%",
      height: "12px",
      borderRadius: "999px",
      background: "rgba(255, 255, 255, 0.14)",
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      width: `${filteredStories.length ? ((currentStoryIndex + 1) / filteredStories.length) * 100 : 0}%`,
      borderRadius: "inherit",
      background:
        "linear-gradient(90deg, #ffd166 0%, #ff8f72 48%, #8be9fd 100%)",
      boxShadow: "0 0 18px rgba(255, 175, 110, 0.45)",
    },
    filterShell: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      marginBottom: "20px",
    },
    filterLabel: {
      fontSize: "1rem",
      fontWeight: 800,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "rgba(255, 255, 255, 0.78)",
    },
    selectRow: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "12px",
    },
    select: {
      padding: "12px 16px",
      fontSize: "1rem",
      borderRadius: "18px",
      border: "1px solid rgba(255, 255, 255, 0.18)",
      backgroundColor: "rgba(247, 248, 255, 0.14)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 700,
      minWidth: "220px",
      boxShadow: "0 12px 30px rgba(5, 8, 24, 0.2)",
      backdropFilter: "blur(10px)",
    },
    categoryRow: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    },
    categoryChip: {
      border: "1px solid rgba(255, 255, 255, 0.16)",
      background: "rgba(255, 255, 255, 0.1)",
      color: "#fff",
      padding: "9px 14px",
      borderRadius: "999px",
      fontWeight: 700,
      fontSize: "0.92rem",
      cursor: "pointer",
    },
    categoryChipActive: {
      background: "linear-gradient(135deg, #ffd166, #ff8f72)",
      color: "#1b2550",
      borderColor: "transparent",
      boxShadow: "0 12px 26px rgba(255, 158, 96, 0.28)",
    },
    storyCard: {
      maxWidth: "1180px",
      width: "100%",
      background:
        "linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(244, 246, 255, 0.92))",
      padding: "clamp(22px, 4vw, 34px)",
      borderRadius: "34px",
      boxShadow: "0 30px 80px rgba(8, 12, 33, 0.34)",
      border: "1px solid rgba(255, 255, 255, 0.65)",
      position: "relative",
      overflow: "hidden",
    },
    storyGlow: {
      position: "absolute",
      inset: "auto -90px -90px auto",
      width: "220px",
      height: "220px",
      background:
        "radial-gradient(circle, rgba(255, 175, 109, 0.35), transparent 66%)",
      pointerEvents: "none",
    },
    storyHead: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "16px",
      flexWrap: "wrap",
      marginBottom: "18px",
    },
    chapterBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 14px",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #283a7d, #4d5fa3)",
      color: "#fff",
      fontSize: "0.92rem",
      fontWeight: 800,
      boxShadow: "0 12px 24px rgba(40, 58, 125, 0.22)",
    },
    storyMeta: {
      textAlign: "right",
      color: "#44507d",
      fontWeight: 700,
      fontSize: "0.98rem",
    },
    storyTitle: {
      fontSize: "clamp(1.9rem, 3vw, 3.2rem)",
      color: "#1d244b",
      margin: "10px 0 14px",
      textAlign: "left",
      lineHeight: 1.08,
      letterSpacing: "-0.04em",
    },
    storyContent: {
      fontSize: "clamp(1.08rem, 1.45vw, 1.35rem)",
      color: "#2c355d",
      lineHeight: 1.9,
      textAlign: "left",
      whiteSpace: "pre-line",
      margin: 0,
      maxWidth: "80ch",
    },
    navigation: {
      marginTop: "22px",
      display: "flex",
      gap: "14px",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    navButton: {
      padding: "14px 22px",
      fontSize: "1rem",
      background: "linear-gradient(135deg, #24336d, #6278c8)",
      border: "none",
      borderRadius: "18px",
      cursor: "pointer",
      color: "white",
      fontWeight: 800,
      boxShadow: "0 14px 28px rgba(22, 35, 84, 0.28)",
      margin: 0,
    },
    navCount: {
      fontWeight: 800,
      fontSize: "1.05rem",
      color: "#f6f3ff",
      padding: "10px 14px",
      borderRadius: "999px",
      background: "rgba(255, 255, 255, 0.12)",
      border: "1px solid rgba(255, 255, 255, 0.14)",
      backdropFilter: "blur(8px)",
    },
    errorBox: {
      marginTop: "100px",
      background: "linear-gradient(135deg, #5a6fb5, #7e8fca)",
      color: "#fff",
      padding: "20px 30px",
      borderRadius: "18px",
      fontWeight: 700,
      textAlign: "center",
      fontSize: "1.5rem",
      boxShadow: "0 20px 50px rgba(6, 10, 26, 0.25)",
    },
  };

  const backLinkStyle = {
    position: "absolute",
    top: "18px",
    left: "18px",
    textDecoration: "none",
    zIndex: 10,
  };

  const buttonStyle = {
    padding: "12px 22px",
    fontSize: "1rem",
    backgroundColor: "#5a6fb5",
    border: "none",
    borderRadius: "18px",
    cursor: "pointer",
    color: "white",
    fontWeight: 800,
    boxShadow: "0px 14px 24px rgba(0,0,0,0.22)",
    margin: "0",
  };

  const backButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #11172f, #273b7d)",
  };

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.errorBox}>⚠️ {error}</p>
        <Link to="/" style={backLinkStyle}>
          <button style={backButtonStyle}>{t("story.backHome")}</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.ambient} aria-hidden="true">
        <div style={styles.blobOne} />
        <div style={styles.blobTwo} />
        <img src={content} alt="" style={styles.backgroundImage} />
      </div>

      <div style={styles.contentWrap}>
        <Link to="/" style={backLinkStyle}>
          <button style={backButtonStyle}>🏠 {t("story.backHome")}</button>
        </Link>

        <section style={styles.hero}>
          <div style={styles.heroCard}>
            <div style={styles.heroKicker}>📚 {t("story.heroKicker")}</div>
            <h1 style={styles.heroTitle}>{t("story.heroTitle")}</h1>
            <p style={styles.heroText}>{t("story.heroSubtitle")}</p>

            <div style={styles.heroMetaGrid}>
              <div style={styles.metaCard}>
                <span style={styles.metaLabel}>
                  {t("story.collectionLabel")}
                </span>
                <div style={styles.metaValue}>{allStories.length}</div>
              </div>
              <div style={styles.metaCard}>
                <span style={styles.metaLabel}>
                  {t("story.currentCategory")}
                </span>
                <div style={styles.metaValue}>{selectedCategory}</div>
              </div>
              <div style={styles.metaCard}>
                <span style={styles.metaLabel}>{t("story.currentStory")}</span>
                <div style={styles.metaValue}>
                  {filteredStories.length ? currentStoryIndex + 1 : 0}/
                  {filteredStories.length}
                </div>
              </div>
            </div>
          </div>

          <aside style={styles.explorerCard}>
            <div>
              <h2 style={styles.explorerTitle}>{t("story.explorerTitle")}</h2>
              <p style={styles.explorerText}>{t("story.explorerText")}</p>
            </div>
            <div>
              <div style={styles.progressWrap}>
                <div style={styles.progressBar} />
              </div>
              <p style={{ ...styles.explorerText, marginTop: "10px" }}>
                {filteredStories.length
                  ? `${currentStoryIndex + 1} ${t("story.of")} ${filteredStories.length}`
                  : t("story.noStory")}
              </p>
            </div>
          </aside>
        </section>

        <section style={styles.filterShell}>
          <div style={styles.selectRow}>
            <div style={styles.filterLabel}>{t("story.chooseType")}</div>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={styles.select}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.categoryRow}>
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setCategory(category)}
                  style={{
                    ...styles.categoryChip,
                    ...(active ? styles.categoryChipActive : {}),
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        <div style={styles.storyCard}>
          <div style={styles.storyGlow} aria-hidden="true" />
          <div style={styles.storyHead}>
            <div>
              <div style={styles.chapterBadge}>
                ✨ {currentStory?.category || t("story.noStory")}
              </div>
              <h2 style={styles.storyTitle}>
                {currentStory?.title || t("story.noStory")}
              </h2>
            </div>
            <div style={styles.storyMeta}>
              <div>
                {t("story.storyCount")}{" "}
                {filteredStories.length ? currentStoryIndex + 1 : 0}
              </div>
              <div>
                {t("story.of")} {filteredStories.length}
              </div>
            </div>
          </div>

          <p style={styles.storyContent}>
            {currentStory?.content || t("story.noContent")}
          </p>

          <div style={styles.navigation}>
            <button
              onClick={handlePrevious}
              disabled={filteredStories.length <= 1 || currentStoryIndex === 0}
              style={{
                ...buttonStyle,
                ...styles.navButton,
                opacity:
                  filteredStories.length <= 1 || currentStoryIndex === 0
                    ? 0.55
                    : 1,
              }}
            >
              ⬅️ {t("story.previous")}
            </button>
            <span style={styles.navCount}>
              {filteredStories.length ? currentStoryIndex + 1 : 0} /{" "}
              {filteredStories.length}
            </span>
            <button
              onClick={handleNext}
              disabled={
                filteredStories.length <= 1 ||
                currentStoryIndex === filteredStories.length - 1
              }
              style={{
                ...buttonStyle,
                ...styles.navButton,
                opacity:
                  filteredStories.length <= 1 ||
                  currentStoryIndex === filteredStories.length - 1
                    ? 0.55
                    : 1,
              }}
            >
              {t("story.next")} ➡️
            </button>
          </div>
        </div>

        <p
          style={{
            fontSize: "1rem",
            color: "rgba(255,255,255,0.82)",
            marginTop: "18px",
            textAlign: "center",
          }}
        >
          {t("story.comingSoon")} ✨
        </p>
      </div>
    </div>
  );
}
