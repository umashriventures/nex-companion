import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Orb from "@/components/Orb";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PlanTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  id: string; // TIER_1, TIER_2 etc
}

const plans: PlanTier[] = [
  {
    name: "Free",
    id: "TIER_FREE", // Assuming default or unknown
    price: "$0",
    period: "forever",
    features: ["5 conversations per day", "Basic memory", "Voice interaction"],
  },
  {
    name: "Pro",
    id: "TIER_1", 
    price: "$12",
    period: "per month",
    features: [
      "Unlimited conversations",
      "Deep memory",
      "Priority responses",
      "Emotional insights",
    ],
  },
  {
    name: "Unlimited",
    id: "TIER_2", // Assuming next tier
    price: "$29",
    period: "per month",
    features: [
      "Everything in Pro",
      "Advanced reflection",
      "Exportable memories",
      "Early access features",
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [currentTier, setCurrentTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await api.getSubscriptionStatus();
      if (data && data.tier) {
        setCurrentTier(data.tier);
      }
    } catch (error) {
      console.error("Failed to load subscription:", error);
    }
  };

  const handleUpgrade = async (tierId: string) => {
    setLoading(true);
    try {
      await api.upgradeSubscription(tierId);
      toast.success("Subscription upgraded!");
      loadSubscription(); // Reload status
    } catch (error) {
      console.error("Failed to upgrade:", error);
      toast.error("Failed to upgrade subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle orb in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
        <Orb state="idle" size="lg" />
      </div>

      {/* Header */}
      <motion.header
        className="flex items-center justify-between p-6 relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-3 text-foreground-muted hover:text-foreground 
                     transition-colors duration-300 rounded-full hover:bg-background-surface"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-foreground font-medium">Plans</h1>
        <div className="w-11" />
      </motion.header>

      {/* Intro */}
      <motion.div
        className="px-6 pb-8 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-foreground-muted">
          Choose what feels right for you.
        </p>
      </motion.div>

      {/* Plans */}
      <div className="max-w-4xl mx-auto px-6 pb-12 relative z-10">
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {plans.map((plan, index) => {
            const isCurrent = currentTier === plan.id;
            return (
              <motion.div
                key={plan.name}
                className={`flex flex-col p-6 rounded-3xl transition-all duration-300 ${
                  isCurrent
                    ? "bg-orb/5 ring-1 ring-orb/20"
                    : "bg-background-surface hover:bg-background-elevated"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {/* Plan header */}
                <div className="mb-6">
                  <h3 className="text-foreground font-medium mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-foreground-muted text-sm">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-foreground-muted text-sm"
                    >
                      <Check className="w-4 h-4 text-orb mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => !isCurrent && handleUpgrade(plan.id)}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    isCurrent
                      ? "bg-background-surface text-foreground-muted cursor-default"
                      : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  }`}
                  disabled={isCurrent || loading}
                >
                  {isCurrent ? "Current plan" : loading ? "Upgrading..." : "Upgrade"}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Footer note */}
      <motion.div
        className="text-center pb-12 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-foreground-subtle text-sm">
          Cancel anytime. No questions asked.
        </p>
      </motion.div>
    </div>
  );
};

export default Pricing;
