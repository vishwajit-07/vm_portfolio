import { cache } from 'react';
import connectDB from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';

/**
 * Fetch the unified portfolio document from MongoDB.
 * Wrapped with React.cache so the DB query is executed at most ONCE
 * per server render cycle.
 */
export const getPortfolio = cache(async () => {
  await connectDB();
  
  // Limit initial projects to 6 for faster LCP/hydration
  const rawPortfolio = await Portfolio.findOne({}, {
    projects: { $slice: 6 }
  }).lean();

  // 2. Seed if none exists
  if (!rawPortfolio) {
    const newDoc = await Portfolio.create({
      name: 'VISHWAJIT',
      title: 'Full Stack Developer',
      bio: 'Welcome to my portfolio.',
      skills: [],
      experience: [],
      education: [],
      projects: [],
    });
    return JSON.parse(JSON.stringify(newDoc.toObject())) as PortfolioData;
  }

  // 3. Serialize to plain object
  return JSON.parse(JSON.stringify(rawPortfolio)) as PortfolioData;
});

// ─── Shared Types ────────────────────────────────────────────────────────────

export interface Skill {
  _id?: string;
  name: string;
  icon?: string;
  level?: number;
  category?: string;
}

export interface Project {
  _id?: string;
  title: string;
  description?: string;
  techStack?: string[];
  images?: string[];
  liveLink?: string;
  githubLink?: string;
  featured?: boolean;
}

export interface Experience {
  _id?: string;
  role: string;
  company: string;
  duration?: string;
  description?: string;
  skills?: string[];
}

export interface Education {
  _id?: string;
  degree: string;
  school?: string;
  college?: string;
  year?: string;
  duration?: string;
  description?: string;
  cgpa?: string;
}

export interface PortfolioData {
  _id?: string;
  name?: string;
  title?: string;
  bio?: string;
  profileImage?: string;
  resumeUrl?: string; // added
  skills?: Skill[];
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  github?: string;
  linkedin?: string;
}
