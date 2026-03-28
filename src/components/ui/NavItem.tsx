'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface NavItemProps {
  name: string;
  id: string;
  icon: LucideIcon;
  active?: boolean;
  i?: string;
  j?: string;
}

export default function NavItem({
  name,
  id,
  icon: Icon,
  active,
  i = '#f97316',   // ✅ ORANGE
  j = '#fb923c',   // ✅ LIGHT ORANGE
}: NavItemProps) {

  const containerVariants = {
    initial: { width: 50, backgroundColor: 'rgba(255,255,255,0.95)' },
    expanded: { width: 165, backgroundColor: 'rgba(255,255,255,0)' }
  };

  const contentVariants = {
    initial: { opacity: 0, x: -10, scale: 0.8 },
    expanded: { opacity: 1, x: 0, scale: 1 }
  };

  const bgVariants = {
    initial: { opacity: 0 },
    expanded: { opacity: 1 }
  };

  const glowVariants = {
    initial: { opacity: 0 },
    expanded: { opacity: 0.6 }
  };

  return (
    <Link href={`#${id}`} className="group relative block">
      <motion.div
        initial="initial"
        animate={active ? 'expanded' : 'initial'}
        whileHover="expanded"
        variants={containerVariants}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
        className="relative flex items-center justify-start h-[50px] rounded-full overflow-hidden flex-nowrap border border-black/5 active:scale-95 transition-transform shadow-lg"
      >

        {/* ORANGE GRADIENT BACKGROUND */}
        <motion.div
          variants={bgVariants}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, ${i}, ${j})`,
          }}
        />

        {/* ORANGE GLOW */}
        <motion.div
          variants={glowVariants}
          className="absolute top-2 left-0 right-0 h-full blur-[20px] rounded-full pointer-events-none -z-10"
          style={{
            background: `linear-gradient(45deg, ${i}, ${j})`,
          }}
        />

        {/* ICON */}
        <div className="relative z-10 flex items-center justify-center w-[50px] shrink-0 h-full">
          <Icon
            size={18}
            className={`
              transition-all duration-500
              ${active ? 'text-white' : 'text-gray-500 group-hover:text-white'}
            `}
          />
        </div>

        {/* TEXT */}
        <motion.span
          variants={contentVariants}
          className="relative z-10 text-[10px] font-bold text-white uppercase tracking-[1.5px] pr-6 whitespace-nowrap origin-left"
        >
          {name}
        </motion.span>
      </motion.div>
    </Link>
  );
}