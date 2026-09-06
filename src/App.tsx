import { Navigation } from '@/components/Navigation';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Footer } from '@/components/Footer';
import { Hero } from '@/scenes/Hero';
import { Entrance } from '@/scenes/Entrance';
import { BrandStory } from '@/scenes/BrandStory';
import { CoffeeExperience } from '@/scenes/CoffeeExperience';
import { Roastery } from '@/scenes/Roastery';
import { Products } from '@/scenes/Products';
import { Gallery } from '@/scenes/Gallery';
import { Visit } from '@/scenes/Visit';

function App() {
  return (
    <div className="relative tss-grain tss-vignette min-h-screen bg-[#0d0805] text-[#f5ebe0]">
      <ScrollProgress />
      <Navigation />

      <main>
        <Hero />
        <Entrance />
        <BrandStory />
        <CoffeeExperience />
        <Roastery />
        <Products />
        <Gallery />
        <Visit />
      </main>

      <Footer />
    </div>
  );
}

export default App;
