import React from 'react';
import { Preloader } from './components/Preloader';
import { Navigation } from './components/Navigation';
import { HeroSection } from './sections/HeroSection';
import { ResonanceSequence } from './sections/ResonanceSequence';
import { LineupSection } from './sections/LineupSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { StagesSection } from './sections/StagesSection';
import { ScheduleSection } from './sections/ScheduleSection';
import { VenueSection } from './sections/VenueSection';
import { FinaleSequence } from './sections/FinaleSequence';
import { Footer } from './sections/Footer';

export const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#050506] text-[#F0F0EC] selection:bg-[#7867FF] selection:text-[#F0F0EC]">
      {/* 00 — Preloader */}
      <Preloader />

      {/* Subtle Noise Texture Overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Global Navigation Header */}
      <Navigation />

      {/* Main Single-Page Content Stream in Strict Narrative Order */}
      <main id="main-content" tabIndex={-1}>
        {/* 01 — HERO */}
        <HeroSection />

        {/* 02 — RESONANCE GATE (Future 500-600vh Scroll Integration Container) */}
        <ResonanceSequence />

        {/* 03 — LINEUP / THE SIGNAL */}
        <LineupSection />

        {/* 04 — EXPERIENCE / HEAR SEE ENTER */}
        <ExperienceSection />

        {/* 05 — STAGES / THREE WORLDS */}
        <StagesSection />

        {/* 06 — SCHEDULE / FOLLOW THE FREQUENCY */}
        <ScheduleSection />

        {/* 07 — VENUE / THE ECHOFORM GROUNDS */}
        <VenueSection />

        {/* 08 — FINALE / YOUR ENTRY INTO ECHOFORM (Future 400-480vh Scroll Integration Container) */}
        <FinaleSequence />
      </main>

      {/* 09 — FOOTER */}
      <Footer />
    </div>
  );
};

export default App;
