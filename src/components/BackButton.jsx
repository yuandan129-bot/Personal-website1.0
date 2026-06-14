import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BackButton({ variant = 'dark' }) {
  const navigate = useNavigate()
  const isLight = variant === 'light'

  return (
    <motion.button
      onClick={() => navigate(-1)}
      className={`fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2
                 rounded-full backdrop-blur-md border text-sm transition-colors
                 ${isLight
                   ? 'bg-black/5 border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-black/10'
                   : 'bg-white/10 border-white/20 text-white/80 hover:text-white hover:bg-white/20'
                 }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      返回
    </motion.button>
  )
}
