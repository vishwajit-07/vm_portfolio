'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';



export default function AdminMessages() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  } as any;
  const [error, setError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/messages`, {
        withCredentials: true,
        headers: authHeaders,
      });
      setItems(data.data || (Array.isArray(data) ? data : []));
    } catch {
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this inquiry?')) return;
    try {
      await axios.delete(`/api/messages/${id}`, {
        withCredentials: true,
        headers: authHeaders,
      });
      fetchData();
    } catch {
      alert('Failed to delete. Please try again.');
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await axios.put(`/api/messages/${id}/read`, {}, {
        withCredentials: true,
        headers: authHeaders,
      });
      fetchData();
    } catch { }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter gradient-text-orange uppercase font-display">Inquiries Inbox</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">Listen to what your visitors have to say.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [1, 2].map(i => <div key={i} className="glass-card p-10 rounded-2xl animate-pulse h-40" />)
        ) : items.length === 0 ? (
          <div className="p-20 text-center text-muted-foreground glass-card rounded-2xl border border-dashed border-orange-500/20">
            <div className="text-6xl mb-6 opacity-30">📭</div>
            <p className="text-xl font-medium tracking-tight">Your inbox is completely empty.</p>
            <p className="text-sm mt-2">Inquiries from your contact form will appear here.</p>
          </div>
        ) : (
          <AnimatePresence>
            {items.map((msg, index) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group glass-card p-8 rounded-2xl border transition-all duration-300 ${
                  !msg.isRead 
                    ? 'border-orange-500/40 bg-orange-500/5 glow-orange-sm' 
                    : 'border-orange-500/10 hover:border-orange-500/25'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-6">
                  <div className="space-y-1">
                    {!msg.isRead && (
                      <span className="inline-block px-2 py-0.5 bg-orange-500 text-[10px] font-black uppercase text-white rounded-md mb-2 tracking-widest animate-pulse">NEW</span>
                    )}
                    <h3 className="font-black text-xl md:text-2xl tracking-tighter text-foreground font-display lowercase">{msg.name}</h3>
                    <div className="flex items-center gap-3">
                      <a href={`mailto:${msg.email}`} className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                        <span>📧</span> {msg.email}
                      </a>
                      <span className="text-muted-foreground opacity-30 px-1">•</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!msg.isRead && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkRead(msg._id)} className="h-9 px-4 font-bold text-xs uppercase tracking-widest bg-background/50 border-orange-500/30 hover:bg-orange-500/10">Read</Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(msg._id)} className="h-9 px-4 font-bold text-xs uppercase tracking-widest opacity-80 hover:opacity-100">Delete</Button>
                  </div>
                </div>
                
                <div className="p-6 rounded-xl bg-background/40 border border-orange-500/5 group-hover:border-orange-500/10 transition-colors">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">{msg.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
