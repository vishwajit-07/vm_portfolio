import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import Projects from "@/components/layout/Projects";
import Experience from "@/components/layout/Experience";
import Education from "@/components/layout/Education";
import Skills from "@/components/layout/Skills";
import Contact from "@/components/layout/Contact";
import LiveBackground from "@/components/ui/LiveBackground";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-orange-500/25 selection:text-white overflow-hidden">
      <LiveBackground />
      <Navbar />
      <Hero />
      <Experience />
      <Projects />
      <Education />
      <Skills />
      <Contact />
    </main>
  );
}
