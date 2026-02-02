import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import { Link } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import pic3 from "../assets/pic3.jpg";
import "./PaintingApp.css";

export default function PaintingApp() {
  const stageRef = useRef(null);

  const [lines, setLines] = useState(() => {
    const saved = sessionStorage.getItem("paintingLines");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentLine, setCurrentLine] = useState(null);

  const [isErasing, setIsErasing] = useState(false);
  const [brushColor, setBrushColor] = useState("red");
  const [brushSize, setBrushSize] = useState(5);

  const [containerWidth, setContainerWidth] = useState(
    Math.min(window.innerWidth, 600),
  );

  useEffect(() => {
    sessionStorage.setItem("paintingLines", JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(Math.min(window.innerWidth, 600));
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

  const downloadImage = () => {
    const uri = stageRef.current?.toDataURL();
    if (!uri) return;
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
    paddingTop: "100px",
    paddingBottom: "50px",

    minHeight: "100vh",
    backgroundimage: `(url${pic3})`,
  };
  const paintingBoxStyle = {
    border: "2px solid #00bfff",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "white",
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

  return (
    <ErrorBoundary>
      <div className="painting-app-container" style={containerStyle}>
        <Link to="/" style={{ position: "absolute", top: 50, left: 10 }}>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#00FFFF",
              color: "#fff",
            }}
          >
            ⬅ Back Home
          </button>
        </Link>

        <h2 style={{ fontSize: "2rem", marginBottom: 20 }}>Painting App</h2>

        <div style={{ marginBottom: 10 }}>
          <div>
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setBrushColor(color);
                  setIsErasing(false);
                }}
                style={{
                  backgroundColor: color,
                  border:
                    brushColor === color && !isErasing
                      ? "3px solid #444"
                      : "2px solid #444",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  margin: 4,
                }}
              />
            ))}
          </div>

          <div style={{ marginTop: 10 }}>
            {thickness.map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                style={{
                  ...buttonStyle,
                  backgroundColor: brushSize === size ? "#888" : "#ccc",
                  color: "#000",
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
              backgroundColor: isErasing ? "#f44336" : "#8bc34a",
              color: "#fff",
              marginTop: 10,
            }}
          >
            {isErasing ? "Brush" : "Eraser"}
          </button>

          <button
            onClick={clearCanvas}
            style={{
              ...buttonStyle,
              backgroundColor: "#ff5722",
              color: "#fff",
              marginLeft: 10,
            }}
          >
            Clear
          </button>
          <button
            onClick={undo}
            style={{
              ...buttonStyle,
              backgroundColor: "#03a9f4",
              color: "#fff",
              marginLeft: 6,
            }}
          >
            Undo
          </button>
          <button
            onClick={downloadImage}
            style={{
              ...buttonStyle,
              backgroundColor: "#9c27b0",
              color: "#fff",
              marginLeft: 6,
            }}
          >
            Save
          </button>
        </div>

        <div style={paintingBoxStyle}>
          <Stage
            width={containerWidth}
            height={400}
            ref={stageRef}
            style={{ touchAction: "none" }}
            onMouseDown={handleStart}
            onMousemove={handleMove}
            onMouseup={handleEnd}
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
