'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import WordMorph from '@/components/animations/WordMorph';



const ROLES = [
  'Full-Stack Engineer',
  'MERN Developer',
  'React & UI Engineer',
];

export default function Hero() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const orbitConfigs = useMemo(
    () => [
      { top: '-5%', left: '-5%', x: [0, 15, 0], y: [0, -10, 0], rot: [0, 5, 0], dur: 6 },
      { top: '10%', right: '-10%', x: [0, -10, 0], y: [0, 20, 0], rot: [0, -8, 0], dur: 8 },
      { bottom: '10%', left: '-10%', x: [0, 20, 0], y: [0, 15, 0], rot: [0, 10, 0], dur: 7 },
      { bottom: '-5%', right: '0%', x: [0, -15, 0], y: [0, -15, 0], rot: [0, -5, 0], dur: 9 },
    ],
    []
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 80,
    damping: 25,
  });

  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), {
    stiffness: 80,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get(`/api/portfolio`);
        if (data.success) setProfile(data.data);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] flex items-center pt-20 pb-16 px-6"
    >
      {loading ? (
        <div className="max-w-6xl mx-auto w-full flex justify-center">
          <div className="w-8 h-8 border-2 border-white/10 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">

            {/* LEFT */}
            <motion.div
              style={{ x, y }}
              className="flex-1 text-center md:text-left space-y-6 md:space-y-8"
            >
              <span className="inline-flex px-2 py-0.5 rounded-full bg-orange-500/5 border border-orange-500/10 text-[9px] font-black text-orange-400 uppercase tracking-[0.2em]">
                {profile?.name ? `HI, I'M ${profile.name}` : 'WELCOME'}
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                Building digital products <br className="hidden md:block" />
                as a{' '}
                <span className="inline-flex min-w-[200px] md:min-w-[300px] text-left">
                  <WordMorph words={profile?.title ? profile.title.split(',').map((r: string) => r.trim()) : ROLES} />
                </span>
              </h1>

              <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto md:mx-0">
                {profile?.bio}
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button className="bg-orange-500 text-white px-6 h-10 text-xs font-bold">
                  Manifest
                </Button>
                <Button variant="outline" className="border-white/10 px-6 h-10 text-xs">
                  Connect
                </Button>
              </div>
            </motion.div>

            <div className="relative flex flex-col items-center md:items-end w-full md:w-auto">

              {/* IMAGE */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-48 h-56 sm:w-56 sm:h-64 md:w-64 md:h-72 lg:w-72 lg:h-[340px]"
              >
                <Image
                  src={profile?.profileImage || '/profile.png'}
                  alt="profile"
                  fill
                  className="object-cover object-center rounded-3xl"
                />
              </motion.div>

              {/* 🔥 DESKTOP ORBIT (INSANE INTERACTION) */}
              <div className="hidden md:block">
                {profile?.skills?.slice(0, 4).map((skill: any, index: number) => {
                  const config = orbitConfigs[index];

                  return (
                    <motion.div
                      key={index}
                      animate={{
                        x: config.x,
                        y: config.y,
                        rotate: config.rot,
                      }}
                      transition={{
                        duration: config.dur,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{
                        position: 'absolute',
                        top: config.top,
                        left: config.left,
                        right: config.right,
                        bottom: config.bottom,
                      }}
                      className="z-20"
                    >
                      {/* 🔥 MAGNETIC WRAPPER */}
                      <div
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left - rect.width / 2;
                          const y = e.clientY - rect.top - rect.height / 2;

                          e.currentTarget.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = `translate(0px, 0px)`;
                        }}
                        className="transition-transform duration-200"
                      >
                        {/* 🔥 SKILL CARD */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="
                px-3 py-1.5 rounded-lg
                bg-gradient-to-r from-orange-500/10 to-orange-400/10
                border border-orange-400/20
                backdrop-blur-md
                shadow-[0_0_20px_rgba(249,115,22,0.2)]
                flex items-center gap-2
                hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]
                transition-all duration-300
              "
                        >
                          <span className="text-orange-400 text-xs">
                            {skill.icon || '⚡'}
                          </span>

                          <span className="text-white text-[10px] font-semibold uppercase tracking-wider">
                            {skill.name}
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* 📱 MOBILE GRID */}
              <div className="grid grid-cols-3 gap-2 mt-4 md:hidden w-full max-w-xs">
                {profile?.skills?.slice(0, 6).map((skill: any, index: number) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="
          text-center px-2 py-2 rounded-lg
          bg-gradient-to-r from-orange-500/10 to-orange-400/10
          border border-orange-400/20
          text-[9px] text-white font-semibold
          shadow-[0_0_15px_rgba(249,115,22,0.15)]
        "
                  >
                    {skill.name}
                  </motion.div>
                ))}
              </div>

              {/* GLOW */}
              <div className="absolute inset-[-25px] bg-orange-500/10 blur-[60px] rounded-full -z-10" />
            </div>

          </div>
        </div>
      )}
    </section>
  );
}