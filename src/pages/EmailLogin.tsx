import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

const EmailLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    // Check if this is a sign-in link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      setVerifying(true);
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        // User opened link on different device/browser, ask for email
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }

      if (emailForSignIn) {
        signInWithEmailLink(auth, emailForSignIn, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            toast.success("Successfully signed in!");
            navigate("/home");
          })
          .catch((error) => {
            console.error("Error signing in with email link", error);
            toast.error("Failed to sign in. Link might be expired.");
            setVerifying(false);
          });
      } else {
        setVerifying(false);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: window.location.href, // Redirect back to this page to handle verification
        handleCodeInApp: true,
      };

      try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        setSent(true);
        toast.success("Magic link sent!");
      } catch (error) {
        console.error("Error sending email link", error);
        // @ts-ignore
        toast.error(`Error sending link: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        <span className="ml-3 text-foreground">Verifying login...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Back button */}
      <motion.button
        onClick={() => navigate("/login")}
        className="absolute top-8 left-8 p-3 text-foreground-muted hover:text-foreground 
                   transition-colors duration-300 rounded-full hover:bg-background-surface"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Content */}
      <motion.div
        className="flex flex-col items-center gap-8 z-10 w-full max-w-sm px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {!sent ? (
          <>
            {/* Title */}
            <motion.h1
              className="text-2xl font-medium text-foreground mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Enter your email
            </motion.h1>

            {/* Email form */}
            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full py-4 px-6 bg-background-surface text-foreground 
                           placeholder:text-foreground-subtle rounded-2xl outline-none
                           focus:ring-2 focus:ring-orb/30 transition-all duration-300"
                autoFocus
                disabled={loading}
              />
              <motion.button
                type="submit"
                className="w-full py-4 px-6 bg-primary text-primary-foreground 
                           rounded-2xl font-medium transition-all duration-300
                           hover:opacity-90 disabled:opacity-50"
                disabled={!email || loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {loading ? "Sending..." : "Send link"}
              </motion.button>
            </motion.form>
          </>
        ) : (
          <>
            {/* Confirmation */}
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Animated check */}
              <motion.div
                className="w-16 h-16 rounded-full bg-orb/20 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <motion.svg
                  className="w-8 h-8 text-orb"
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />
                </motion.svg>
              </motion.div>

              <motion.p
                className="text-xl text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Check your email.
              </motion.p>

              <motion.p
                className="text-foreground-muted text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Taking you in...
              </motion.p>
              
              <button 
                onClick={() => setSent(false)}
                className="text-sm text-primary hover:text-primary/80 mt-2"
              >
                Try different email
              </button>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default EmailLogin;
