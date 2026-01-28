import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Orb from "@/components/Orb";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle background gradient */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(var(--orb) / 0.08), transparent 70%)",
        }}
      />
      
      {/* Content */}
      <motion.div 
        className="flex flex-col items-center gap-16 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* The Orb - the first thing they see */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          <Orb state="idle" size="lg" />
        </motion.div>

        {/* Minimal text */}
        <motion.p
          className="text-foreground-muted text-lg tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Meet NEX.
        </motion.p>

        {/* Continue button */}
        <motion.button
          onClick={() => navigate("/login")}
          className="px-10 py-4 bg-background-surface hover:bg-background-elevated 
                     text-foreground rounded-full transition-all duration-500
                     hover:shadow-lg hover:shadow-orb/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Welcome;
