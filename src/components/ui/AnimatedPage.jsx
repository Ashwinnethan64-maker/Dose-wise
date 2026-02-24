import { motion } from 'framer-motion';

/**
 * AnimatedPage — Consistent page entrance with Framer Motion.
 */
export default function AnimatedPage({ children, className = '' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * StaggerContainer — Parent for staggered child animations.
 */
export function StaggerContainer({ children, className = '', staggerDelay = 0.06 }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: staggerDelay } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * StaggerItem — Child of StaggerContainer.
 */
export function StaggerItem({ children, className = '' }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
