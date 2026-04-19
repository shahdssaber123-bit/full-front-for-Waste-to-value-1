import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Recycle, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const HERO_IMG = 'https://media.base44.com/images/public/69e277b2cca8ad6115f9cd35/d9644ffb9_generated_f4d3284c.png';

const stats = [
  { icon: Recycle,    label: '12,000+ Tons',  sub: 'Processed Monthly' },
  { icon: TrendingUp, label: '94% Recovery',  sub: 'Material Diverted from Landfill' },
  { icon: Shield,     label: 'ISO 14001',     sub: 'Certified Operations' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Image fills the top 60% ─────────────────────────── */}
      <div className="relative w-full flex-1 min-h-[58vh]">
        <img
          src={HERO_IMG}
          alt="Industrial recycling facility"
          className="w-full h-full object-cover object-center"
          style={{ minHeight: '58vh' }}
        />
        {/* Very light vignette — image stays clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/5" />

        {/* Floating badge — top left, small, unobtrusive */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-8 left-8 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/60 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-700">
            B2B Circular Economy Platform
          </span>
        </motion.div>
      </div>

      {/* ── Clean text panel — pure white, no overlay ────────── */}
      <div className="bg-white border-t border-border/60 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-foreground leading-[1.1] mb-5 tracking-tight"
          >
            Where Waste Becomes{' '}
            <span className="text-gradient-gold">Verified Value</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            The enterprise platform connecting waste suppliers, logistics networks, processing hubs, and industrial buyers — with complete chain-of-custody traceability at every stage.
          </motion.p>

          {/* Centered CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            <Link to="/register">
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-white h-14 px-12 rounded-2xl text-base font-bold shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:shadow-primary/30"
              >
                Join the Platform
                <ArrowRight className="w-4 h-4 ml-2.5" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats row — clear, high-contrast */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            {stats.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-foreground font-bold text-[15px] leading-tight">{item.label}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}