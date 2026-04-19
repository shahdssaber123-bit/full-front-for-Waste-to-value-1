import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/home/HeroSection';
import MetricsStrip from '@/components/home/MetricsStrip';
import MaterialsSection from '@/components/home/MaterialsSection';
import ProcessTimeline from '@/components/home/ProcessTimeline';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <MetricsStrip />
      <MaterialsSection />
      <ProcessTimeline />
      <Footer />
    </div>
  );
}