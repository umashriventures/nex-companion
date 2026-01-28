import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import Orb from "@/components/Orb";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Ambient orb in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
        <Orb state="idle" size="md" />
      </div>

      {/* Content */}
      <motion.div
        className="flex flex-col items-center gap-8 z-10 w-full max-w-sm px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Title */}
        <motion.h1
          className="text-2xl font-medium text-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome back
        </motion.h1>

        {/* Login buttons */}
        <motion.div
          className="flex flex-col gap-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Email button */}
          <motion.button
            onClick={() => navigate("/login/email")}
            className="flex items-center justify-center gap-3 w-full py-4 px-6 
                       bg-background-surface hover:bg-background-elevated
                       text-foreground rounded-2xl transition-all duration-300
                       hover:shadow-lg hover:shadow-orb/5"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Mail className="w-5 h-5 text-foreground-muted" />
            <span>Continue with Email</span>
          </motion.button>

          {/* Google button */}
          <motion.button
            onClick={() => navigate("/home")}
            className="flex items-center justify-center gap-3 w-full py-4 px-6 
                       bg-background-surface hover:bg-background-elevated
                       text-foreground rounded-2xl transition-all duration-300
                       hover:shadow-lg hover:shadow-orb/5"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </motion.button>
        </motion.div>

        {/* Subtle footer text */}
        <motion.p
          className="text-foreground-subtle text-sm text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          By continuing, you agree to our terms.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
