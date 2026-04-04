'use client';

import {
  motion,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Mail,
  Layers,
  FileText,
} from 'lucide-react';

import NavItem from '@/components/ui/NavItem';

const navItems = [
  { name: 'Home', id: 'home', icon: Home },
  { name: 'Experience', id: 'experience', icon: Briefcase },
  { name: 'Projects', id: 'projects', icon: FolderKanban },
  { name: 'Education', id: 'education', icon: GraduationCap },
  { name: 'Skills', id: 'skills', icon: Layers },
  { name: 'Resume', id: 'resume', icon: FileText },
  { name: 'Contact', id: 'contact', icon: Mail },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) =>
    setScrolled(latest > 50)
  );

  // 🔥 Active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;

      navItems.forEach((item) => {
        const el = document.getElementById(item.id);
        if (!el) return;

        const top = el.offsetTop;
        const height = el.offsetHeight;

        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(item.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-background/80 backdrop-blur-xl border-b border-border h-14'
        : 'bg-transparent h-20'
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex justify-between items-center">

        {/* LOGO */}
        <Link href="#home" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            {'V'}
          </div>
          <span className="hidden md:block text-sm font-semibold text-foreground uppercase">
            {'VISHWAJIT'}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <ul className="relative flex items-center gap-2 p-1 rounded-full bg-card backdrop-blur-xl border border-border">

            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <li key={item.id} className="relative">

                  {/* 🔥 Sliding Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  <NavItem
                    name={item.name}
                    id={item.id}
                    icon={item.icon}
                    active={isActive}
                  />
                </li>
              );
            })}
          </ul>

          <Link
            href="/admin/login"
            className="px-4 h-9 flex items-center justify-center rounded-full border border-border text-xs text-foreground/70 uppercase tracking-widest hover:bg-card"
          >
            Portal
          </Link>
        </nav>

        {/* MOBILE NAV (TOP) */}
        <nav className="md:hidden flex items-center gap-2 overflow-x-auto hide-scrollbar ml-4">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActive
                  ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-premium'
                  : 'bg-card border border-border text-foreground/50 hover:text-orange-500 hover:bg-orange-500/10'
                  }`}
              >
                <Icon size={14} />
              </Link>
            );
          })}
          <Link
            href="/admin/login"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-border text-foreground/70 hover:bg-card ml-1 bg-card"
          >
            <div className="text-[10px] uppercase font-bold">In</div>
          </Link>
        </nav>
      </div>
    </header>
  );
}