import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, CreditCard, LogOut, Info } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  const settingsItems = [
    {
      icon: User,
      label: "Account",
      value: "you@example.com",
      onClick: () => {},
    },
    {
      icon: CreditCard,
      label: "Subscription",
      value: "Free",
      onClick: () => navigate("/pricing"),
    },
    {
      icon: Info,
      label: "About NEX",
      value: "",
      onClick: () => {},
    },
    {
      icon: LogOut,
      label: "Log out",
      value: "",
      onClick: () => navigate("/"),
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
              className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-colors duration-200
                ${
                  item.isDestructive
                    ? "hover:bg-destructive/10 text-destructive"
                    : "hover:bg-background-surface text-foreground"
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
