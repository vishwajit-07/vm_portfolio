'use client';
import { motion } from 'framer-motion';
import { TimelineContainer, TimelineItem } from '@/components/ui/Timeline';
import type { Experience as ExperienceType } from '@/lib/getPortfolio';

interface ExperienceProps {
  items: ExperienceType[];
}

export default function Experience({ items }: ExperienceProps) {
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
          viewport={{ once: true, margin: '-100px' }}
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

        {items.length === 0 ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <TimelineContainer>
            {items.map((exp, i) => {
              const bullets = exp.description
                ? exp.description
                    .split(/[-•\n]+/)
                    .map((s: string) => s.trim())
                    .filter((s: string) => s.length > 0)
                : [];

              let startDate: string | undefined;
              const isCurrent = exp.duration?.toLowerCase().includes('present');
              if (isCurrent && exp.duration) {
                const parts = exp.duration.split('-');
                if (parts.length > 0) {
                  startDate = parts[0].trim();
                }
              }

              return (
                <TimelineItem
                  key={exp._id || i}
                  index={i}
                  position={i % 2 === 0 ? 'left' : 'right'}
                  title={exp.role}
                  subtitle={exp.company}
                  duration={exp.duration ?? ''}
                  description={bullets.length === 0 ? exp.description : undefined}
                  itemsList={bullets.length > 0 ? bullets : undefined}
                  tags={exp.skills}
                  startDate={startDate}
                  iconLetter={exp.company ? exp.company.charAt(0) : 'E'}
                />
              );
            })}
          </TimelineContainer>
        )}
      </div>
    </section>
  );
}