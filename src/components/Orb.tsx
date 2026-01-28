import { motion, AnimatePresence, type Transition } from "framer-motion";
import { useEffect, useState } from "react";

export type OrbState = "idle" | "listening" | "thinking" | "speaking";

interface OrbProps {
  state?: OrbState;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
}

const sizeMap = {
  sm: 120,
  md: 200,
  lg: 280,
};

export const Orb = ({
  state = "idle",
  size = "lg",
  className = "",
  onClick,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
}: OrbProps) => {
  const [ripples, setRipples] = useState<number[]>([]);
  const orbSize = sizeMap[size];

  // Add ripples when speaking
  useEffect(() => {
    if (state === "speaking") {
      const interval = setInterval(() => {
        setRipples((prev) => [...prev, Date.now()]);
      }, 800);
      return () => clearInterval(interval);
    } else {
      setRipples([]);
    }
  }, [state]);

  // Clean up old ripples
  useEffect(() => {
    if (ripples.length > 3) {
      setRipples((prev) => prev.slice(-3));
    }
  }, [ripples]);

  const getGlowClass = () => {
    switch (state) {
      case "listening":
        return "orb-glow-listening";
      case "thinking":
        return "orb-glow-thinking";
      case "speaking":
        return "orb-glow-speaking";
      default:
        return "orb-glow";
    }
  };

  const getGradient = () => {
    switch (state) {
      case "thinking":
        return "radial-gradient(circle at 30% 30%, hsl(var(--orb-thinking-glow)), hsl(var(--orb-thinking)), hsl(var(--orb-thinking) / 0.6))";
      case "speaking":
        return "radial-gradient(circle at 30% 30%, hsl(var(--orb-speaking-glow)), hsl(var(--orb-speaking)), hsl(var(--orb) / 0.7))";
      default:
        return "radial-gradient(circle at 30% 30%, hsl(var(--orb-inner)), hsl(var(--orb-glow)), hsl(var(--orb)))";
    }
  };

  const getAnimation = () => {
    switch (state) {
      case "idle":
        return {
          scale: [1, 1.06, 1],
          opacity: [0.85, 1, 0.85],
        };
      case "listening":
        return {
          scale: [1.1, 1.18, 1.1],
          opacity: [0.95, 1, 0.95],
        };
      case "thinking":
        return {
          scale: [0.95, 0.92, 0.95],
          opacity: [0.9, 0.95, 0.9],
        };
      case "speaking":
        return {
          scale: [1.05, 1.12, 1.05],
          opacity: [1, 1, 1],
        };
    }
  };

  const getTransition = (): Transition => {
    switch (state) {
      case "idle":
        return { duration: 4, repeat: Infinity, ease: "easeInOut" as const };
      case "listening":
        return { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const };
      case "thinking":
        return { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const };
      case "speaking":
        return { duration: 0.8, repeat: Infinity, ease: "easeInOut" as const };
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center cursor-pointer select-none ${className}`}
      style={{ width: orbSize * 1.8, height: orbSize * 1.8 }}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Outer ambient glow */}
      <motion.div
        className="absolute rounded-full opacity-30"
        style={{
          width: orbSize * 1.5,
          height: orbSize * 1.5,
          background: getGradient(),
          filter: "blur(40px)",
        }}
        animate={getAnimation()}
        transition={{ ...getTransition(), delay: 0.2 }}
      />

      {/* Ripples for speaking state */}
      <AnimatePresence>
        {ripples.map((id) => (
          <motion.div
            key={id}
            className="absolute rounded-full border-2"
            style={{
              width: orbSize,
              height: orbSize,
              borderColor: "hsl(var(--orb-speaking) / 0.4)",
            }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Main orb */}
      <motion.div
        className={`rounded-full ${getGlowClass()}`}
        style={{
          width: orbSize,
          height: orbSize,
          background: getGradient(),
        }}
        animate={getAnimation()}
        transition={getTransition()}
      />

      {/* Inner core highlight */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: orbSize * 0.4,
          height: orbSize * 0.4,
          background:
            "radial-gradient(circle at 50% 50%, hsl(var(--orb-inner) / 0.8), transparent)",
          filter: "blur(8px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          opacity: state === "speaking" ? [0.6, 1, 0.6] : [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default Orb;
