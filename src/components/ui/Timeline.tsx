'use client';
import { motion, AnimatePresence, useScroll, useTransform, useSpring as useFramerSpring } from 'framer-motion';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin, Calendar } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// -----------------------------------------------------
// TimelineContainer
// -----------------------------------------------------

function TimelineProgress({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleY = useFramerSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      style={{ scaleY, originY: 0 }}
      className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-orange-500 via-purple-500 to-transparent z-10 shadow-[0_0_15px_rgba(249,115,22,0.4)]" 
    />
  );
}

export function TimelineContainer({ children, className }: { children: ReactNode, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={cn("relative mx-auto mt-10", className)}
      style={{ position: 'relative' }} // Ultra-explicit
    >
      {/* Background Line */}
      <div className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-[2px] bg-white/[0.03]" />
      
      {/* Progressive Fill Line - Only track after mount */}
      {mounted && <TimelineProgress containerRef={containerRef} />}

      <div className="relative space-y-12">
        {children}
      </div>
    </div>
  );
}

// -----------------------------------------------------
// LiveDurationTimer
// -----------------------------------------------------
function LiveDurationTimer({ startDate }: { startDate?: string }) {
  const [duration, setDuration] = useState({ yrs: 0, mos: 0, days: 0, hrs: 0, min: 0, sec: 0 });

  useEffect(() => {
    if (!startDate) return;
    const start = new Date(startDate).getTime();
    if (isNaN(start)) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = now - start;

      const yrs = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      const mos = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const sec = Math.floor((diff % (1000 * 60)) / 1000);

      setDuration({ yrs, mos, days, hrs, min, sec });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 2000);
    return () => clearInterval(interval);
  }, [startDate]);

  if (!startDate) return null;

  const Block = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center bg-white/[0.04] border border-white/[0.08] rounded-md p-2 min-w-[36px]">
      <span className="text-white font-bold text-[13px]">{value.toString().padStart(2, '0')}</span>
      <span className="text-white/40 text-[8px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.05]">
      <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">Live Duration:</div>
      <div className="flex flex-wrap gap-2">
        <Block value={duration.yrs} label="Yrs" />
        <Block value={duration.mos} label="Mos" />
        <Block value={duration.days} label="Days" />
        <Block value={duration.hrs} label="Hrs" />
        <Block value={duration.min} label="Min" />
        <Block value={duration.sec} label="Sec" />
      </div>
    </div>
  );
}

// -----------------------------------------------------
// TimelineItem
// -----------------------------------------------------
export interface TimelineItemProps {
  position?: 'left' | 'right';
  title: string;
  subtitle: string;
  duration: string;
  location?: string;
  description?: string;
  itemsList?: string[];
  tags?: string[];
  startDate?: string;
  index: number;
  iconLetter?: string;
}

export function TimelineItem({
  position = 'right',
  title,
  subtitle,
  duration,
  location,
  description,
  itemsList,
  tags,
  startDate,
  index,
  iconLetter
}: TimelineItemProps) {
  const [expanded, setExpanded] = useState(false);

  // Position logic: 
  // Mobile: always pl-16
  // Desktop: 'left' = pr-8, text-right (or text-left but aligned right side), 'right' = pl-8
  const isLeft = position === 'left';
  
  const slideIn = {
    hidden: { 
      opacity: 0, 
      y: 30,
      x: isLeft ? -50 : 50 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1] as any,
        delay: 0.1 * (index % 4) 
      } 
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={slideIn}
      // Wrapper spans 100%. Padding left on mobile for timeline line.
      className="relative flex flex-col md:block items-start pl-14 md:pl-0 group w-full"
    >
      {/* Node / Dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={cn(
          "absolute top-6 w-3 h-3 rounded-full bg-orange-500 border-[3px] border-[#0B0B0F] z-10 shadow-[0_0_20px_rgba(249,115,22,0.8)] group-hover:scale-125 transition-transform duration-300",
          "left-[18px] md:left-1/2 md:-translate-x-1/2 md:translate-y-2"
        )}
      >
        {/* Electric Outer Pulse */}
        <motion.div 
          animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-orange-500 rounded-full scale-150 opacity-20"
        />
        <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20 hidden md:block"></div>
      </motion.div>

      {/* Modern Card */}
      <div className={cn(
        "glass-light will-change-premium relative p-5 md:p-6 rounded-2xl border border-white/[0.05] group-hover:bg-white/[0.06] group-hover:border-orange-500/30 transition-all duration-300 w-full md:w-[calc(50%-2.5rem)] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]",
        isLeft ? "md:mr-auto" : "md:ml-auto"
      )}>
        
        <div className="relative z-10">
          
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
            {/* Icon Letter optionally */}
            {iconLetter && (
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shadow-inner">
                <span className="text-white font-black text-xl drop-shadow-md">{iconLetter.substring(0, 1)}</span>
              </div>
            )}
            
            <div className="flex-grow">
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight group-hover:text-orange-400 transition-colors duration-300">
                {title}
              </h3>
              <div className="text-orange-500 font-bold text-[10px] md:text-[11px] uppercase tracking-widest mt-1 mb-2.5">
                {subtitle}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {location && (
                  <div className="flex items-center gap-1 text-white/50 text-[10px] font-medium">
                    <MapPin size={12} />
                    <span>{location}</span>
                  </div>
                )}
                {/* Duration Badge */}
                <span className="flex items-center gap-1 text-white/90 font-bold text-[9px] md:text-[10px] uppercase tracking-wider bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.08] transition-all duration-300 group-hover:border-orange-500/40 group-hover:bg-orange-500/10 group-hover:text-orange-400">
                  <Calendar size={11} className="hidden sm:block"/>
                  {duration}
                </span>
              </div>
            </div>
          </div>

          {/* Optional Live counter */}
          {startDate && <LiveDurationTimer startDate={startDate} />}

          {/* Description */}
          {description && (
            <p className="text-white/60 text-xs md:text-[13px] font-medium leading-relaxed mt-4 text-left">
              {description}
            </p>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded-md text-[9px] md:text-[10px] font-semibold text-white/70 hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30 transition-all cursor-default shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Key Achievements Toggle */}
          {itemsList && itemsList.length > 0 && (
            <div className="mt-5 pt-3 border-t border-white/[0.05]">
              <button 
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-between text-white/50 hover:text-orange-500 text-[10px] font-bold uppercase tracking-wider transition-colors w-full group/btn"
              >
                <span>{itemsList.length} Key Achievements</span>
                <ChevronDown size={12} className={cn("transition-transform duration-300 group-hover/btn:translate-y-0.5", expanded ? "rotate-180" : "")} />
              </button>
              
              <AnimatePresence>
                {expanded && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3 space-y-2.5"
                  >
                    {itemsList.map((item, idx) => (
                      <motion.li 
                        key={idx}
                        className="flex items-start gap-2.5 text-white/60 text-xs md:text-[13px] leading-relaxed text-left"
                      >
                        <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-orange-500/40 group-hover:bg-orange-500 transition-colors shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
