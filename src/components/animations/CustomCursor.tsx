'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { usePathname } from 'next/navigation';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const cursorVariant = useStore((state) => state.cursorVariant);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const dotX = useSpring(mouseX, { stiffness: 800, damping: 40 });
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 40 });
  const ringX = useSpring(mouseX, { stiffness: 400, damping: 30 });
  const ringY = useSpring(mouseY, { stiffness: 400, damping: 30 });

  useEffect(() => {
    setMounted(true);
    if (isAdmin) {
      document.documentElement.classList.add('admin-mode');
    } else {
      document.documentElement.classList.remove('admin-mode');
    }
  }, [isAdmin]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  if (!mounted || isAdmin) return null;
  const isHover = cursorVariant === 'hover';

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block rounded-full border border-orange-500/30"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isHover ? 44 : 32,
          height: isHover ? 44 : 32,
          opacity: isHover ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block rounded-full bg-orange-500"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isHover ? 6 : 4,
          height: isHover ? 6 : 4,
          boxShadow: isHover ? '0 0 15px 2px rgba(249,115,22,0.4)' : 'none'
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
