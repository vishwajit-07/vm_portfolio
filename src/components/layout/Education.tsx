'use client';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';



export default function Education() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get(`/api/portfolio`);
        if (data.success) setItems(data.data.education || []);
      } catch (err) {
        console.error('Error fetching education:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  return (
    <section id="education" className="relative py-24 px-6 overflow-hidden border-t border-white/[0.04]">

      <div className="max-w-6xl xl:max-w-[1150px] mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="mb-16 space-y-4 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">
              Foundations
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white leading-none">
            Academic <span className="text-gradient-primary">Background</span>
          </h2>

          <p className="text-white/40 font-medium text-sm md:text-base max-w-lg leading-relaxed mx-auto md:mx-0">
            A solid theoretical foundation in computing and modular systems engineering.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-8">
            {[1, 2].map(i => (
              <div
                key={i}
                className="h-48 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="relative space-y-12">
            {/* Timeline Line */}
            <div className="absolute left-[24px] md:left-[32px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-orange-500/20 via-white/5 to-transparent" />

            {items.map((item, i) => (
              <motion.div
                key={item._id || i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="relative pl-16 md:pl-24 group"
              >
                {/* Timeline Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="absolute left-[20px] md:left-[28px] top-[28px] w-3 h-3 rounded-full bg-orange-500 border-4 border-[#0B0B0F] z-10 shadow-[0_0_15px_rgba(249,115,22,0.6)] group-hover:scale-125 transition-transform"
                />

                {/* Card */}
                <div className="premium-glass p-6 md:p-8 rounded-3xl group-hover:bg-white/10 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2">

                  <div className="relative z-20 flex flex-col gap-6 mb-6">

                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-none transition-colors duration-300 group-hover:text-orange-500">
                        {item.degree}
                      </h3>

                      <span className="text-white font-extrabold text-[10px] uppercase tracking-[0.15em] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] transition-all duration-300 group-hover:text-orange-500 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 whitespace-nowrap">
                        {item.duration || item.year}
                      </span>
                    </div>

                    {/* School + CGPA + Duration */}
                    <div className="flex items-center justify-between gap-4">

                      {/* Left Side */}
                      <div className="flex flex-col gap-1">
                        <span className="text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 group-hover:text-orange-400">
                          {item.school || item.college}
                        </span>

                        {/* 🔥 CGPA */}
                        {item.cgpa && (
                          <span className="text-white/70 font-semibold text-[10px] tracking-wide transition-all duration-300 group-hover:text-orange-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_10px_rgba(249,115,22,1)]">                            CGPA: {item.cgpa}
                          </span>
                        )}
                      </div>


                    </div>
                  </div>

                  {/* Description */}
                  <div className="max-w-4xl relative z-20">
                    <p className="text-white/40 font-medium text-sm leading-relaxed opacity-90">
                      {item.description}
                    </p>
                  </div>

                  {/* Glow */}
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-48 bg-orange-500/5 blur-[60px] rounded-full pointer-events-none group-hover:opacity-40 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}