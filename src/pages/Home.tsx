import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Orb, { type OrbState } from "@/components/Orb";
import ChatInput from "@/components/ChatInput";
import ChatTranscript from "@/components/ChatTranscript";
import { Settings, Brain, HelpCircle } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

interface Message {
  role: "user" | "nex";
  content: string;
}

type InteractionMode = "presence" | "chat";

const Home = () => {
  const navigate = useNavigate();
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [mode, setMode] = useState<InteractionMode>("presence");
  const [messages, setMessages] = useState<Message[]>([]);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const holdTimerRef = useRef<number | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // Motion values for orb position during drag
  const orbX = useMotionValue(0);
  const orbOpacity = useTransform(orbX, [-150, 0], [0.6, 1]);
  const orbScale = useTransform(orbX, [-150, 0], [0.7, 1]);

  // Speech Recognition Refs
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");
  const interactRef = useRef<any>(null);


// ... imports

  // Interact with NEX API
  const handleNexInteraction = useCallback(async (userMessage: string) => {
    setOrbState("thinking");
    
    // Get last 5 messages for history
    const history = messages.slice(-5).map(m => ({
        role: m.role,
        content: m.content
    }));

    try {
      const response = await api.interact(userMessage, history);
      
      setOrbState("speaking");
      setMessages(prev => [...prev, { role: "nex", content: response.reply }]);
      
      setTimeout(() => {
        setOrbState("idle");
      }, 2000); // Keep speaking state briefly for effect
    } catch (error) {
      console.error("Error interacting with NEX:", error);
      toast.error("Failed to connect to NEX.");
      setOrbState("idle");
    }
  }, [messages]);

  // Keep interact ref updated
  useEffect(() => {
    interactRef.current = handleNexInteraction;
  }, [handleNexInteraction]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      // Optional: Visual feedback handling if needed distinct from "listening" state
    };

    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      transcriptRef.current = text;
      setInterimTranscript(text);
    };

    recognition.onend = () => {
      const text = transcriptRef.current.trim();
      setInterimTranscript("");
      if (text) {
        setMessages(prev => [...prev, { role: "user", content: text }]);
        interactRef.current(text);
      } else {
        setOrbState((prev) => prev === "listening" ? "idle" : prev);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === 'not-allowed') {
        toast.error("Microphone access denied.");
      }
      setOrbState("idle");
    };

    recognitionRef.current = recognition;
  }, []);

  // Handle voice interaction (press to talk)
  const handlePressStart = useCallback(() => {
    if (mode === "chat") return;
    
    holdTimerRef.current = window.setTimeout(() => {
      setOrbState("listening");
      transcriptRef.current = "";
      setInterimTranscript("");
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Failed to start recognition:", err);
      }
    }, 100);
  }, [mode]);

  const handlePressEnd = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }

    if (orbState === "listening") {
      recognitionRef.current?.stop();
      // State transition handled in onend
    }
  }, [orbState]);

  // Handle orb swipe gesture
  const handleOrbPanStart = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (mode === "chat") return;
    swipeStartRef.current = { x: info.point.x, y: info.point.y };
  }, [mode]);

  const handleOrbPan = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (mode === "chat" || isTransitioning) return;
    // Only track horizontal movement to the left
    if (info.offset.x < 0) {
      orbX.set(info.offset.x);
    }
  }, [mode, isTransitioning, orbX]);

  const handleOrbPanEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (mode === "chat" || isTransitioning) return;
    
    // Threshold for mode switch
    if (info.offset.x < -80 || info.velocity.x < -500) {
      // Transition to chat mode
      setIsTransitioning(true);
      setMode("chat");
      
      // Animate to final position
      setTimeout(() => {
        orbX.set(0);
        setIsTransitioning(false);
      }, 50);
    } else {
      // Snap back
      orbX.set(0);
    }
    
    swipeStartRef.current = null;
  }, [mode, isTransitioning, orbX]);

  // Handle chat input send
  const handleSendMessage = useCallback((message: string) => {
    setMessages(prev => [...prev, { role: "user", content: message }]);
    handleNexInteraction(message);
  }, [handleNexInteraction]);

  // Handle return to presence mode
  const handleReturnToPresence = useCallback(() => {
    setIsTransitioning(true);
    setMode("presence");
    setTimeout(() => setIsTransitioning(false), 400);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && mode === "presence") {
        e.preventDefault();
        handlePressStart();
      }
      if (e.code === "Escape" && mode === "chat") {
        handleReturnToPresence();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && mode === "presence") {
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
  }, [handlePressStart, handlePressEnd, handleReturnToPresence, mode]);

  const getOrbContainerStyles = () => {
    if (mode === "chat") {
      return {
        position: "fixed" as const,
        left: "24px",
        bottom: "24px",
      };
    }
    return {
      position: "absolute" as const,
      left: "50%",
      bottom: "0", // Position at bottom of page
    };
  };

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden select-none">
      {/* Ambient background glow */}
      {/* ... (rest of the glow code) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: mode === "chat" 
            ? "radial-gradient(ellipse at 10% 90%, hsl(var(--orb) / 0.03), transparent 50%)"
            : "radial-gradient(ellipse at 50% 100%, hsl(var(--orb) / 0.05), transparent 60%)",
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Navigation buttons */}
      <motion.div
        className="absolute top-6 right-6 flex items-center gap-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="p-3 text-foreground-subtle hover:text-foreground-muted 
                       transition-colors duration-300 rounded-full hover:bg-background-surface cursor-help"
            title="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                className="absolute top-full right-0 mt-2 px-5 py-3 rounded-2xl bg-background-surface/90 backdrop-blur-md 
                           border border-foreground/5 shadow-2xl flex flex-col items-end gap-1.5 z-30"
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                <p className="text-foreground-muted text-sm font-medium whitespace-nowrap">
                  press the orb or hold the spacebar to speak to nex
                </p>
                <p className="text-foreground-subtle/60 text-xs whitespace-nowrap">
                  slide the orb to left to activate text mode
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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

      {/* Transcript area */}
      <ChatTranscript 
        messages={messages} 
        interimTranscript={interimTranscript}
        isExpanded={mode === "chat"} 
        showHint={mode === "presence" && messages.length === 0}
      />

      {/* Chat input (only in chat mode) */}
      <AnimatePresence>
        {mode === "chat" && (
          <ChatInput
            onSend={handleSendMessage}
            onSwipeRight={handleReturnToPresence}
            isVisible={mode === "chat"}
          />
        )}
      </AnimatePresence>

      {/* The Orb */}
      <motion.div
        className="z-10"
        style={getOrbContainerStyles()}
        animate={{
          scale: mode === "chat" ? 0.4 : 1,
          x: mode === "chat" ? 0 : "-50%",
          y: mode === "chat" ? 0 : "50%", // Half-submerge the orb in presence mode
        }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 200,
        }}
      >
        <motion.div
          style={{ 
            x: mode === "presence" ? orbX : 0,
            opacity: mode === "presence" ? orbOpacity : 0.8,
            scale: mode === "presence" ? orbScale : 1,
          }}
          drag={mode === "presence" ? "x" : false}
          dragConstraints={{ left: -200, right: 0 }}
          dragElastic={0.1}
          onPanStart={handleOrbPanStart}
          onPan={handleOrbPan}
          onPanEnd={handleOrbPanEnd}
          onMouseDown={mode === "presence" ? handlePressStart : undefined}
          onMouseUp={mode === "presence" ? handlePressEnd : undefined}
          onMouseLeave={mode === "presence" ? handlePressEnd : undefined}
          onTouchStart={mode === "presence" ? handlePressStart : undefined}
          onTouchEnd={mode === "presence" ? handlePressEnd : undefined}
          whileTap={mode === "presence" ? { scale: 1.05 } : undefined}
        >
          <Orb 
            state={orbState} 
            size={mode === "chat" ? "sm" : "lg"} 
            onClick={mode === "chat" ? handleReturnToPresence : undefined}
          />
        </motion.div>
      </motion.div>

      {/* Prompt / Info Button placeholder removed from here */}

      {/* Chat mode hint for returning */}
      <AnimatePresence>
        {mode === "chat" && (
          <motion.div
            className="fixed bottom-6 left-20 z-10"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.4, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p className="text-foreground-subtle text-xs">
              tap orb to return
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
