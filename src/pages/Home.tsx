import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Orb, { type OrbState } from "@/components/Orb";
import TranscriptOverlay from "@/components/TranscriptOverlay";
import { Settings, Brain } from "lucide-react";

interface Message {
  role: "user" | "nex";
  content: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const holdTimerRef = useRef<number | null>(null);
  const longPressRef = useRef<number | null>(null);

  // Simulate conversation flow
  const handleInteraction = useCallback(() => {
    // User spoke (simulated)
    const userMessage = "Hello, NEX.";
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // NEX thinking
    setOrbState("thinking");

    setTimeout(() => {
      // NEX speaking
      setOrbState("speaking");
      setSubtitle("Hi, I am NEX.");
      setMessages((prev) => [...prev, { role: "nex", content: "Hi, I am NEX." }]);

      setTimeout(() => {
        // Back to idle
        setOrbState("idle");
        // Fade out subtitle
        setTimeout(() => setSubtitle(null), 2000);
      }, 2000);
    }, 1500);
  }, []);

  const handlePressStart = useCallback(() => {
    holdTimerRef.current = window.setTimeout(() => {
      setOrbState("listening");
    }, 100);

    // Long press detection for transcript
    longPressRef.current = window.setTimeout(() => {
      setShowTranscript(true);
    }, 2000);
  }, []);

  const handlePressEnd = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
    }

    if (orbState === "listening") {
      handleInteraction();
    }
  }, [orbState, handleInteraction]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        handlePressStart();
      }
      if (e.code === "KeyT") {
        setShowTranscript((prev) => !prev);
      }
      if (e.code === "Escape") {
        setShowTranscript(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePressEnd();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handlePressStart, handlePressEnd]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, hsl(var(--orb) / 0.05), transparent 60%)",
        }}
      />

      {/* Navigation buttons - very subtle */}
      <motion.div
        className="absolute top-6 right-6 flex gap-4 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={() => navigate("/memories")}
          className="p-3 text-foreground-subtle hover:text-foreground-muted 
                     transition-colors duration-300 rounded-full hover:bg-background-surface"
          title="Memories"
        >
          <Brain className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="p-3 text-foreground-subtle hover:text-foreground-muted 
                     transition-colors duration-300 rounded-full hover:bg-background-surface"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </motion.div>

      {/* The Orb - center of everything */}
      <motion.div
        className="z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <Orb state={orbState} size="lg" />
      </motion.div>

      {/* Subtitle text */}
      <AnimatePresence>
        {subtitle && (
          <motion.p
            className="absolute bottom-1/4 text-foreground-muted text-lg tracking-wide text-center px-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {subtitle}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hint text */}
      <motion.p
        className="absolute bottom-8 text-foreground-subtle text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Press and hold to speak
      </motion.p>

      {/* Transcript overlay */}
      <TranscriptOverlay
        isOpen={showTranscript}
        onClose={() => setShowTranscript(false)}
        messages={messages}
      />
    </div>
  );
};

export default Home;
