import { motion } from 'framer-motion'

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={`w-full h-full overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}
