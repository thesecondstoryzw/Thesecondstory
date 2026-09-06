import { Navigation } from '@/components/Navigation';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Footer } from '@/components/Footer';
import { CinematicHero } from '@/scenes/CinematicHero';
import { CinematicExperience } from '@/scenes/CinematicExperience';
import { CommunityStory } from '@/scenes/CommunityStory';
import { FinalEnding } from '@/scenes/FinalEnding';

function App() {
  return (
    <div className="relative tss-grain tss-vignette min-h-screen bg-[#0d0805] text-[#f5ebe0]">
      <ScrollProgress />
      <Navigation />

      <main>
        <CinematicHero />
        <div id="experience">
          <CinematicExperience />
        </div>
        <CommunityStory />
        <FinalEnding />
      </main>

      <Footer />
    </div>
  );
}

export default App;
