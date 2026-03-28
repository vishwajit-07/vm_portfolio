'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';



export default function Skills() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  /* 🔥 Faces (same but safer mapping) */
  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];

  return (
    <section id="skills" className="relative py-24 px-6 overflow-hidden border-t border-white/[0.04]">

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER + CUBE */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between gap-10 md:gap-20 mb-16">

          {/* TEXT */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
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

          {/* 🔥 3D SKILL CUBE (UPDATED SAFE VERSION) */}
          <div className="cube-container flex justify-center md:justify-end w-full md:w-auto">
            <div className="cube">

              {/* always ensure 6 faces */}
              {faces.map((face, i) => (
                <div key={i} className={`face ${face}`}>
                  {items[i]?.name || 'Skill'}
                </div>
              ))}

            </div>
          </div>

        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {items.map((skill, i) => (
              <motion.div
                key={skill._id || i}
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative premium-glass p-5 rounded-2xl group flex flex-col gap-5 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] hover:bg-white/10 transition-all duration-300"
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

      </div>
    </section>
  );
}