'use client';
import { motion, AnimatePresence, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ExternalLink, Github, X, Star, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Components ---

function ProjectModal({ proj, onClose }: { proj: any, onClose: () => void }) {
  const images = proj.images?.length > 0 ? proj.images : ['https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&auto=format&fit=crop&q=80'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 backdrop-blur-3xl bg-black/90"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden premium-glass rounded-[2rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-110 transition-all text-white/50 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-3/5 h-64 md:h-auto relative overflow-hidden">
          <img src={images[0]} className="absolute inset-0 w-full h-full object-cover" alt={proj.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        <div className="w-full md:w-2/5 p-8 flex flex-col overflow-y-auto hide-scrollbar">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
              <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-orange-500">
                {proj.featured ? 'Featured' : 'Selected Work'}
              </span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-4 tracking-tight">{proj.title}</h2>
          <p className="text-white/60 text-[13px] leading-relaxed mb-8 font-medium">{proj.description}</p>

          <div className="space-y-4 mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Technology Stack</h4>
            <div className="flex flex-wrap gap-2">
              {proj.techStack?.map((tech: string) => (
                <span key={tech} className="px-2.5 py-1 rounded-lg bg-white/5 text-white/70 border border-white/10 text-[9px] font-bold uppercase tracking-wider">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            {proj.liveLink && (
              <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-orange-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg hover:scale-[1.02]">
                <ExternalLink className="w-4 h-4" /> Live Preview
              </a>
            )}
            {proj.githubLink && (
              <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                <Github className="w-4 h-4" /> Source Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrbitCard({ proj, i, total, angle, onClick }: any) {
  const angleOffset = (i / total) * Math.PI * 2;
  const currentAngle = useTransform(angle, (a: number) => a + angleOffset);

  // Use fixed scale/depth based on professional UI requirements
  const x = useTransform(currentAngle, (a: number) => Math.sin(a) * 420);
  const z = useTransform(currentAngle, (a: number) => Math.cos(a) * 380);

  const opacity = useTransform(z, [-380, 380], [0.15, 1]);
  const scale = useTransform(z, [-380, 380], [0.65, 1.15]);
  const blur = useTransform(z, [-380, 380], [6, 0]);
  const blurValue = useTransform(blur, (v) => `blur(${v}px)`);
  const brightness = useTransform(z, [-380, 380], [0.4, 1.1]);
  const brightnessValue = useTransform(brightness, (v) => `brightness(${v})`);
  const zIndex = useTransform(z, (v) => Math.floor(v + 1000));

  // Mouse tilt effect
  const mouseX = useSpring(0, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);

  return (
    <motion.div
      style={{ x, z, opacity, scale, filter: blurValue, zIndex }}
      className="absolute flex items-center justify-center transform-style-3d cursor-pointer pointer-events-auto"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      <motion.div
        style={{ rotateX, rotateY, filter: brightnessValue }}
        className="premium-glass w-[260px] h-[360px] md:w-[290px] md:h-[400px] rounded-[2.2rem] border border-white/10 overflow-hidden group shadow-2xl relative transition-shadow duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="absolute inset-0 z-0">
          <img src={proj.images?.[0] || 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&auto=format&fit=crop&q=60'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-30 grayscale group-hover:grayscale-0" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        </div>

        <div className="relative z-10 h-full p-7 flex flex-col justify-end">
          <div className="mb-4">
            {proj.featured && (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[8px] font-black uppercase text-orange-500 mb-2 tracking-tighter">
                <Star className="w-2.5 h-2.5 fill-current" /> Featured
              </div>
            )}
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight group-hover:text-orange-400 transition-colors">{proj.title}</h3>
          </div>

          <p className="text-[10px] md:text-[11px] text-white/40 font-medium line-clamp-2 leading-relaxed mb-4 group-hover:text-white/60 transition-colors">
            {proj.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {proj.techStack?.slice(0, 3).map((t: string) => (
              <span key={t} className="px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest bg-white/5 text-white/40 border border-white/5">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-orange-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
            <span>Explore Case</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Motion value for the rotation angle
  const baseAngle = useMotionValue(0);
  const angle = useSpring(baseAngle, { stiffness: 40, damping: 30, restDelta: 0.001 });

  const rotate = (dir: 'left' | 'right') => {
    if (items.length === 0) return;
    const step = (Math.PI * 2) / items.length;
    baseAngle.set(baseAngle.get() + (dir === 'left' ? step : -step));
  };

  useEffect(() => {
    axios.get(`/api/portfolio`)
      .then(({ data }) => {
        if (data.success) setItems(data.data.projects || []);
      })
      .catch((err) => console.error("Project Data Failure:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="relative py-24 px-6 border-t border-white/[0.04] overflow-hidden min-h-[90vh] flex flex-col justify-center">

      {/* Interaction Overlay: Detects Drag to spin the orbit */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDrag={(_, info) => {
          // Convert drag momentum into rotation
          baseAngle.set(baseAngle.get() + info.delta.x * 0.005);
        }}
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full pointer-events-none px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 space-y-3 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500">
              Track 02
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-white leading-none">
            Selected <span className="text-gradient-primary">Works</span>
          </h2>

          <p className="text-white/40 font-medium text-[13px] md:text-sm max-w-lg leading-relaxed mx-auto md:mx-0">
            A curated showcase of technical projects, full-stack applications, and open-source contributions.
          </p>
        </motion.div>
      </div>

      {/* 💻 DESKTOP ORBITAL DISPLAY (Pan-Controlled) */}
      <div className="relative h-[550px] w-full max-w-7xl mx-auto hidden md:flex items-center justify-center">

        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-12 z-[100] pointer-events-none">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => rotate('left')}
            className="p-5 rounded-full premium-glass border border-white/10 text-white/50 hover:text-white transition-colors pointer-events-auto group shadow-[0_0_20px_rgba(0,0,0,0.5)] active:shadow-orange-500/20"
          >
            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => rotate('right')}
            className="p-5 rounded-full premium-glass border border-white/10 text-white/50 hover:text-white transition-colors pointer-events-auto group shadow-[0_0_20px_rgba(0,0,0,0.5)] active:shadow-orange-500/20"
          >
            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <motion.div
          onPan={(_, info) => {
            baseAngle.set(baseAngle.get() + info.delta.x * 0.005);
          }}
          className="relative w-full h-full flex items-center justify-center perspective-2000 transform-style-3d cursor-grab active:cursor-grabbing"
        >
          {!loading && items.length > 0 && (
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none transform-style-3d">
              {items.map((proj, i) => (
                <OrbitCard
                  key={proj._id || i}
                  proj={proj}
                  i={i}
                  total={items.length}
                  angle={angle}
                  onClick={() => setSelectedProject(proj)}
                />
              ))}

              {/* Minimal Orbit Path Indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] border border-white/[0.03] rounded-full" />
            </div>
          )}
        </motion.div>
      </div>

      {/* 📱 MOBILE VIEW: Premium Horizontal Scroller */}
      <div className="md:hidden relative z-10 w-full pointer-events-auto">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 px-6 hide-scrollbar pb-10">
          {items.map((proj, i) => (
            <motion.div
              key={proj._id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="snap-center shrink-0 w-[280px] h-[380px] relative rounded-[2rem] premium-glass border border-white/10 overflow-hidden"
              onClick={() => setSelectedProject(proj)}
            >
              <div className="absolute inset-0 z-0">
                <img src={proj.images?.[0]} className="w-full h-full object-cover opacity-30 grayscale" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
              <div className="relative z-10 h-full p-7 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">{proj.title}</h3>
                <p className="text-[10px] text-white/40 line-clamp-2 mb-4 font-medium">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {proj.techStack?.slice(0, 3).map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-white/5 text-white/40 border border-white/5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {!loading && items.length > 0 && (
        <div className="mt-12 flex flex-col items-center gap-4 relative z-10 pointer-events-none">
          <motion.div
            animate={{ x: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-white/20"
          >
            <ChevronRight className="w-4 h-4 text-orange-500" /> Interaction : Swipe / Drag to Rotate
          </motion.div>
        </div>
      )}

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            proj={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
