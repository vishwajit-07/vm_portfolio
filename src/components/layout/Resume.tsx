'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FileText, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { PortfolioData } from '@/lib/getPortfolio';

interface ResumeProps {
  profile: PortfolioData | null;
}

export default function Resume({ profile }: ResumeProps) {
  if (!profile?.resumeUrl) return null;

  return (
    <section id="resume" className="relative py-24 px-6 overflow-hidden border-t border-border-subtle bg-card/30">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-6 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500">Credentials</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground leading-tight">
              Professional <br /> <span className="text-gradient-primary">Curriculum Vitae</span>
            </h2>
            
            <p className="text-foreground/50 font-medium text-sm md:text-base max-w-lg leading-relaxed mx-auto md:mx-0">
              My resume provides a comprehensive overview of my technical expertise, 
              professional experience, and academic background in software engineering.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href={profile.resumeUrl} target="_blank" download>
                <Button className="shimmer-effect bg-orange-500 text-white font-black px-8 h-12 rounded-xl shadow-premium hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
              </Link>
              <Link href={profile.resumeUrl} target="_blank">
                <Button variant="outline" className="border-border text-foreground/70 px-8 h-12 rounded-xl hover:bg-card flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> View Online
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="relative w-full max-w-sm cursor-pointer"
            onClick={() => window.open(profile.resumeUrl, '_blank')}
          >
            <div className="aspect-[3/4] premium-glass rounded-[2rem] border border-border-subtle flex flex-col group hover:border-orange-500/30 transition-all duration-500 overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 z-0 opacity-50 contrast-[1.1]">
                <iframe 
                  src={`${profile.resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full border-none pointer-events-none scale-[1.02]"
                  title="Resume Preview"
                />
              </div>

              <div className="relative z-10 p-8 flex flex-col justify-between h-full bg-background/40 backdrop-blur-[2px]">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 backdrop-blur-md flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-inner">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40 bg-background/50 px-2 py-1 rounded-md border border-border-subtle">Resume.pdf</div>
                </div>

                <div className="pt-6 border-t border-border-subtle flex items-center justify-between mt-auto">
                  <div className="text-[9px] font-bold text-foreground/60 uppercase">Click to view full</div>
                  <Link 
                    href={profile.resumeUrl} 
                    target="_blank" 
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />
            </div>
            
            {/* Absolute decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-500/10 blur-3xl rounded-full -z-10" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-500/10 blur-3xl rounded-full -z-10" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
