'use client';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';



export default function Experience() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get(`/api/portfolio`);
        if (data.success) setItems(data.data.experience || []);
      } catch (err) {
        console.error('Error fetching experience:', err);
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
    <section id="experience" className="relative py-20 px-6 overflow-hidden border-t border-white/[0.04]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/[0.02] blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-noise opacity-[0.08]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="mb-12 space-y-3 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500">
              Track 03
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-white leading-none">
            Corporate <span className="text-gradient-primary">Trajectory</span>
          </h2>

          <p className="text-white/40 font-medium text-[13px] md:text-sm max-w-lg leading-relaxed mx-auto md:mx-0">
            Technical contributions and architectural problem-solving in high-impact environments.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((exp, i) => {
              const bullets = exp.description
                ? exp.description
                  .split(/[-•\n]+/)
                  .map((s: string) => s.trim())
                  .filter((s: string) => s.length > 0)
                : [];

              return (
                <motion.div
                  key={exp._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: [0.16, 1, 0.3, 1] as any
                  }}
                  className="group relative"
                >
                  <div className="relative premium-glass p-5 md:p-7 rounded-2xl border border-white/[0.05] group-hover:border-orange-500/20 transition-all duration-500 overflow-hidden">

                    {/* Background Number */}
                    <div className="absolute top-4 right-6 text-6xl font-black text-white/[0.01] select-none pointer-events-none group-hover:text-orange-500/[0.02] transition-colors duration-500">
                      0{i + 1}
                    </div>

                    <div className="relative z-10 space-y-5">
                      {/* Header */}
                      <div className="space-y-3">
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight group-hover:text-orange-500 transition-colors duration-300">
                            {exp.role}
                          </h3>

                          {/* 🔥 Updated Duration */}
                          <div className="flex items-center gap-3 text-white font-extrabold text-[11px] md:text-xs uppercase tracking-wider whitespace-nowrap bg-white/[0.04] px-2 py-1 rounded-md border border-white/[0.06] transition-all duration-300 group-hover:text-orange-500 group-hover:border-orange-500/30 group-hover:bg-orange-500/10">
                            {exp.duration}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                            <span className="text-orange-500 font-bold text-[9px] uppercase tracking-widest">
                              {exp.company}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bullets */}
                      <div className="max-w-4xl">
                        {bullets.length > 0 ? (
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            {bullets.map((bullet: string, idx: number) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.1 + idx * 0.03 }}
                                className="flex items-start gap-3 text-white/60 text-[12px] md:text-[13px] font-medium leading-relaxed min-h-[20px]"
                              >
                                {/* 🔥 Better Dot Alignment */}
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500/40 group-hover:bg-orange-500 transition-colors shrink-0" />
                                <span>{bullet}</span>
                              </motion.li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-white/50 text-[12px] md:text-[13px] font-medium leading-relaxed italic">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}