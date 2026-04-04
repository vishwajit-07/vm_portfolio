import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/Hero';
import Projects from '@/components/layout/Projects';
import Experience from '@/components/layout/Experience';
import Resume from '@/components/layout/Resume';
import Education from '@/components/layout/Education';
import Skills from '@/components/layout/Skills';
import Contact from '@/components/layout/Contact';
import ClientOnlyEffects from '@/components/ClientOnlyEffects';
import { getPortfolio } from '@/lib/getPortfolio';

export default async function Home() {
  // Single DB query, React.cache-memoised — zero extra cost per section.
  const portfolio = await getPortfolio();

  return (
    <main className="min-h-screen selection:bg-orange-500/25 selection:text-white overflow-hidden">
      {/* Canvas BG — client-only, deferred from initial bundle */}
      <ClientOnlyEffects />
      <Navbar />
      <Hero profile={portfolio} />
      <Experience items={portfolio?.experience ?? []} />
      <Projects items={portfolio?.projects ?? []} />
      <Education items={portfolio?.education ?? []} />
      <Skills items={portfolio?.skills ?? []} />
      <Resume profile={portfolio} />

      <Contact />
    </main>
  );
}
