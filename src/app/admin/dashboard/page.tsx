'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import axios from 'axios';
import { motion } from 'framer-motion';



export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  } as any;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, messagesRes] = await Promise.all([
          axios.get(`/api/portfolio`),
          axios.get(`/api/messages`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
          })
        ]);

        if (portfolioRes.data.success) setPortfolio(portfolioRes.data.data);
        if (messagesRes.data.success) setMessages(messagesRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 animate-pulse text-muted-foreground font-black uppercase tracking-widest text-center mt-20">Syncing Intelligence...</div>;

  const projectCount = portfolio?.projects?.length || 0;
  const unreadMessages = messages.filter((m: any) => !m.read).length;
  const totalMessages = messages.length;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter gradient-text-orange uppercase font-display">Command Center</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">Real-time telemetry from your unified portfolio document.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial="hidden" animate="visible" variants={itemVariants} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-orange-500/15 overflow-hidden group">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Inventory / Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-5xl font-black tracking-tighter text-foreground font-display">{projectCount}</div>
                <div className="text-[10px] font-black text-muted-foreground uppercase mb-2">Manifested</div>
              </div>
              <div className="mt-4 h-1 w-full bg-orange-500/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-2/3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-orange-500/15 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Signal / Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-4xl md:text-5xl font-black tracking-tighter text-foreground font-display">{unreadMessages}</div>
                <div className="text-[10px] font-black text-primary uppercase mb-2">Unread Signal</div>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground mt-4 uppercase tracking-widest">Total Connectivity: {totalMessages}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card border-orange-500/15 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Presence / Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-4xl md:text-5xl font-black tracking-tighter text-foreground text-muted-foreground/20 font-display">--</div>
                <div className="text-[10px] font-black text-muted-foreground uppercase mb-2">Inactive Sensor</div>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground/40 mt-4 uppercase tracking-widest italic">Analytics logic pending</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-16">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-8 flex items-center gap-4">
          <span className="w-12 h-px bg-orange-500/30" /> Real-time Activity Logs
        </h2>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="p-10 border border-dashed border-orange-500/10 rounded-3xl text-center text-muted-foreground/40 font-bold uppercase text-[10px] tracking-widest">
              No recent activity recorded in current session
            </div>
          ) : (
            messages.slice(0, 3).map((m: any, i: number) => (
              <motion.div 
                key={m._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="p-6 border border-orange-500/10 rounded-[1.5rem] bg-orange-500/5 text-sm flex items-center justify-between group hover:border-orange-500/30 transition-all font-medium"
              >
                <div>
                  <span className="font-black text-orange-500 uppercase text-[10px] tracking-[0.1em] mr-4">Signal Incoming</span>
                  <span className="text-foreground">{m.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{new Date(m.createdAt).toLocaleDateString()}</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
