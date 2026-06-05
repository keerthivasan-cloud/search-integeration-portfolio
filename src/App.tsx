import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionFeatures } from './components/SolutionFeatures';
import { PipelineIntro } from './components/PipelineIntro';
import { Phase1Discovery } from './components/Phase1Discovery';
import { Phase2Extraction } from './components/Phase2Extraction';
import { Phase3Chunking } from './components/Phase3Chunking';
import { Phase4NeuralSphere } from './components/Phase4NeuralSphere';
import { Phase5VectorIndex } from './components/Phase5VectorIndex';
import { Phase6HybridSearch } from './components/Phase6HybridSearch';
import { Phase7NeuralRanking } from './components/Phase7NeuralRanking';
import { Phase8RAGSynthesis } from './components/Phase8RAGSynthesis';
import { Phase9KnowledgeGraph } from './components/Phase9KnowledgeGraph';
import { TechStackSection } from './components/TechStackSection';
import { StatsSection } from './components/StatsSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Connect Lenis to GSAP ticker for ScrollTrigger compatibility
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <div className="text-slate-900 font-sans overflow-x-hidden">
      {/* Fixed navigation */}
      <Navigation />

      <main>
        {/* Above-fold hero */}
        <HeroSection />

        {/* Problem framing */}
        <ProblemSection />

        {/* Solution features */}
        <SolutionFeatures />

        {/* Gradient divider: light → dark */}
        <div className="h-20 bg-gradient-to-b from-slate-50 to-dark pointer-events-none" />

        {/* Pipeline intro — cinematic transition into dark */}
        <PipelineIntro />

        {/* Phase 1: File Discovery */}
        <Phase1Discovery />

        {/* Phase 2: Text Extraction */}
        <Phase2Extraction />

        {/* Phase 3: Semantic Chunking */}
        <Phase3Chunking />

        {/* Phase 4: Neural Embedding Sphere */}
        <Phase4NeuralSphere />

        {/* Phase 5: Vector Indexing */}
        <Phase5VectorIndex />

        {/* Phase 6: Hybrid Search */}
        <div id="pipeline">
          <Phase6HybridSearch />
        </div>

        {/* Phase 7: Neural Ranking */}
        <Phase7NeuralRanking />

        {/* Phase 8: RAG Answer Synthesis */}
        <Phase8RAGSynthesis />

        {/* Phase 9: Knowledge Graph */}
        <Phase9KnowledgeGraph />

        {/* Gradient divider: dark → light */}
        <div className="h-20 bg-gradient-to-b from-dark to-slate-50 pointer-events-none" />

        {/* Tech Stack */}
        <TechStackSection />

        {/* Gradient divider: dark → light */}
        <div className="h-20 bg-gradient-to-b from-dark to-slate-50 pointer-events-none" />

        {/* Stats */}
        <StatsSection />

        {/* Gradient divider: light → dark */}
        <div className="h-20 bg-gradient-to-b from-slate-50 to-dark pointer-events-none" />

        {/* Final CTA */}
        <FinalCTA />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export default App;
