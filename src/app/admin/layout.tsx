'use client';

import { useStore } from '@/store/useStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdminAuth = useStore((state) => state.isAdminAuth);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAdminAuth && !pathname.includes('/login')) {
      router.push('/admin/login');
    }
  }, [isAdminAuth, pathname, router, mounted]);

  // Prevent Next.js Hydration Mismatch issues occurring due to LocalStorage
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {isAdminAuth && !pathname.includes('/login') && (
        <motion.aside 
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          className="w-full md:w-64 border-r border-border bg-card/50 p-6 flex flex-col gap-6"
        >
          <div className="text-xl font-black tracking-[0.2em] uppercase gradient-text-orange font-display">ELITE CMS</div>
          <nav className="flex flex-col gap-1 flex-1">
            <Link href="/admin/dashboard" className={`p-3 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${pathname === '/admin/dashboard' ? 'bg-orange-500/10 text-orange-500 shadow-glow-orange-sm' : 'hover:bg-orange-500/5 text-muted-foreground hover:text-foreground'}`}>Dashboard</Link>
            <Link href="/admin/profile" className={`p-3 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${pathname === '/admin/profile' ? 'bg-orange-500/10 text-orange-500 shadow-glow-orange-sm' : 'hover:bg-orange-500/5 text-muted-foreground hover:text-foreground'}`}>Profile</Link>
            <Link href="/admin/projects" className={`p-3 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${pathname === '/admin/projects' ? 'bg-orange-500/10 text-orange-500 shadow-glow-orange-sm' : 'hover:bg-orange-500/5 text-muted-foreground hover:text-foreground'}`}>Projects</Link>
            <Link href="/admin/skills" className={`p-3 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${pathname === '/admin/skills' ? 'bg-orange-500/10 text-orange-500 shadow-glow-orange-sm' : 'hover:bg-orange-500/5 text-muted-foreground hover:text-foreground'}`}>Skills</Link>
            <Link href="/admin/education" className={`p-3 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${pathname === '/admin/education' ? 'bg-orange-500/10 text-orange-500 shadow-glow-orange-sm' : 'hover:bg-orange-500/5 text-muted-foreground hover:text-foreground'}`}>Education</Link>
            <Link href="/admin/experiences" className={`p-3 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${pathname === '/admin/experiences' ? 'bg-orange-500/10 text-orange-500 shadow-glow-orange-sm' : 'hover:bg-orange-500/5 text-muted-foreground hover:text-foreground'}`}>Experience</Link>
            <Link href="/admin/messages" className={`p-3 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${pathname === '/admin/messages' ? 'bg-orange-500/10 text-orange-500 shadow-glow-orange-sm' : 'hover:bg-orange-500/5 text-muted-foreground hover:text-foreground'}`}>Messages</Link>
          </nav>
          <button 
            onClick={async () => {
              try {
                await axios.post('/api/admin/logout');
              } catch (err) {
                console.error('Logout error:', err);
              }
              useStore.getState().setAdminAuth(false);
              localStorage.removeItem('adminToken');
              router.push('/admin/login');
            }}
            className="text-left p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
          >
            Terminal Shutdown
          </button>
        </motion.aside>
      )}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
