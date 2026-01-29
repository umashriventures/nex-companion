import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";

interface Message {
  role: "user" | "nex";
  content: string;
}

interface ChatTranscriptProps {
  messages: Message[];
  isExpanded: boolean;
  showHint: boolean;
}

const ChatTranscript = ({ messages, isExpanded, showHint }: ChatTranscriptProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <motion.div
      className="w-full overflow-hidden"
      initial={false}
      animate={{
        height: isExpanded ? "100%" : "50%",
      }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    >
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto no-scrollbar px-6 py-8"
      >
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div
              key="hint"
              className="h-full flex items-end justify-center pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: showHint ? 0.4 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-foreground-subtle text-sm tracking-wide">
                You can talk to NEX.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              className="max-w-2xl mx-auto space-y-4 pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index === messages.length - 1 ? 0.1 : 0,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                >
                  <div
                    className={`max-w-[80%] px-5 py-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-background-surface text-foreground"
                        : "bg-orb/10 text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChatTranscript;
