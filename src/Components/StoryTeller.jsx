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
        "linear-gradient(135deg, #0F172E 0%, #1E3A8A 36%, #1E40AF 72%, #3B82F6 100%)",
      display: "flex",
      justifyContent: "center",
      padding: "24px 18px 40px",
      fontFamily: "'Baloo 2', cursive",
      color: "#fff",
    },
    ambient: {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
    },
    backgroundImage: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: 0.08,
      zIndex: 0,
    },
    blobOne: {
      position: "absolute",
      width: "280px",
      height: "280px",
      borderRadius: "50%",
      background: "rgba(59, 130, 246, 0.15)",
      top: "40px",
      left: "-90px",
      filter: "blur(10px)",
    },
    blobTwo: {
      position: "absolute",
      width: "260px",
      height: "260px",
      borderRadius: "50%",
      background: "rgba(6, 182, 212, 0.12)",
      right: "-100px",
      top: "120px",
      filter: "blur(16px)",
    },
    contentWrap: {
      position: "relative",
      zIndex: 2,
      maxWidth: "900px",
      width: "100%",
    },
    hero: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "30px",
      alignItems: "start",
    },
    heroCard: {
      background: "rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      borderRadius: "18px",
      padding: "24px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    },
    heroKicker: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 12px",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #1E40AF, #3B82F6)",
      color: "#fff",
      fontSize: "0.85rem",
      fontWeight: 700,
      marginBottom: "12px",
      boxShadow: "0 8px 16px rgba(59, 130, 246, 0.2)",
    },
    heroTitle: {
      fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
      fontWeight: 800,
      margin: "0 0 10px 0",
      lineHeight: 1.2,
    },
    heroText: {
      fontSize: "0.95rem",
      opacity: 0.95,
      margin: "0 0 16px 0",
      lineHeight: 1.5,
    },
    heroMetaGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
      marginTop: "16px",
    },
    metaCard: {
      background: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "12px",
      padding: "12px",
      textAlign: "center",
    },
    metaLabel: {
      display: "block",
      fontSize: "0.75rem",
      opacity: 0.8,
      marginBottom: "6px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    metaValue: {
      fontSize: "1.4rem",
      fontWeight: 800,
    },
    explorerCard: {
      background: "rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      borderRadius: "18px",
      padding: "24px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    explorerTitle: {
      fontSize: "1.2rem",
      fontWeight: 800,
      margin: 0,
    },
    explorerText: {
      fontSize: "0.9rem",
      opacity: 0.9,
      margin: 0,
      lineHeight: 1.5,
    },
    progressWrap: {
      width: "100%",
      height: "8px",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "999px",
      overflow: "hidden",
      marginTop: "12px",
    },
    progressBar: {
      height: "100%",
      background: "linear-gradient(90deg, #10B981, #3B82F6)",
      width: `${filteredStories.length ? ((currentStoryIndex + 1) / filteredStories.length) * 100 : 0}%`,
      transition: "width 300ms ease-out",
      borderRadius: "999px",
    },
    filterShell: {
      background: "rgba(255, 255, 255, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "30px",
    },
    selectRow: {
      display: "none",
    },
    categoryRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      justifyContent: "center",
    },
    categoryChip: {
      padding: "10px 16px",
      fontSize: "0.9rem",
      fontWeight: 700,
      border: "2px solid rgba(255, 255, 255, 0.3)",
      background: "transparent",
      color: "white",
      borderRadius: "999px",
      cursor: "pointer",
      transition: "all 200ms ease-out",
    },
    categoryChipActive: {
      background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
      border: "2px solid #FFFFFF",
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)",
    },
    storyCard: {
      background: "rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      borderRadius: "18px",
      padding: "32px",
      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
      position: "relative",
      overflow: "hidden",
    },
    storyGlow: {
      position: "absolute",
      top: "-50%",
      right: "-50%",
      width: "600px",
      height: "600px",
      background: "radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent 70%)",
      borderRadius: "50%",
      pointerEvents: "none",
    },
    storyHead: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "16px",
      marginBottom: "24px",
      position: "relative",
      zIndex: 1,
    },
    chapterBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 14px",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #1E40AF, #3B82F6)",
      color: "#fff",
      fontSize: "0.92rem",
      fontWeight: 800,
      boxShadow: "0 12px 24px rgba(59, 130, 246, 0.22)",
      marginBottom: "12px",
    },
    storyTitle: {
      fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
      fontWeight: 900,
      margin: "0 0 8px 0",
      lineHeight: 1.2,
    },
    storyMeta: {
      display: "flex",
      gap: "8px",
      fontSize: "0.9rem",
      fontWeight: 700,
      opacity: 0.85,
    },
    storyContent: {
      fontSize: "clamp(1rem, 1.1vw, 1.1rem)",
      lineHeight: 1.8,
      margin: "0 0 32px 0",
      position: "relative",
      zIndex: 1,
      textAlign: "justify",
    },
    navigation: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "16px",
      flexWrap: "wrap",
    },
    navButton: {
      padding: "14px 22px",
      fontSize: "1rem",
      background: "linear-gradient(135deg, #1E40AF, #3B82F6)",
      border: "none",
      borderRadius: "18px",
      cursor: "pointer",
      color: "white",
      fontWeight: 800,
      boxShadow: "0 14px 28px rgba(59, 130, 246, 0.28)",
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
    select: {
      padding: "10px 14px",
      fontSize: "1rem",
      border: "2px solid rgba(255, 255, 255, 0.2)",
      background: "rgba(255, 255, 255, 0.08)",
      color: "white",
      borderRadius: "12px",
      backdropFilter: "blur(8px)",
      cursor: "pointer",
      fontFamily: "'Baloo 2', cursive",
      fontWeight: 700,
    },
    selectRow: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      marginBottom: "16px",
    },
    filterLabel: {
      fontWeight: 700,
      fontSize: "0.95rem",
    },
    errorBox: {
      marginTop: "100px",
      background: "linear-gradient(135deg, #EF4444, #DC2626)",
      color: "#fff",
      padding: "20px 30px",
      borderRadius: "18px",
      fontWeight: 700,
      textAlign: "center",
      fontSize: "1.2rem",
      boxShadow: "0 20px 50px rgba(239, 68, 68, 0.25)",
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
    background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
    border: "none",
    borderRadius: "18px",
    cursor: "pointer",
    color: "white",
    fontWeight: 800,
    boxShadow: "0 8px 16px rgba(59, 130, 246, 0.2)",
    margin: "0",
  };

  const backButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #1E40AF, #1E3A8A)",
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
