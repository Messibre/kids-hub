import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Piano, KeyboardShortcuts } from "react-piano";
import { MidiNumbers } from "react-piano";
import Soundfont from "soundfont-player";
import "react-piano/dist/styles.css";
import { GiGrandPiano } from "react-icons/gi";
import "./PianoInstrument.css";
import ErrorBoundary from "./ErrorBoundary";
import "./PaintingApp.css";
import { useLanguage } from "./i18n/LanguageContext";

export default function PianoInstrument() {
  const { t } = useLanguage();
  const [audioContext, setAudioContext] = useState(null);
  const [instrument, setInstrument] = useState(null);
  const [audioReady, setAudioReady] = useState(false);
  const [sustain, setSustain] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(
    "acoustic_grand_piano"
  );
  const [recordedNotes, setRecordedNotes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [containerWidth, setContainerWidth] = useState(
    Math.min(window.innerWidth * 0.9, 600)
  );
  const pianoRef = useRef(null);

  const instrumentOptions = [
    { value: "acoustic_grand_piano", label: t("piano.grandPiano") },
    { value: "electric_piano_1", label: t("piano.electricPiano") },
    { value: "harpsichord", label: t("piano.harpsichord") },
    { value: "celesta", label: t("piano.celesta") },
  ];

  const initAudio = async () => {
    if (audioContext && instrument) {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      setAudioReady(true);
      return;
    }
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      if (context.state === "suspended") {
        await context.resume();
      }
      const inst = await Soundfont.instrument(context, selectedInstrument);
      setAudioContext(context);
      setInstrument(inst);
      setAudioReady(true);
    } catch (error) {
      console.error("Error loading the instrument:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(Math.min(window.innerWidth * 0.9, 600));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadSelectedInstrument = async () => {
      if (!audioContext) return;
      try {
        const inst = await Soundfont.instrument(audioContext, selectedInstrument);
        if (!cancelled) {
          setInstrument(inst);
        }
      } catch (error) {
        console.error("Error switching instrument:", error);
      }
    };

    loadSelectedInstrument();
    return () => {
      cancelled = true;
    };
  }, [selectedInstrument, audioContext]);

  const playNote = async (midiNumber) => {
    try {
      let ctx = audioContext;
      let inst = instrument;

      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        inst = await Soundfont.instrument(ctx, selectedInstrument);
        setAudioContext(ctx);
        setInstrument(inst);
      }

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      if (inst && ctx) {
        inst.play(midiNumber, ctx.currentTime, {
          gain: 0.3,
          sustain: sustain,
        });
        if (isRecording) {
          setRecordedNotes((prev) => [
            ...prev,
            { midiNumber, time: Date.now(), duration: null, velocity: 0.8 },
          ]);
        }
      }
    } catch (error) {
      console.error("Error playing note:", error);
    }
  };

  const stopNote = (midiNumber) => {
    try {
      if (instrument && audioContext) {
        instrument.stop(midiNumber, audioContext.currentTime);
      }
    } catch (error) {
      console.error("Error stopping note:", error);
    }
  };

  const backButtonStyle = {
    padding: "10px 16px",
    fontSize: "1rem",
    background: "linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
    boxShadow: "0 8px 16px rgba(59, 130, 246, 0.2)",
    transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  };


  return (
    <ErrorBoundary>
      <div className="piano-app-wrapper">
        <div className="piano-back-button">
          <Link to="/">
            <button style={backButtonStyle}>⬅️ {t("piano.backHome")}</button>
          </Link>
        </div>

        <div className="piano-header">
          <h2>
            <GiGrandPiano /> {t("piano.title")}
          </h2>
        </div>

        <div className="piano-controls">
          <div className="piano-control-group">
            <select
              value={selectedInstrument}
              onChange={(e) => setSelectedInstrument(e.target.value)}
              className="piano-instrument-select"
            >
              {instrumentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <label className="piano-sustain-label">
              <input
                type="checkbox"
                checked={sustain}
                onChange={(e) => setSustain(e.target.checked)}
              />
              {t("piano.sustain")}
            </label>
          </div>

          <div className="piano-control-group">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`piano-action-button piano-record-button ${isRecording ? "active" : ""}`}
            >
              {isRecording
                ? `⏹️ ${t("piano.stopRecording")}`
                : `⏺️ ${t("piano.startRecording")}`}
            </button>
            {!audioReady && (
              <button
                onClick={initAudio}
                className="piano-action-button piano-sound-button"
              >
                🔊 {t("piano.enableSound")}
              </button>
            )}
          </div>
        </div>

        <div className="piano-container-wrapper">
          <div className="piano-keyboard-frame">
            <div style={{ width: containerWidth }}>
              <Piano
                noteRange={{ first: 48, last: 84 }}
                playNote={playNote}
                stopNote={stopNote}
                width={containerWidth}
                height={200}
                keyboardShortcuts={KeyboardShortcuts.create({
                  firstNote: 48,
                  lastNote: 84,
                  keyboardConfig: KeyboardShortcuts.HOME_ROW,
                })}
                ref={pianoRef}
                renderNoteLabel={({ midiNumber }) => {
                  const note = MidiNumbers.getAttributes(midiNumber).note;
                  return <div style={{ fontWeight: "bold", fontSize: "0.75rem" }}>{note[0]}</div>;
                }}
              />
            </div>
          </div>
        </div>

        <div className="keys-box">
          <p>{t("piano.tryOutThese")}</p>
          <ol className="keys-list">
            <li className="keys-item">
              C C D C F E C C D C G C F C C C A F E D B B A F G F{" "}
            </li>
            <li className="keys-item">
              G G G D D D E E E D D C C B B A A G G D D C C{" "}
            </li>
            <li className="keys-item">C G B A F C F C C G B A F C F C</li>
            <li className="keys-item">
              G G A G C B B B G G A G D C C C G G G E C B A A A{" "}
            </li>
          </ol>
        </div>
      </div>
    </ErrorBoundary>
  );
}
