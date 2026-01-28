import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Message {
  role: "user" | "nex";
  content: string;
}

interface TranscriptOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
}

const TranscriptOverlay = ({ isOpen, onClose, messages }: TranscriptOverlayProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <h2 className="text-foreground-muted text-sm tracking-wide uppercase">
              Transcript
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-foreground-muted hover:text-foreground 
                         transition-colors duration-300 rounded-full hover:bg-background-surface"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-12">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-foreground-subtle text-center">
                  No messages yet.<br />
                  <span className="text-sm">Start a conversation with NEX.</span>
                </p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-background-surface text-foreground"
                          : "bg-orb/10 text-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="p-4 text-center">
            <p className="text-foreground-subtle text-xs">
              Press ESC or click the orb to close
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TranscriptOverlay;
