'use client';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';



const ROTATION_SPEED = 0.002;

import { ExternalLink, Github, X, ChevronLeft, ChevronRight, Star } from 'lucide-react';

function ProjectModal({ proj, onClose }: { proj: any, onClose: () => void }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = proj.images?.length > 0 ? proj.images : ['https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&auto=format&fit=crop&q=80'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-10 backdrop-blur-2xl bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden premium-glass rounded-[2rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-110 transition-all text-white/50 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Image Gallery */}
        <div className="w-full md:w-3/5 h-64 md:h-auto relative group">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              src={images[currentImage]}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {images.length > 1 && (
            <div className="absolute inset-x-4 bottom-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:bg-white/10 text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:bg-white/10 text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_: any, i: number) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${currentImage === i ? 'bg-orange-500 w-4' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col overflow-y-auto hide-scrollbar">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
              <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-orange-500">{proj.featured ? 'Featured Project' : 'Project'}</span>
            </div>
            {proj.githubLink && (
              <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/10 transition-all text-white/40 hover:text-white">
                <Github className="w-4 h-4" />
              </a>
            )}
            {proj.liveLink && (
              <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/10 transition-all text-white/40 hover:text-white">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">{proj.title}</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Description</h4>
              <p className="text-white/60 text-[13px] leading-relaxed font-medium">{proj.description}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Technology Stack</h4>
              <div className="flex flex-wrap gap-2">
                {proj.techStack?.map((tech: string) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg bg-orange-500/5 text-orange-400/80 border border-orange-500/10 text-[9px] font-bold uppercase tracking-wider">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-auto grid grid-cols-2 gap-4">
              {proj.liveLink && (
                <a
                  href={proj.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-orange-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:scale-[1.02] active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Preview
                </a>
              )}
              {proj.githubLink && (
                <a
                  href={proj.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Github className="w-4 h-4" />
                  Codebase
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrbCard({ proj, angle, onClick, isFocused }: { proj: any, angle: number, onClick: () => void, isFocused: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const z = Math.cos(angle);
  const xValue = Math.sin(angle) * 75;

  const focus = (z + 1) / 2;
  const scale = 0.6 + (focus * 0.45);
  const opacity = 0.15 + (focus * 0.85);
  const blur = (1 - focus) * 6;
  const zIndex = Math.round(focus * 100);
  const brightness = 50 + (focus * 70);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), { stiffness: 100, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), { stiffness: 100, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (focus < 0.8) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const projectImage = proj.images?.[0] || 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&auto=format&fit=crop&q=60';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      onClick={onClick}
      animate={{
        x: `${xValue}%`,
        scale: isFocused ? scale * 1.05 : scale,
        opacity,
        filter: `blur(${blur}px) brightness(${brightness}%)`,
        zIndex: isFocused ? 200 : zIndex
      }}
      transition={{ type: 'spring', stiffness: 50, damping: 20, mass: 1 }}
      className="absolute left-1/2 -ml-[110px] md:-ml-[140px] top-[5%] w-[220px] md:w-[280px] h-[340px] md:h-[400px] cursor-pointer group select-none"
      style={{ perspective: 1200, rotateX: focus > 0.8 ? rotateX : 0, rotateY: focus > 0.8 ? rotateY : 0, transformStyle: 'preserve-3d' }}
    >
      <div className={`relative h-full w-full premium-glass rounded-[2rem] overflow-hidden border transition-all duration-700 ${focus > 0.9 ? 'border-orange-500/40 shadow-[0_0_60px_rgba(249,115,22,0.2)]' : 'border-white/[0.08]'}`}>

        {/* Project Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            style={{ x: useTransform(mouseX, [-0.5, 0.5], [10, -10]), y: useTransform(mouseY, [-0.5, 0.5], [10, -10]) }}
            src={projectImage}
            alt={proj.title}
            className={`w-[110%] h-[110%] -left-[5%] -top-[5%] object-cover transition-all duration-700 ${focus < 0.8 ? 'opacity-10 scale-110 grayscale' : 'opacity-40 grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-20 h-full p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm border transition-all duration-500 ${focus > 0.9 ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-white/[0.03] border-white/[0.05] text-white/20'}`}>
              {proj.featured ? <Star className="w-4 h-4 fill-current" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
            </div>
            {proj.githubLink && focus > 0.9 && (
              <div className="flex gap-2">
                <div className="p-2 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md text-white/50 hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3 mt-auto">
            <h3 className={`font-bold tracking-tight leading-tight transition-all duration-700 ${focus > 0.9 ? 'text-base md:text-lg' : 'text-white/30 text-sm'}`}>{proj.title}</h3>
            <p className={`text-[10px] font-medium leading-[1.6] transition-all duration-700 line-clamp-2 ${focus > 0.8 ? 'text-white/40' : 'text-white/10'}`}>
              {proj.description}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
            {(proj.techStack || []).slice(0, 4).map((t: string) => (
              <span key={t} className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-white/[0.05] text-white/50 border border-white/[0.05]">
                {t}
              </span>
            ))}
          </div>

          {/* View Details Hint */}
          <div className={`mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500 transition-all duration-700 ${focus > 0.95 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span>Open Catalog</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [angle, setAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const requestRef = useRef<number>(0);

  const projectCount = items.length;

  useEffect(() => {
    axios.get(`/api/portfolio`)
      .then(({ data }) => {
        if (data.success && data.data.projects) {
          const fetchedProjects = data.data.projects;
          setItems(fetchedProjects);
          setActiveIndex(0);
          
          // Set initial angle so index 0 is focused
          if (fetchedProjects.length === 2) {
            setAngle(0.5);
          } else {
            setAngle(0);
          }
        }
      })
      .catch((err) => console.log("Database Fetch Persistence Failure:", err))
      .finally(() => setLoading(false));
  }, []);

  const animate = () => {
    if (!isPaused && !selectedProject && projectCount > 2) {
      setAngle(prev => (prev + ROTATION_SPEED) % (Math.PI * 2));
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPaused, selectedProject]);

  const focusOnCard = (index: number) => {
    if (projectCount === 0) return;
    
    let targetAngle = 0;
    if (projectCount === 2) {
      // For 2 items, we want the active one at 0, and the other at 0.5 or -0.5
      // If we use: itemAngle = angle + (index === 0 ? -0.5 : 0.5)
      // then to make itemIndex 0 at 0, angle must be 0.5.
      // to make itemIndex 1 at 0, angle must be -0.5.
      targetAngle = index === 0 ? 0.5 : -0.5;
      setAngle(targetAngle);
    } else if (projectCount >= 3) {
      targetAngle = index * (Math.PI * 2 / projectCount);
      setAngle(-targetAngle);
    } else {
      setAngle(0);
    }
    setActiveIndex(index);
  };

  const handleCardClick = (index: number) => {
    if (activeIndex === index) {
      setSelectedProject(items[index]);
    } else {
      focusOnCard(index);
    }
  };

  return (
    <section id="projects" className="relative py-24 px-6 border-t border-white/[0.04] overflow-hidden min-h-[85vh] flex flex-col justify-center">

      {/* Reactive Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: Math.sin(angle) * 100, y: Math.cos(angle) * 50 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[150px] rounded-full"
        />
        <div className="absolute inset-0 bg-noise opacity-30" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
          className="mb-16 space-y-4 text-center md:text-left"
        >

          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white leading-none">
            Project <span className="text-gradient-primary">Work</span>
          </h2>
          <p className="text-white/40 font-medium text-sm md:text-base max-w-xl leading-relaxed mx-auto md:mx-0">
            An interactive gravity-balanced catalog of complex engineering and high-end digital architectures.
          </p>
        </motion.div>
      </div>

      <div
        className="relative h-[500px] w-full max-w-7xl mx-auto flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {items.length > 0 ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence>
              {items.map((proj, i) => {
                let itemAngle = 0;
                if (projectCount === 1) {
                  itemAngle = 0;
                } else if (projectCount === 2) {
                  // For 2 projects, they have fixed relative offset of 1.0 rad (~57deg)
                  // angle drives the shift to focus one or the other.
                  itemAngle = angle + (i === 0 ? -0.5 : 0.5);
                } else {
                  itemAngle = angle + (i * (Math.PI * 2 / projectCount));
                }

                return (
                  <OrbCard
                    key={proj._id || i}
                    proj={proj}
                    angle={itemAngle}
                    isFocused={activeIndex === i}
                    onClick={() => handleCardClick(i)}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="text-4xl opacity-20">✦</div>
              <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase">Awaiting Digital Manifest...</p>
            </motion.div>
          </div>
        )}
      </div>

      {!loading && items.length > 0 && (
        <div className="mt-12 flex flex-col items-center gap-6 relative z-10 font-bold group">
          <div className="flex gap-3 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl">
            {items.map((_, i) => (
              <button
                key={i} onClick={() => focusOnCard(i)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${activeIndex === i ? 'bg-orange-500 w-10 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-white/10 hover:bg-white/30'}`}
              />
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 group-hover:text-orange-500/50 transition-colors">Select Archive Node</p>
        </div>
      )}

      {/* Detail Modal */}
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
