
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
    className?: string; // Allow custom container classes
    size?: number; // Size in pixels
}

export const LoadingSpinner = ({ className, size = 24 }: LoadingSpinnerProps) => (
    <div className={`flex justify-center items-center ${className || 'py-4'}`}>
        <motion.div
            className="border-2 border-foreground-muted border-t-transparent rounded-full"
            style={{ width: size, height: size }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
    </div>
);
