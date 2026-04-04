'use client';
import { motion } from 'framer-motion';
import { TimelineContainer, TimelineItem } from '@/components/ui/Timeline';
import type { Education as EducationType } from '@/lib/getPortfolio';

interface EducationProps {
  items: EducationType[];
}

import FadeIn from '@/components/animations/FadeIn';

export default function Education({ items }: EducationProps) {
  return (
    <section id="education" className="relative py-24 px-6 overflow-hidden border-t border-white/[0.04]">
      <div className="max-w-6xl xl:max-w-[1150px] mx-auto relative z-10">
        <FadeIn>
          <div className="mb-16 space-y-4 text-center md:text-left">
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
          </div>
        </FadeIn>

        {items.length === 0 ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <TimelineContainer>
            {items.map((item, i) => (
              <TimelineItem
                key={item._id || i}
                index={i}
                position={i % 2 === 0 ? 'left' : 'right'}
                title={item.degree}
                subtitle={(item.school || item.college) ?? ''}
                duration={(item.duration || item.year) ?? ''}
                description={item.description}
                tags={item.cgpa ? [`CGPA: ${item.cgpa}`] : undefined}
                iconLetter={(item.school || item.college) ? (item.school || item.college)!.charAt(0) : 'E'}
              />
            ))}
          </TimelineContainer>
        )}
      </div>
    </section>
  );
}