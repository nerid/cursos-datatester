"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
  content: string;
}

export default function InfoTooltip({ content }: InfoTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span 
      className="inline-flex relative items-center justify-center ml-1 align-middle"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <HelpCircle className="w-4 h-4 text-[var(--color-hornette-primary)] opacity-80 hover:opacity-100 cursor-help" />
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#1f1f1f] border border-white/20 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 text-xs text-white font-normal leading-relaxed tracking-normal"
            style={{ textTransform: 'none' }}
          >
            {content}
            {/* Triangle pointer */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1f1f1f]" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
