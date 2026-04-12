'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import axios from 'axios';


const EMPTY = { title: '', description: '', techStack: '', githubLink: '', liveLink: '', featured: false, images: [] as string[] };

function AdminProjectCard({ item, onEdit, onDelete }: { item: any, onEdit: (item: any) => void, onDelete: (id: string) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className={`relative p-1 rounded-3xl bg-white/[0.02] border border-white/[0.08] group transition-all duration-500 hover:border-orange-500/30 hover:bg-white/[0.04] h-full`}
    >
      <div className="relative h-full w-full bg-[#0B0B0F]/40 backdrop-blur-3xl rounded-[1.4rem] p-8 flex flex-col overflow-hidden">
        {item.images && item.images.length > 0 && (
          <div className="absolute inset-0 z-0 opacity-40 md:opacity-20 group-hover:opacity-40 transition-opacity select-none pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.images[0]} alt="Project Cover" className="w-full h-full object-cover mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/80 to-transparent" />
          </div>
        )}

        {item.featured && (
          <div className="absolute top-6 right-6 z-10 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[8px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            Featured
          </div>
        )}

        <div className="relative z-10 flex justify-between items-start mb-8">
          <div className="w-10 h-10 bg-white/[0.03] rounded-xl flex items-center justify-center text-sm border border-white/[0.05] group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-all">
            {item.featured ? '✦' : '↳'}
          </div>
          <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(item)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.05] md:bg-white/[0.02] text-orange-500 hover:bg-orange-500/10 border border-white/[0.05] transition-all">
               <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
            </button>
            <button onClick={() => onDelete(item._id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-destructive/10 md:bg-destructive/5 text-destructive hover:bg-destructive/10 border border-destructive/10 transition-all">
               <span className="text-[10px] font-black uppercase tracking-widest">Del</span>
            </button>
          </div>
        </div>

        <div className="relative z-10 flex-1 space-y-3 mb-8">
          <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
          <p className="text-xs text-gray-500 font-medium leading-[1.6] line-clamp-3">{item.description}</p>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/[0.05] mt-auto flex flex-wrap gap-1.5">
          {(item.techStack || []).slice(0, 4).map((t: string, idx: number) => (
            <span key={idx} className="px-2 py-0.5 rounded-md text-[8px] font-black bg-white/[0.02] text-gray-500 border border-white/[0.05] uppercase tracking-widest">
              {t}
            </span>
          ))}
          {item.techStack?.length > 4 && <span className="text-[8px] opacity-40 uppercase tracking-widest ml-1">+{item.techStack.length - 4}</span>}
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminProjects() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const items = portfolio?.projects || [];

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description || '',
      techStack: Array.isArray(item.techStack) ? item.techStack.join(', ') : '',
      githubLink: item.githubLink || '',
      liveLink: item.liveLink || '',
      featured: item.featured || false,
      images: item.images || []
    });
    setError(''); setShowModal(true);
  };

  const syncProjects = async (updatedProjects: any[]) => {
    setSaving(true); setError('');
    try {
      const cleaned = updatedProjects.map(item => {
        const { _id, ...rest } = item;
        return _id && _id.length === 24 ? { _id, ...rest } : rest;
      });

      await axios.put(`/api/portfolio`, {
        ...portfolio,
        projects: cleaned
      }, {
        withCredentials: true,
        headers: authHeaders,
      });
      fetchData();
      setShowModal(false);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to synchronize project data.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');
    
    try {
      const newImages = [...(form.images || [])];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        const response = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data', ...authHeaders }
        });
        if (response.data) {
          newImages.push(response.data);
        }
      }
      setForm({ ...form, images: newImages });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image(s)');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(form.images || [])];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
    };
    
    let updated;
    if (editing) {
      updated = items.map((item: any) => item._id === editing._id ? { ...item, ...payload } : item);
    } else {
      updated = [...items, { ...payload, _id: Date.now().toString() }];
    }
    await syncProjects(updated);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this project?')) return;
    const updated = items.filter((item: any) => item._id !== id);
    await syncProjects(updated);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1.5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">Fleet Control</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase leading-none">Creative Inventory</h1>
          <p className="text-[12px] text-gray-500 font-medium max-w-md leading-relaxed">System-level orchestration of technical archives and implementations.</p>
        </div>
        <Button onClick={openAdd} className="h-11 rounded-xl px-8 font-bold uppercase tracking-widest text-[9px] bg-orange-500 text-white transition-all active:scale-95">Add Archive +</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="relative group overflow-hidden rounded-[2rem] border border-white/[0.05] bg-white/[0.01] p-16 text-center">
            <div className="absolute inset-0 bg-orange-500/[0.01] blur-[100px] transition-opacity group-hover:opacity-100" />
            <div className="relative z-10 space-y-4">
              <div className="text-4xl opacity-20 filter grayscale group-hover:grayscale-0 transition-all duration-700">🚀</div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-white opacity-40">Hangar Empty</h3>
              <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold max-w-xs mx-auto">No archived projects found in the primary unified document.</p>
              <Button onClick={openAdd} variant="outline" className="h-10 px-6 rounded-lg border-white/10 hover:bg-white/5 uppercase tracking-widest text-[8px] font-black">Initialize New Creation</Button>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
             <AdminProjectCard key={item._id} item={item} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0B0B0F]/90 backdrop-blur-2xl"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 10 }}
              className="w-full max-w-2xl glass-card rounded-[1.5rem] border border-white/[0.08] p-5 md:p-6 shadow-2xl relative bg-[#0B0B0F]/40"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />
              
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                  {editing ? 'Refine Archive' : 'New Creation'}
                </h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-gray-400 hover:text-white transition-colors">✕</button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-destructive/5 text-destructive border border-destructive/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-center">
                   {error}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-3">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[8px] uppercase font-black tracking-widest text-gray-500 ml-1">Identifier</label>
                        <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="h-9 bg-white/[0.02] border-white/[0.05] rounded-xl px-3 focus:border-orange-500/30 transition-all outline-none text-xs" placeholder="Project Name" />
                    </div>
                     <div className="space-y-1">
                        <label className="text-[8px] uppercase font-black tracking-widest text-gray-500 ml-1">Priority</label>
                        <select 
                          value={form.featured ? 'true' : 'false'} 
                          onChange={e => setForm({...form, featured: e.target.value === 'true'})}
                          className="w-full h-9 bg-white/[0.02] border border-white/[0.05] rounded-xl px-3 text-xs font-bold focus:border-orange-500/30 outline-none transition-all appearance-none cursor-pointer text-gray-300"
                        >
                            <option value="false" className="bg-[#0B0B0F]">Standard Entry</option>
                            <option value="true" className="bg-[#0B0B0F]">Featured Portfolio</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] uppercase font-black tracking-widest text-gray-500 ml-1">Strategic Narrative</label>
                  <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs font-medium focus:border-orange-500/30 outline-none transition-all resize-none leading-relaxed text-gray-300" placeholder="Describe the architectural complexity..." />
                </div>

                <div className="space-y-1 focus-within:relative z-10">
                  <label className="text-[8px] uppercase font-black tracking-widest text-gray-500 ml-1 flex justify-between">
                    <span>Project Screenshots</span>
                    {uploading && <span className="text-orange-500 animate-pulse">Uploading...</span>}
                  </label>
                  <div className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] p-2 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {(form.images || []).map((imgUrl: string, idx: number) => (
                        <div key={idx} className="relative group w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black/50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-red-500/80 text-white text-[8px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <label className="w-12 h-12 rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-500/50 hover:bg-orange-500/5 cursor-pointer transition-all">
                        <span className="text-xl leading-none mb-0.5">+</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] uppercase font-black tracking-widest text-gray-500 ml-1">Technical Component Stack</label>
                  <Input required value={form.techStack} onChange={e => setForm({...form, techStack: e.target.value})} placeholder="Next.js, TypeScript, MERN..." className="h-9 bg-white/[0.02] border-white/[0.05] rounded-xl px-3 focus:border-orange-500/30 transition-all outline-none text-xs" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase font-black tracking-widest text-gray-500 ml-1">Git Repository</label>
                    <Input value={form.githubLink} onChange={e => setForm({...form, githubLink: e.target.value})} placeholder="github.com/..." className="h-9 bg-white/[0.02] border-white/[0.05] rounded-xl px-3 focus:border-orange-500/30 transition-all outline-none text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase font-black tracking-widest text-gray-500 ml-1">Deployment</label>
                    <Input value={form.liveLink} onChange={e => setForm({...form, liveLink: e.target.value})} placeholder="https://..." className="h-9 bg-white/[0.02] border-white/[0.05] rounded-xl px-3 focus:border-orange-500/30 transition-all outline-none text-xs" />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1 h-10 rounded-xl font-black uppercase tracking-widest text-[9px] bg-orange-500 text-white shadow-premium transition-all active:scale-95">
                    {saving ? 'Synchronizing...' : 'Commit Change →'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="w-24 h-10 rounded-xl border-white/5 hover:bg-white/5 font-black uppercase tracking-widest text-[8px] text-gray-500 hover:text-white transition-all">
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
