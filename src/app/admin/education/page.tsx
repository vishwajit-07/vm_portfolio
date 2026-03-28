'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';


const EMPTY = { degree: '', school: '', duration: '', description: '' };

export default function AdminEducation() {
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

  const items = portfolio?.education || [];

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ degree: item.degree, school: item.school, duration: item.duration, description: item.description || '' });
    setError(''); setShowModal(true);
  };

  const syncEducation = async (updatedEducation: any[]) => {
    setSaving(true); setError('');
    try {
      // Cleanup: Remove temporary _ids from new items
      const cleaned = updatedEducation.map(item => {
        const { _id, ...rest } = item;
        return _id && _id.length === 24 ? { _id, ...rest } : rest;
      });

      await axios.put(`/api/portfolio`, {
        ...portfolio,
        education: cleaned
      }, {
        withCredentials: true,
        headers: authHeaders,
      });
      fetchData();
      setShowModal(false);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to synchronize academic data.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEdu = { ...form };
    let updated;
    if (editing) {
      updated = items.map((item: any) => item._id === editing._id ? { ...item, ...newEdu } : item);
    } else {
      updated = [...items, { ...newEdu, _id: Date.now().toString() }];
    }
    await syncEducation(updated);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this education entry?')) return;
    const updated = items.filter((item: any) => item._id !== id);
    await syncEducation(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter gradient-text-orange uppercase font-display">Academic Legacy</h1>
          <p className="text-[12px] text-muted-foreground mt-1 font-medium">Manage your educational background and scholarly achievements.</p>
        </div>
        <Button onClick={openAdd} className="h-10 rounded-xl px-6 font-black uppercase tracking-widest text-[9px]">Register Qualification</Button>
      </div>

      <div className="w-full border border-orange-500/10 rounded-2xl glass-card relative">
        <div className="overflow-x-auto hide-scrollbar w-full pb-2">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="text-[9px] font-black uppercase tracking-[0.15em] text-orange-500/60 bg-orange-500/5">
              <tr>
                <th className="p-4 px-6">Qualification</th>
                <th className="p-4 px-6">Institution</th>
                <th className="p-4 px-6">Timeline</th>
                <th className="p-4 px-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="font-medium text-foreground/80">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="p-4 px-6"><div className="h-10 bg-orange-500/5 rounded-xl" /></td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center text-muted-foreground">
                    <div className="text-4xl mb-4 opacity-20">🎓</div>
                    <p className="text-lg font-black uppercase tracking-tight opacity-40">Academic Record Empty</p>
                    <p className="text-[9px] uppercase tracking-widest mt-1">No educational history found</p>
                  </td>
                </tr>
              ) : items.map((item: any) => (
                <tr key={item._id} className="border-t border-orange-500/5 hover:bg-orange-500/5 transition-all duration-300 group">
                  <td className="p-4 px-6 font-black uppercase tracking-tight text-foreground text-[13px]">{item.degree}</td>
                  <td className="p-4 px-6 text-orange-500 font-bold text-[13px]">{item.school}</td>
                  <td className="p-4 px-6">
                     <span className="px-2.5 py-0.5 bg-orange-500/5 text-primary rounded-full text-[9px] font-black border border-orange-500/10 uppercase tracking-widest whitespace-nowrap">
                      {item.duration}
                    </span>
                  </td>
                  <td className="p-4 px-6 text-right space-x-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                    <button onClick={() => openEdit(item)} className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors bg-white/5 md:bg-transparent px-3 py-1.5 rounded-lg border border-white/5 md:border-none">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="text-[9px] font-black uppercase tracking-widest text-destructive hover:scale-105 transition-transform bg-destructive/10 md:bg-transparent px-3 py-1.5 rounded-lg border border-destructive/10 md:border-none">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              className="w-full max-w-lg glass-card rounded-[2rem] border border-orange-500/20 p-8 shadow-2xl relative"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
              <h2 className="text-xl md:text-2xl font-black mb-6 gradient-text-orange uppercase tracking-tighter font-display">
                {editing ? 'Refine Academic' : 'New Qualification'}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-[9px] font-black uppercase tracking-widest">
                  ✕ {error}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Degree / Qualification</label>
                    <Input required value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} className="h-11 bg-background/40 border-orange-500/10 rounded-xl text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Academic Institution</label>
                    <Input required value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} className="h-11 bg-background/40 border-orange-500/10 rounded-xl text-sm" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Temporal Span</label>
                  <Input required value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="h-11 bg-background/40 border-orange-500/10 rounded-xl text-sm" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Scholarly Focus / Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-orange-500/10 focus:border-orange-500/50 bg-background/40 px-4 py-3 text-[13px] font-medium focus-visible:outline-none resize-none leading-relaxed transition-all"
                    placeholder="Focus areas, CGPA, notable modules..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]">
                    {saving ? 'Synchronizing...' : editing ? 'Update Record' : 'Forge Document'}
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
