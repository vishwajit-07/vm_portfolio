'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

export default function LiquidBackground() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollY } = useScroll();

  // Lerp smoothing for mouse inertia
  const springX = useSpring(mouseX, { stiffness: 35, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 35, damping: 25 });

  // Parallax / Interaction mappings (Depth-based)
  const farDriftX = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const farDriftY = useTransform(springY, [-0.5, 0.5], [-15, 15]);
  const midDriftX = useTransform(springX, [-0.5, 0.5], [-45, 45]);
  const midDriftY = useTransform(springY, [-0.5, 0.5], [-45, 45]);
  const nearDriftX = useTransform(springX, [-0.5, 0.5], [-100, 100]);
  const nearDriftY = useTransform(springY, [-0.5, 0.5], [-100, 100]);

  const gridY = useTransform(scrollY, [0, 3000], [0, -400]);
  const bounceY = useTransform(scrollY, [0, 500], [0, -50]);
  const bgScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const gridZ = useTransform(scrollY, [0, 1000], [0, 100]);
  
  // Interactive Cursor Tracking
  const cursorTrackX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const cursorTrackY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  const blob2ParallaxX = useTransform(midDriftX, (v) => (v as number) * -1.2);
  const blob2ParallaxY = useTransform(midDriftY, (v) => (v as number) * -1.2);

  const particleOpacity = useTransform(scrollY, [0, 500], [1, 0.4]); // Optional refine

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Optimize particles rendering to avoid overhead
  const particles = useMemo(() => {
    if (!mounted) return [];
    return [...Array(25)].map((_, i) => ({
      id: i,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 10,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden bg-[#08080a]">
      {/* Layer 0 — Atmosphere (Radial Base) */}
      <div className="absolute inset-0 bg-[#08080a]" />
      <motion.div 
        style={{ scale: bgScale, x: farDriftX, y: farDriftY }}
        className="absolute inset-[-10%] bg-[radial-gradient(circle_at_50%_40%,_rgba(255,106,0,0.18),_transparent_75%)] pointer-events-none" 
      />
      <div className="absolute inset-0 shadow-[inset_0_0_300px_rgba(0,0,0,0.95)] pointer-events-none" />

      {/* Layer 1 — Aurora Field (Energy Waves) */}
      <div className="relative w-full h-full opacity-80 mix-blend-screen pointer-events-none filter blur-[100px]">
        <motion.div 
          animate={{
            x: ['-10%', '10%', '-10%'],
            y: ['-10%', '10%', '-10%'],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-25%] left-[-15%] w-[130%] h-[120%] bg-[radial-gradient(ellipse_at_center,_#ff6a0044_0%,_#ff8c4222_40%,_transparent_70%)]"
        />
        <motion.div 
          animate={{
            x: ['10%', '-10%', '10%'],
            y: ['10%', '-10%', '10%'],
            scale: [1.1, 0.9, 1.1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-25%] right-[-15%] w-[130%] h-[120%] bg-[radial-gradient(ellipse_at_center,_#7c3aed33_0%,_#4c1d9522_40%,_transparent_70%)]"
        />
      </div>

      {/* Layer 2 — Liquid Blobs (SVG Displace Filter) */}
      <div className="absolute inset-0">
        <svg className="hidden">
          <filter id="cinematic-liquid">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="70" />
          </filter>
        </svg>
        <motion.div 
          style={{ 
            x: midDriftX, 
            y: midDriftY,
            filter: 'url(#cinematic-liquid) blur(80px)',
            translateY: bounceY 
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.15, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            rotate: { duration: 100, repeat: Infinity, ease: "linear" },
            scale: { duration: 15, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-[15%] left-[-10%] w-[55vw] h-[55vw] bg-orange-500/[0.15] rounded-[38%] pointer-events-none"
        />
        <motion.div 
          style={{ 
            x: blob2ParallaxX, 
            y: blob2ParallaxY,
            filter: 'url(#cinematic-liquid) blur(110px)' 
          }}
          animate={{
            rotate: -360,
            scale: [1.15, 1, 1.15],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ 
            rotate: { duration: 120, repeat: Infinity, ease: "linear" },
            scale: { duration: 20, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[65vw] h-[65vw] bg-indigo-500/[0.12] rounded-[42%] pointer-events-none"
        />
      </div>

      {/* Layer 3 — Particle Field (Drifting Micro-Matter) */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ left: `${p.initialX}%`, top: `${p.initialY}%`, opacity: 0 }}
            animate={{ 
              opacity: [0, p.opacity + 0.2, 0],
              x: [(Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150],
              y: [(Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150],
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity, 
              ease: "linear",
              delay: p.delay 
            }}
            className="absolute bg-orange-200/60 rounded-full"
            style={{ 
              x: nearDriftX, 
              y: nearDriftY,
              width: `${p.size}px`, 
              height: `${p.size}px`,
              filter: 'blur(0.5px)',
              willChange: 'transform'
            }}
          />
        ))}
      </div>

      {/* Layer 4 — Perspective Grid (3D Architecture) */}
      <div className="absolute inset-0 [perspective:1200px] flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.07]">
        <motion.div 
          style={{ 
            rotateX: 65, 
            y: gridY,
            z: gridZ,
            x: farDriftX
          }}
          className="absolute w-[240%] h-[240%] top-[-20%]"
        >
          <div 
            className="w-full h-full" 
            style={{ 
              backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
              backgroundSize: '120px 120px',
              maskImage: 'radial-gradient(circle, black, transparent 80%)'
            }}
          />
        </motion.div>
      </div>

      {/* Layer 5 — Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Layer 6 — Magnetic Interactive Follower (Global Project-Wide Hover) */}
      <motion.div 
        style={{ left: cursorTrackX, top: cursorTrackY }}
        className="absolute w-[50vw] h-[50vw] -translate-x-1/2 -translate-y-1/2 bg-orange-500/[0.15] blur-[120px] rounded-full pointer-events-none z-10"
      />
    </div>
  );
}
