import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import { Link } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import pic3 from "../assets/pic3.jpg";
import "./PaintingApp.css";
import { useLanguage } from "./i18n/LanguageContext";

export default function PaintingApp() {
  const { t } = useLanguage();
  const stageRef = useRef(null);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const [lines, setLines] = useState(() => {
    const saved = sessionStorage.getItem("paintingLines");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentLine, setCurrentLine] = useState(null);

  const [isErasing, setIsErasing] = useState(false);
  const [brushColor, setBrushColor] = useState("red");
  const [brushSize, setBrushSize] = useState(5);

  const [containerWidth, setContainerWidth] = useState(
    Math.max(280, Math.min(window.innerWidth - 24, 600)),
  );
  const [stageHeight, setStageHeight] = useState(() =>
    window.innerWidth <= 700 ? 300 : 400,
  );

  useEffect(() => {
    sessionStorage.setItem("paintingLines", JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(Math.max(280, Math.min(window.innerWidth - 24, 600)));
      setStageHeight(window.innerWidth <= 700 ? 300 : 400);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStart = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const newLine = {
      points: [pos.x, pos.y],
      stroke: isErasing ? "black" : brushColor,
      strokeWidth: brushSize,
      globalCompositeOperation: isErasing ? "destination-out" : "source-over",
    };
    setCurrentLine(newLine);
    setLines((prev) => [...prev, newLine]);
  };

  const handleMove = (e) => {
    if (!currentLine) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;

    const updatedLine = {
      ...currentLine,
      points: [...currentLine.points, pos.x, pos.y],
    };
    setCurrentLine(updatedLine);

    setLines((prev) => {
      const copy = prev.slice();
      copy[copy.length - 1] = updatedLine;
      return copy;
    });
  };

  const handleEnd = () => {
    setCurrentLine(null);
  };

  const clearCanvas = () => setLines([]);

  const undo = () => setLines((prev) => prev.slice(0, -1));

  const downloadImage = async () => {
    const uri = stageRef.current?.toDataURL();
    if (!uri) return;

    // Mobile browsers often ignore <a download>. Prefer share or open-image fallback.
    if (isMobile) {
      try {
        if (navigator.share && navigator.canShare) {
          const response = await fetch(uri);
          const blob = await response.blob();
          const file = new File([blob], "masterpiece.png", {
            type: "image/png",
          });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: t("painting.shareTitle"),
              files: [file],
            });
            return;
          }
        }
      } catch (error) {
        console.error("Mobile share failed, falling back to image preview:", error);
      }

      const preview = window.open("");
      if (preview) {
        preview.document.write(
          `<img src="${uri}" style="max-width:100%;height:auto;display:block;margin:auto;" alt="Painting preview" />`,
        );
      }
      return;
    }

    const link = document.createElement("a");
    link.download = "masterpiece.png";
    link.href = uri;
    link.click();
  };

  const colors = [
    "black",
    "red",
    "blue",
    "green",
    "pink",
    "skyblue",
    "orange",
    "yellow",
    "lime",
    "purple",
  ];
  const thickness = [2, 5, 10, 15];
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    touchAction: "none",
    paddingTop: "86px",
    paddingBottom: "50px",

    minHeight: "100vh",
    backgroundImage: `url(${pic3})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  const paintingBoxStyle = {
    border: "3px solid #8ea2bd",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "#f6f3ff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  };
  const buttonStyle = {
    margin: "0 6px",
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  };
  const controlsContainerStyle = {
    width: "100%",
    maxWidth: 640,
    marginBottom: 10,
  };
  const colorRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  };
  const toolRowStyle = {
    marginTop: 10,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  };

  return (
    <ErrorBoundary>
      <div className="painting-app-container" style={containerStyle}>
        <Link to="/" style={{ position: "absolute", top: 50, left: 10 }}>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#252a56",
              color: "#fff",
            }}
          >
            ⬅️ {t("painting.backHome")}
          </button>
        </Link>

        <h2 style={{ fontSize: "clamp(1.5rem, 4.8vw, 2rem)", marginBottom: 20 }}>
          {t("painting.title")}
        </h2>

        <div style={controlsContainerStyle}>
          <div style={colorRowStyle}>
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setBrushColor(color);
                  setIsErasing(false);
                }}
                style={{
                  appearance: "none",
                  background: color,
                  border:
                    brushColor === color && !isErasing
                      ? "4px solid #ffffff"
                      : "2px solid #ffffff",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  margin: 4,
                  padding: 0,
                  minWidth: 24,
                  boxShadow: "0 0 0 2px rgba(0,0,0,0.35)",
                }}
              />
            ))}
          </div>

          <div style={toolRowStyle}>
            {thickness.map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                style={{
                  ...buttonStyle,
                  backgroundColor: brushSize === size ? "#5a6fb5" : "#ffe2cf",
                  color: brushSize === size ? "#fff" : "#4a3659",
                }}
              >
                {size}px
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsErasing((e) => !e)}
            style={{
              ...buttonStyle,
              backgroundColor: isErasing ? "#8ea2bd" : "#5a6fb5",
              color: "#fff",
              marginTop: 8,
            }}
          >
            {isErasing ? t("painting.brush") : t("painting.eraser")}
          </button>

          <button
            onClick={clearCanvas}
            style={{
              ...buttonStyle,
              backgroundColor: "#5a6fb5",
              color: "#fff",
              marginLeft: 6,
              marginTop: 8,
            }}
          >
            {t("painting.clear")}
          </button>
          <button
            onClick={undo}
            style={{
              ...buttonStyle,
              backgroundColor: "#7d8fd1",
              color: "#fff",
              marginLeft: 6,
              marginTop: 8,
            }}
          >
            {t("painting.undo")}
          </button>
          <button
            onClick={downloadImage}
            style={{
              ...buttonStyle,
              backgroundColor: "#ffe2cf",
              color: "#4a3659",
              marginLeft: 6,
              marginTop: 8,
            }}
          >
            {t("painting.save")}
          </button>
        </div>

        <div style={paintingBoxStyle}>
          <Stage
            width={containerWidth}
            height={stageHeight}
            ref={stageRef}
            style={{ touchAction: "none" }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.stroke}
                  strokeWidth={line.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={line.globalCompositeOperation}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </ErrorBoundary>
  );
}
