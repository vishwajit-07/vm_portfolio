'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        // Random incremental jumps for organic feel
        const jump = Math.floor(Math.random() * 15) + 3;
        return Math.min(prev + jump, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100%', 
            opacity: 0,
            transition: { 
              duration: 1.2, 
              ease: [0.76, 0, 0.24, 1], // Custom cinematic easing
              delay: 0.2
            } 
          }}
          className="fixed inset-0 z-[100] bg-[#050507] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#ff6a0015_0%,_transparent_50%)]" />
          
          <div className="relative flex flex-col items-center">
            {/* Logo/Character Layer */}
            <div className="relative mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-[120px] font-black text-orange-500 select-none tracking-tighter"
              >
                V
              </motion.div>
              <motion.div 
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 blur-[40px] bg-orange-500/20 -z-10"
              />
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-56 h-[1px] bg-white/5 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 origin-left"
                style={{ scaleX: percent / 100 }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
              />
            </div>
            
            {/* Loading Status */}
            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-orange-200/30">
                  Initializing Manifest
                </span>
                <motion.span 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-orange-500 font-bold text-[10px]"
                >
                  _
                </motion.span>
              </div>
              <span className="text-[8px] font-bold text-white/20 tabular-nums uppercase tracking-widest">
                {percent}% Completed
              </span>
            </div>
          </div>

          {/* Perspective Lines Decoration */}
          <div className="absolute bottom-[-10%] left-0 right-0 h-[400px] opacity-10 pointer-events-none">
            <div className="w-full h-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" style={{ transform: 'perspective(1000px) rotateX(60deg)' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
