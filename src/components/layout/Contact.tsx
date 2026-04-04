'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import axios from 'axios';



import FadeIn from '@/components/animations/FadeIn';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await axios.post(`/api/messages`, form);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-6 overflow-hidden border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn>
          <div className="mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">Interaction</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white leading-none">
              Let's <span className="text-gradient-primary">Connect</span>
            </h2>
            <p className="text-white/40 font-medium text-sm md:text-base max-w-sm leading-relaxed">
              Direct channel for technical inquiries and strategic partnerships.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-xl">
          {success ? (
            <FadeIn>
              <div className="premium-glass p-8 md:p-12 rounded-3xl border-white/[0.05] text-center space-y-6 relative z-10 hover:shadow-[0_20px_40px_rgba(249,115,22,0.1)] transition-all duration-500">
                <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center text-4xl mx-auto shadow-[0_0_30px_rgba(249,115,22,0.2)]">✉️</div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">Transmission Received</h3>
                  <p className="text-base text-white/40 font-medium leading-relaxed">I will review your message and respond shortly.</p>
                </div>
                <Button onClick={() => setSuccess(false)} variant="outline" className="mt-8 border-white/10 hover:bg-white/5 text-white">
                  Send New Message
                </Button>
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={0.2}>
              <div className="premium-glass p-6 md:p-10 rounded-3xl relative z-10 hover:shadow-[0_20px_40px_rgba(249,115,22,0.1)] transition-all duration-500">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-8 relative z-20"
                >
                  {error && (
                    <div className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest text-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 block">Full Name</label>
                      <Input 
                        required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} 
                        placeholder="Enter your name"
                        className="h-11 rounded-xl border-white/[0.08] bg-white/[0.02] px-4 focus:border-orange-500/50 focus:bg-white/[0.04] focus:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all outline-none text-sm font-medium text-white placeholder:text-white/20"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 block">Email Address</label>
                      <Input 
                        required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} 
                        placeholder="name@example.com"
                        className="h-11 rounded-xl border-white/[0.08] bg-white/[0.02] px-4 focus:border-orange-500/50 focus:bg-white/[0.04] focus:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all outline-none text-sm font-medium text-white placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 block">Project Brief</label>
                    <textarea
                      required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your project goals..."
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-4 text-sm font-medium min-h-[140px] focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.04] focus:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all resize-none text-white placeholder:text-white/20"
                    />
                  </div>

                  <Button 
                    forwardedAs="motion"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit" disabled={loading}
                    className="shimmer-effect bg-orange-500 text-white font-black px-8 h-12 text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-premium hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all w-full md:w-auto mt-4"
                  >
                    {loading ? 'Transmitting...' : 'Initialize Contact'}
                  </Button>
                </form>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
