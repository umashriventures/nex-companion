import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, CreditCard, LogOut, Info, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { auth } from "@/lib/firebase"; // Direct auth import for signOut if needed, though useAuth exposes user
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messagesLeft, setMessagesLeft] = useState<number | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string>("Free");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const status = await api.bootstrap(); // Using bootstrap as requested
        if (status) {
            if (status.tier) setSubscriptionTier(status.tier);
            
            // Calculate messages left from bootstrap data
            if (typeof status.daily_limit === 'number' && typeof status.messages_used_today === 'number') {
                const left = Math.max(0, status.daily_limit - status.messages_used_today);
                setMessagesLeft(left);
            }
        }
      } catch (error) {
        console.error("Failed to fetch status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchStatus();
    }
  }, [user]);

  const handleLogout = async () => {
      try {
          await auth.signOut();
          navigate("/");
      } catch (error) {
          console.error("Logout failed", error);
      }
  };

  const settingsItems = [
    {
      icon: User,
      label: "Account",
      value: user?.email || "Not logged in",
      onClick: () => {},
    },
    {
      icon: CreditCard,
      label: "Subscription",
      value: loading ? <LoadingSpinner size={14} className="py-0" /> : subscriptionTier,
      onClick: () => navigate("/pricing"),
    },
    {
        icon: MessageSquare,
        label: "Messages Left Today",
        value: loading ? <LoadingSpinner size={14} className="py-0" /> : (messagesLeft !== null ? messagesLeft.toString() : "..."),
        onClick: () => {},
    },
    {
      icon: Info,
      label: "About NEX",
      value: "",
      onClick: () => navigate("/about"),
    },
    {
      icon: LogOut,
      label: "Log out",
      value: "",
      onClick: handleLogout,
      isDestructive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between p-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => navigate("/home")}
          className="p-3 text-foreground-muted hover:text-foreground 
                     transition-colors duration-300 rounded-full hover:bg-background-surface"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-foreground font-medium">Settings</h1>
        <div className="w-11" />
      </motion.header>

      {/* Settings list */}
      <div className="max-w-lg mx-auto px-6 pt-4 pb-12">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {settingsItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={item.onClick}
              disabled={!item.onClick || item.label === "Messages Left Today" || item.label === "Account"}
              className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-colors duration-200
                ${
                  item.isDestructive
                    ? "hover:bg-destructive/10 text-destructive"
                    : (item.label === "Messages Left Today" || item.label === "Account") ? "text-foreground cursor-default" : "hover:bg-background-surface text-foreground"
                }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <item.icon className={`w-5 h-5 ${item.isDestructive ? "" : "text-foreground-muted"}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.value && (
                <span className="text-foreground-muted text-sm">{item.value}</span>
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Version footer */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-foreground-subtle text-xs">NEX v1.0.0</p>
      </motion.div>
    </div>
  );
};

export default Settings;
