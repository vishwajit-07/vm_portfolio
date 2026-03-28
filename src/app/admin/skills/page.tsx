'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';


const EMPTY = { name: '', level: '80', icon: '⚡' };

export default function AdminSkills() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/portfolio`);
      if (data.success) {
        setPortfolio(data.data);
      }
    } catch (e) {
      setError('Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const items = portfolio?.skills || [];

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ name: item.name, level: item.level.toString(), icon: item.icon || '⚡' });
    setError(''); setShowModal(true);
  };

  const syncSkills = async (updatedSkills: any[]) => {
    setSaving(true); setError('');
    try {
      // Cleanup: Remove temporary _ids from new items
      const cleaned = updatedSkills.map(item => {
        const { _id, ...rest } = item;
        return _id && _id.length === 24 ? { _id, ...rest } : rest;
      });

      await axios.put(`/api/portfolio`, {
        ...portfolio,
        skills: cleaned
      }, {
        withCredentials: true,
        headers: authHeaders,
      });
      fetchData();
      setShowModal(false);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to synchronize skills data.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      level: parseInt(form.level) || 80,
      icon: form.icon.trim() || '⚡'
    };
    
    let updated;
    if (editing) {
      updated = items.map((item: any) => item._id === editing._id ? { ...item, ...payload } : item);
    } else {
      updated = [...items, { ...payload, _id: Date.now().toString() }];
    }
    await syncSkills(updated);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently remove this skill?')) return;
    const updated = items.filter((item: any) => item._id !== id);
    await syncSkills(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter gradient-text-orange uppercase font-display">Technical Arsenal</h1>
          <p className="text-[12px] text-muted-foreground mt-1 font-medium">Manage your stack proficiency and architectural capabilities.</p>
        </div>
        <Button onClick={openAdd} className="h-10 rounded-xl px-6 font-black uppercase tracking-widest text-[9px]">Register Skill</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="glass-card p-6 rounded-2xl animate-pulse h-28 bg-orange-500/5" />
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-16 glass-card rounded-[2rem] border border-orange-500/10">
            <div className="text-4xl mb-4 opacity-20">⚒️</div>
            <p className="text-lg font-black uppercase tracking-tight opacity-40">Arsenal Uninitialized</p>
            <p className="text-[9px] uppercase tracking-widest mt-1">No skill records found</p>
          </div>
        ) : items.map((item: any) => (
          <motion.div
            key={item._id}
            layoutId={item._id}
            className="glass-card p-6 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 blur-3xl rounded-full -mr-8 -mt-8" />
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/5 rounded-xl flex items-center justify-center text-xl border border-orange-500/10 transition-transform duration-500 group-hover:scale-105">
                  {item.icon || '⚡'}
                </div>
                <div>
                  <h3 className="font-black text-foreground uppercase tracking-tight font-display text-[13px]">{item.name}</h3>
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-0.5">{item.level}% Proficiency</p>
                </div>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-orange-500/10 rounded-lg text-primary transition-colors text-xs">✏️</button>
                <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-destructive/10 rounded-lg text-destructive transition-colors text-xs">🗑️</button>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-orange-500/5 overflow-hidden border border-orange-500/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.level}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-orange-500"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 10 }}
              className="w-full max-w-sm glass-card rounded-[2rem] border border-orange-500/20 p-8 shadow-2xl relative"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
              <h2 className="text-xl md:text-2xl font-black mb-6 gradient-text-orange uppercase tracking-tighter font-display">
                {editing ? 'Refine Skill' : 'New Capability'}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-center">
                  ✕ {error}
                </div>
              )}
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Technology Name</label>
                  <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Next.js" className="h-11 bg-background/40 border-orange-500/10 rounded-xl text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Proficiency (1-100)</label>
                    <Input required type="number" min="1" max="100" value={form.level} onChange={e => setForm({...form, level: e.target.value})} className="h-11 bg-background/40 border-orange-500/10 rounded-xl text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Visual Icon (Emoji)</label>
                    <Input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="🚀" className="h-11 bg-background/40 border-orange-500/10 rounded-xl text-sm" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]">
                    {saving ? 'Saving...' : 'Save Skill →'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="w-24 h-12 rounded-xl border-orange-500/10 font-black uppercase tracking-widest text-[10px]">
                    Abort
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
