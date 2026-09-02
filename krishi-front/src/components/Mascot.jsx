import { useCallback, useEffect, useRef, useState } from "react";

import { MascotFace } from "./MascotFace";
import { VirusSprite } from "./VirusSprite";
import { getMascotReply } from "../utils/mascotBrain";

import styles from "./Mascot.module.css";


const IDLE_LINES = [
  "Namaste! 👋",
  "How are you today?",
  "Ask me about crop advice 🌾",
  "Drag me — then throw me!",
  "I guard this farm from viruses.",
  "Need help picking a crop?",
  "Just stretching my leaves…",
  "Click me, I don't bite 🌱",
];

const SUGGESTIONS = [
  "What is Krishi Sahayog?",
  "How does crop recommendation work?",
  "Tell me about rice",
];

const OUCH_LINES = ["Ouch!", "Oof!", "Aiyaa!", "Ow, my leaf!"];

const SIZE = 96;
const VIRUS_SIZE = 60;
const MARGIN = 12;
const BATTLE_MS = 7000;
const BATTLE_INTERVAL_MS = 5 * 60 * 1000;

// A little typing delay so replies don't feel instant/robotic
const REPLY_DELAY_MS = 500;


let messageIdCounter = 0;


export function Mascot() {

  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState(null);
  const [mood, setMood] = useState("happy");
  const [phase, setPhase] = useState("idle");
  const [virus, setVirus] = useState(null);
  const [virusHurt, setVirusHurt] = useState(false);
  const [beam, setBeam] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);

  const scrollRef = useRef(null);
  const nodeRef = useRef(null);
  const state = useRef({
    x: Math.max(MARGIN, window.innerWidth * 0.12),
    y: Math.max(MARGIN, window.innerHeight * 0.55),
    vx: 1.4,
    vy: 0.9,
  });
  const drag = useRef({ active: false, offX: 0, offY: 0, lx: 0, ly: 0, vx: 0, vy: 0 });
  const openRef = useRef(false);
  const phaseRef = useRef("idle");
  const ouchAt = useRef(0);


  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);


  const bump = useCallback(() => {

    if (Date.now() - ouchAt.current < 500) return;

    ouchAt.current = Date.now();
    setMood("ouch");
    setBubble(OUCH_LINES[Math.floor(Math.random() * OUCH_LINES.length)]);

    window.setTimeout(() => {
      setMood((m) => (m === "ouch" ? "happy" : m));
      setBubble((b) => (b && OUCH_LINES.includes(b) ? null : b));
    }, 900);

  }, []);


  // Physics loop: wandering, throwing, bouncing.
  useEffect(() => {

    

    let raf = 0;
    let wanderAt = 0;

    const tick = () => {

      raf = requestAnimationFrame(tick);

      const s = state.current;
      const maxX = window.innerWidth - SIZE - MARGIN;
      const maxY = window.innerHeight - SIZE - MARGIN;

      if (!drag.current.active) {

        if (!openRef.current) {

          const speed = Math.hypot(s.vx, s.vy);

          if (phaseRef.current === "idle" && speed < 1 && Date.now() > wanderAt) {
            wanderAt = Date.now() + 2600 + Math.random() * 2200;
            const a = Math.random() * Math.PI * 2;
            s.vx += Math.cos(a) * 1.5;
            s.vy += Math.sin(a) * 1.5;
          }

          s.x += s.vx;
          s.y += s.vy;
          s.vx *= 0.985;
          s.vy *= 0.985;

          if (s.x < MARGIN) {
            s.x = MARGIN;
            s.vx = Math.abs(s.vx) * 0.75;
            if (speed > 4) bump();
          } else if (s.x > maxX) {
            s.x = maxX;
            s.vx = -Math.abs(s.vx) * 0.75;
            if (speed > 4) bump();
          }

          if (s.y < MARGIN) {
            s.y = MARGIN;
            s.vy = Math.abs(s.vy) * 0.75;
            if (speed > 4) bump();
          } else if (s.y > maxY) {
            s.y = maxY;
            s.vy = -Math.abs(s.vy) * 0.75;
            if (speed > 4) bump();
          }
        }
      }

      if (nodeRef.current) {
        nodeRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);

  }, [bump]);


  // Drag & throw.
  useEffect(() => {

    

    const move = (e) => {

      if (!drag.current.active) return;

      const s = state.current;

      const nx = Math.min(
        window.innerWidth - SIZE - MARGIN,
        Math.max(MARGIN, e.clientX - drag.current.offX)
      );
      const ny = Math.min(
        window.innerHeight - SIZE - MARGIN,
        Math.max(MARGIN, e.clientY - drag.current.offY)
      );

      drag.current.vx = nx - s.x;
      drag.current.vy = ny - s.y;
      s.x = nx;
      s.y = ny;
    };

    const up = () => {

      if (!drag.current.active) return;

      drag.current.active = false;
      setDragging(false);

      const s = state.current;
      s.vx = Math.max(-42, Math.min(42, drag.current.vx * 1.5));
      s.vy = Math.max(-42, Math.min(42, drag.current.vy * 1.5));

      setMood((m) => (m === "excited" ? "happy" : m));

      if (Math.hypot(s.vx, s.vy) > 14) {
        setBubble("Wheee! 🌪️");
        window.setTimeout(() => setBubble((b) => (b === "Wheee! 🌪️" ? null : b)), 1400);
      }
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };

  }, []);


  // Small talk.
  useEffect(() => {

    if (open) return;

    const say = () => {

      if (phaseRef.current !== "idle" || drag.current.active) return;

      const line = IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)];
      setBubble(line);

      window.setTimeout(() => setBubble((b) => (b === line ? null : b)), 3200);
    };

    const first = window.setTimeout(say, 1800);
    const id = window.setInterval(say, 9000);

    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };

  }, [open]);


  // Virus attack every 5 minutes.
  const startBattle = useCallback(() => {

    if (phaseRef.current !== "idle") return;

    const s = state.current;
    const fromLeft = s.x > window.innerWidth / 2;

    const vx = fromLeft
      ? Math.max(MARGIN, s.x - 220)
      : Math.min(window.innerWidth - VIRUS_SIZE - MARGIN, s.x + 220);

    const vy = Math.max(MARGIN, Math.min(window.innerHeight - VIRUS_SIZE - MARGIN, s.y + 10));

    const mascotX = s.x;
    const mascotY = s.y;

    s.vx = 0;
    s.vy = 0;

    setVirus({ x: vx, y: vy, mascotX, mascotY });
    setVirusHurt(false);
    setPhase("battle");
    setMood("angry");
    setBubble("A crop virus! Stand back! ⚡");

    const timers = [];

    timers.push(window.setTimeout(() => setBubble(null), 1600));

    for (let i = 0; i < 5; i++) {

      const t = 1200 + i * 1000;

      timers.push(
        window.setTimeout(() => {
          setBeam(true);
          setVirusHurt(true);
        }, t)
      );

      timers.push(
        window.setTimeout(() => {
          setBeam(false);
          setVirusHurt(false);
        }, t + 550)
      );
    }

    timers.push(
      window.setTimeout(() => {
        setBeam(false);
        setVirus(null);
        setPhase("celebrate");
        setMood("cheer");
        setBubble("Virus cleared! 🎉");
      }, BATTLE_MS - 400)
    );

    timers.push(
      window.setTimeout(() => {
        setPhase("idle");
        setMood("happy");
        setBubble(null);
      }, BATTLE_MS + 2400)
    );

    return timers;

  }, []);


  useEffect(() => {

    

    const id = window.setInterval(startBattle, BATTLE_INTERVAL_MS);

    return () => window.clearInterval(id);

  }, [startBattle]);


  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);





  function ask(text) {

    const trimmed = text.trim();

    if (!trimmed || thinking) return;

    const userMessage = { id: ++messageIdCounter, role: "user", text: trimmed };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setThinking(true);

    window.setTimeout(() => {

      const reply = getMascotReply(trimmed);

      setMessages((current) => [
        ...current,
        { id: ++messageIdCounter, role: "bot", text: reply },
      ]);

      setThinking(false);

    }, REPLY_DELAY_MS);
  }


  const beamLine =
    beam && virus
      ? {
          x1: virus.mascotX + SIZE / 2,
          y1: virus.mascotY + SIZE / 2,
          x2: virus.x + VIRUS_SIZE / 2,
          y2: virus.y + VIRUS_SIZE / 2,
        }
      : null;


  return (
    <>

      {open && (
        <div className={styles.chatPanel}>

          <div className={styles.chatHeader}>

            <div className={styles.chatHeaderIcon}>
              <MascotFace size={32} mood="wink" />
            </div>

            <div className={styles.chatHeaderText}>
              <p className={styles.chatName}>Pip</p>
              <p className={styles.chatTagline}>Ask me about Krishi Sahayog</p>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className={styles.chatCloseBtn}
            >
              ✕
            </button>

          </div>

          <div ref={scrollRef} className={styles.chatBody}>

            {messages.length === 0 && (
              <div className={styles.introBlock}>

                <p className={styles.introText}>
                  Namaste! I'm Pip 🌱 Ask me anything about Krishi Sahayog —
                  crops, farming basics, or how the app works.
                </p>

                <div className={styles.suggestionRow}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className={styles.suggestionChip}
                    >
                      {s}
                    </button>
                  ))}
                </div>

              </div>
            )}

            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className={styles.userRow}>
                  <p className={styles.userBubble}>{m.text}</p>
                </div>
              ) : (
                <p key={m.id} className={styles.botText}>
                  {m.text}
                </p>
              )
            )}

            {thinking && (
              <p className={styles.thinkingText}>Pip is thinking…</p>
            )}

          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className={styles.chatForm}
          >

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className={styles.chatInput}
            />

            <button
              type="submit"
              disabled={thinking || !input.trim()}
              className={styles.sendBtn}
              aria-label="Send message"
            >
              ➤
            </button>

          </form>

        </div>
      )}

      {/* virus + beam overlay */}
      {(virus || beamLine) && (
        <div className={styles.battleLayer}>

          {beamLine && (
            <svg className={styles.beamSvg}>
              <line
                x1={beamLine.x1}
                y1={beamLine.y1}
                x2={beamLine.x2}
                y2={beamLine.y2}
                stroke="var(--primary)"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.35"
                className={styles.beam}
              />
              <line
                x1={beamLine.x1}
                y1={beamLine.y1}
                x2={beamLine.x2}
                y2={beamLine.y2}
                stroke="var(--accent)"
                strokeWidth="4"
                strokeLinecap="round"
                className={styles.beam}
              />
            </svg>
          )}

          {virus && (
            <div
              className={styles.virusWrap}
              style={{ left: virus.x, top: virus.y, width: VIRUS_SIZE, height: VIRUS_SIZE }}
            >
              <VirusSprite size={VIRUS_SIZE} hurt={virusHurt} />
            </div>
          )}

        </div>
      )}

      <div
        ref={nodeRef}
        className={styles.mascotWrap}
        style={{ width: SIZE, height: SIZE }}
      >

        {phase === "celebrate" && (
          <>
            <span className={[styles.cheerPop, styles.cheerPopLeft].join(" ")}>✨</span>
            <span className={[styles.cheerPop, styles.cheerPopRight].join(" ")}>🎉</span>
          </>
        )}

        <button
          onPointerDown={(e) => {

            if (open) return;

            drag.current = {
              active: true,
              offX: e.clientX - state.current.x,
              offY: e.clientY - state.current.y,
              lx: e.clientX,
              ly: e.clientY,
              vx: 0,
              vy: 0,
            };

            setDragging(true);
            setMood("excited");
          }}
          onClick={() => {
            if (Math.hypot(drag.current.vx, drag.current.vy) > 3) return;
            setOpen((v) => !v);
          }}
          onDoubleClick={() => startBattle()}
          aria-label={open ? "Hide Pip the mascot chat" : "Chat with Pip the mascot (drag to throw)"}
          className={[
            styles.mascotBtn,
            dragging ? styles.dragging : "",
          ].join(" ")}
        >

          <span
            className={[
              styles.mascotInner,
              dragging
                ? styles.scaleUp
                : phase === "celebrate"
                  ? styles.cheerHop
                  : styles.bob,
            ].join(" ")}
          >
            <MascotFace size={SIZE} mood={open ? "excited" : mood} />
          </span>

          {bubble && !open && (
            <span className={styles.speechBubble}>
              {bubble}
            </span>
          )}

        </button>

      </div>

    </>
  );
}