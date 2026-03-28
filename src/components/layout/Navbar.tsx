'use client';

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import {
  Home,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Mail,
  Layers,
} from 'lucide-react';

import NavItem from '@/components/ui/NavItem';

const navItems = [
  { name: 'Home', id: 'home', icon: Home },
  { name: 'Experience', id: 'experience', icon: Briefcase },
  { name: 'Projects', id: 'projects', icon: FolderKanban },
  { name: 'Education', id: 'education', icon: GraduationCap },
  { name: 'Skills', id: 'skills', icon: Layers },
  { name: 'Contact', id: 'contact', icon: Mail },
];



export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) =>
    setScrolled(latest > 50)
  );

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get(`/api/portfolio`);
        if (data.success) setProfile(data.data);
      } catch (error) {
        console.error('Error fetching navbar data:', error);
      }
    };
    fetchPortfolio();
  }, []);

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
          ? 'bg-[#0B0B0F]/80 backdrop-blur-xl border-b border-white/10 h-14'
          : 'bg-transparent h-20'
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex justify-between items-center">

        {/* LOGO */}
        <Link href="#home" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            {profile?.name?.[0] || 'V'}
          </div>
          <span className="text-sm font-semibold text-white uppercase">
            {profile?.name || 'VISHWAJIT'}
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="relative flex items-center gap-2 p-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">

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

          {/* Portal */}
          <Link
            href="/admin/login"
            className="px-4 h-9 flex items-center justify-center rounded-full border border-white/10 text-xs text-white uppercase tracking-widest hover:bg-white/5"
          >
            Portal
          </Link>
        </nav>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 bg-[#0B0B0F]/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-6"
          >
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                name={item.name}
                id={item.id}
                icon={item.icon}
                active={activeSection === item.id}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}