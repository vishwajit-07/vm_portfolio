'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';



export default function Skills() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get(`/api/portfolio`);
        if (data.success) setItems(data.data.skills || []);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const gravityFall = {
    hidden: { 
      opacity: 0, 
      y: -100, 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 120,
        bounce: 0.2,
        duration: 0.6
      }
    }
  };

  /* 🔥 Faces (same but safer mapping) */
  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];

  return (
    <section id="skills" className="relative py-24 px-6 overflow-hidden border-t border-white/[0.04] min-h-[600px]">
      <div className="max-w-6xl mx-auto relative z-10">
        {!mounted ? (
           <div className="w-full flex justify-center pt-20">
              <div className="w-8 h-8 border-2 border-white/10 border-t-orange-500 rounded-full animate-spin" />
           </div>
        ) : (
          <>
            {/* HEADER + CUBE */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between gap-10 md:gap-20 mb-16">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={gravityFall as any}
                className="space-y-4 text-center md:text-left"
              >
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">
                    Architecture
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
                  Technical <span className="text-orange-500">Core</span>
                </h2>

                <p className="text-white/40 max-w-lg text-sm md:text-base leading-relaxed">
                  A high-performance technical stack engineered for modular scalability and precision.
                </p>
              </motion.div>

              <div className="cube-container flex justify-center md:justify-end w-full md:w-auto">
                <div className="cube">
                  {faces.map((face, i) => (
                    <div key={i} className={`face ${face}`}>
                      {items[i]?.name || 'Skill'}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants as any}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {items.map((skill, i) => (
                  <motion.div
                    key={skill._id || i}
                    variants={gravityFall as any}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="relative glass-light will-change-premium p-5 rounded-2xl group flex flex-col gap-5 hover:bg-white/5 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-white/[0.03] group-hover:bg-orange-500/20 group-hover:text-orange-400">
                        {skill.icon || '⚡'}
                      </div>
                      <span className="text-[9px] text-white/30 font-bold">
                        {skill.level}%
                      </span>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:text-orange-400">
                        {skill.name}
                      </h3>

                      <div className="h-[2px] bg-white/[0.05] mt-2 overflow-hidden rounded-full">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}