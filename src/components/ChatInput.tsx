import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onSwipeRight: () => void;
  isVisible: boolean;
}

const ChatInput = ({ onSend, onSwipeRight, isVisible }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const swipeStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    swipeStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (swipeStartX.current !== null) {
      const deltaX = e.changedTouches[0].clientX - swipeStartX.current;
      // Left swipe (negative delta, but we want swipe right to return)
      if (deltaX > 80) {
        onSwipeRight();
      }
      swipeStartX.current = null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    swipeStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (swipeStartX.current !== null) {
      const deltaX = e.clientX - swipeStartX.current;
      if (deltaX > 80) {
        onSwipeRight();
      }
      swipeStartX.current = null;
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full px-6 pb-6"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="relative max-w-2xl mx-auto">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type to NEX..."
          className="w-full px-5 py-4 rounded-2xl bg-background-surface/60 backdrop-blur-sm
                     text-foreground placeholder:text-foreground-subtle
                     border border-border/30 focus:border-orb/30
                     focus:outline-none focus:ring-0
                     transition-colors duration-300"
        />
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 
                     text-foreground-subtle text-xs opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
        >
          ←
        </motion.div>
      </div>
    </motion.form>
  );
};

export default ChatInput;
