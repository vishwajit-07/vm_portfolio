'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface WordMorphProps {
  words: string[];
  interval?: number;
}

export default function WordMorph({ words, interval = 4000 }: WordMorphProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  const currentWord = words[index];

  return (
    <div className="relative inline-flex items-center py-2 h-[1.5em]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentWord}
          className="flex"
        >
          {currentWord.split('').map((char, i) => (
            <motion.span
              key={`${currentWord}-${i}`}
              initial={{ opacity: 0, y: 15, filter: 'blur(10px)', scale: 0.8 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -15, filter: 'blur(10px)', scale: 0.8 }}
              transition={{
                duration: 0.8,
                delay: i * 0.04,
                ease: [0.6, 0.01, -0.05, 0.95], // Premium fluid easing
              }}
              className="inline-block bg-gradient-to-r from-orange-400 via-orange-200 to-orange-500 bg-clip-text text-transparent font-bold whitespace-nowrap"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {/* Cinematic Breathing Cursor */}
      <motion.div
        animate={{ 
          opacity: [0.1, 0.5, 0.1],
          height: ['1.1em', '1.3em', '1.1em'],
          scaleY: [0.9, 1.1, 0.9]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="ml-2 w-[4px] bg-orange-500/40 rounded-full blur-[1px] shadow-[0_0_15px_rgba(249,115,22,0.6)] h-[1.2em]"
      />
    </div>
  );
}
