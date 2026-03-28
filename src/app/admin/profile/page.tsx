'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import axios from 'axios';
import Image from 'next/image';



export default function AdminProfile() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state mappings
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/api/portfolio`);
      if (data.success) {
        const p = data.data;
        setPortfolio(p);
        setName(p.name || '');
        setTitle(p.title || '');
        setBio(p.bio || '');
        setEmail(p.contact?.email || '');
        setPhone(p.contact?.phone || '');
        setGithub(p.contact?.github || '');
        setLinkedin(p.contact?.linkedin || '');
      }
    } catch (e) {
      setError('Failed to fetch portfolio settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setSuccess(''); setError('');
    try {
      let profileImageUrl = portfolio?.profileImage;

      // 1. Handle image upload if a new file is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const { data: uploadPath } = await axios.post(`/api/upload`, formData, {
          withCredentials: true,
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          },
        });
        profileImageUrl = uploadPath;
      }

      // 2. Prepare unified payload
      const payload = {
        ...portfolio,
        name,
        title,
        bio,
        profileImage: profileImageUrl,
        contact: {
          email,
          phone,
          github,
          linkedin
        }
      };

      await axios.put(`/api/portfolio`, payload, {
        withCredentials: true,
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
      });

      setSuccess('Portfolio identity updated successfully!');
      setImageFile(null);
      fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to update portfolio');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-muted-foreground p-8 animate-pulse text-center mt-20 font-bold tracking-widest uppercase">Initializing Portfolio Identity...</div>;

  const currentImage = imagePreview || portfolio?.profileImage || '/profile.png';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter gradient-text-orange uppercase font-display">Global Identity</h1>
          <p className="text-[12px] text-muted-foreground mt-1 font-medium">Manage your core brand, profile image, and contact links.</p>
        </div>
      </div>

      {success && <div className="p-3 bg-green-500/10 text-green-600 border border-green-500/30 rounded-xl font-bold text-[13px] animate-in zoom-in-95">✓ {success}</div>}
      {error && <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-bold text-[13px]">✕ {error}</div>}

      <form onSubmit={handleSave} className="space-y-5 pb-10">
        {/* Photo Section */}
        <div className="glass-card p-6 rounded-2xl border border-orange-500/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
          <h2 className="font-black text-[9px] uppercase tracking-[0.15em] text-orange-500 mb-6 flex items-center gap-2">
            <span className="w-6 h-px bg-orange-500/30" /> Branding Reference
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden border border-orange-500/20 relative transition-all duration-500 group-hover:border-orange-500/50">
                <Image src={currentImage} alt="Profile" fill style={{ objectFit: 'cover' }} unoptimized priority />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-[2rem] bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-black uppercase tracking-widest cursor-pointer"
              >
                Change Photo
              </button>
            </div>

            <div className="flex-1 space-y-3">
              <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                Your profile picture is the first thing visitors see. High-quality professional portraits work best.
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <Button type="button" variant="outline" className="h-9 rounded-lg border-orange-500/10 hover:bg-orange-500/5 text-[9px] px-6" onClick={() => fileInputRef.current?.click()}>
                {imageFile ? `Selected: ${imageFile.name.substring(0, 15)}...` : 'Select New Image'}
              </Button>
            </div>
          </div>
        </div>

        {/* Identity Details */}
        <div className="glass-card p-6 rounded-2xl border border-orange-500/10">
          <h2 className="font-black text-[9px] uppercase tracking-[0.15em] text-orange-500 mb-6 flex items-center gap-2">
            <span className="w-6 h-px bg-orange-500/30" /> Information Architecture
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Full Legal Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} className="bg-background/40 border-orange-500/10 h-11 rounded-xl focus:border-orange-500/50 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Expertise / Headline</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-background/40 border-orange-500/10 h-11 rounded-xl focus:border-orange-500/50 text-sm" />
            </div>
          </div>
          <div className="mt-6 space-y-1.5">
            <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Strategic Biography</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-orange-500/10 focus:border-orange-500/50 bg-background/40 px-4 py-3 text-[13px] font-medium focus-visible:outline-none resize-none leading-relaxed transition-all"
              placeholder="Tell your professional story..."
            />
          </div>
        </div>

        {/* Contact & Socials */}
        <div className="glass-card p-6 rounded-2xl border border-orange-500/10">
          <h2 className="font-black text-[9px] uppercase tracking-[0.15em] text-orange-500 mb-6 flex items-center gap-2">
            <span className="w-6 h-px bg-orange-500/30" /> Connectivity & Channels
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Email Address</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="hello@yoursite.com" className="bg-background/40 border-orange-500/10 h-11 rounded-xl text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Contact Number (Optional)</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 890" className="bg-background/40 border-orange-500/10 h-11 rounded-xl text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">GitHub Endpoint</label>
              <Input value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/..." className="bg-background/40 border-orange-500/10 h-11 rounded-xl text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">LinkedIn Network</label>
              <Input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="bg-background/40 border-orange-500/10 h-11 rounded-xl text-sm" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving} className="w-full md:w-auto px-10 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]">
            {saving ? 'Synchronizing Data...' : 'Commit Changes →'}
          </Button>
        </div>
      </form>
    </div>
  );
}
