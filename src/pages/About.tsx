
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();

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
                    onClick={() => navigate("/settings")}
                    className="p-3 text-foreground-muted hover:text-foreground 
                     transition-colors duration-300 rounded-full hover:bg-background-surface"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-foreground font-medium">About NEX</h1>
                <div className="w-11" />
            </motion.header>

            <div className="max-w-2xl mx-auto px-6 pt-4 pb-12 space-y-6 text-foreground-muted leading-relaxed">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl text-foreground font-semibold mb-3">Your Intelligent Companion</h2>
                    <p>
                        NEX is designed to be more than just an AI assistant; it's a companion that understands you.
                        Built with advanced neural networks and natural language processing, NEX can engage in meaningful
                        conversations, remember your preferences, and help you navigate your digital life with ease.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-xl text-foreground font-semibold mb-3">Our Mission</h2>
                    <p>
                        At Umashri Ventures, we believe in technology that empowers. NEX is our step towards a future
                        where AI integrates seamlessly into daily life, offering support, creativity, and efficiency
                        without compromising on privacy or user experience.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-xl text-foreground font-semibold mb-3">Privacy & Security</h2>
                    <p>
                        Your conversations and data are treated with the utmost respect. We employ state-of-the-art
                        encryption and strict data handling policies to ensure that your interactions with NEX remain
                        private and secure.
                    </p>
                </motion.div>
                
                <motion.div
                    className="pt-8 text-center text-sm text-foreground-subtle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <p>© {new Date().getFullYear()} Umashri Ventures. All rights reserved.</p>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
