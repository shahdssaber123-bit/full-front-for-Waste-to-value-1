import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, BarChart3, FileText, Globe } from 'lucide-react';

const NATURE_IMG = 'https://media.base44.com/images/public/69e277b2cca8ad6115f9cd35/d1a45730e_generated_34b2bfd7.png';

const features = [
  { icon: Leaf, title: 'Carbon Tracking', desc: 'Automated CO₂ offset calculations for every ton of material diverted from landfill.' },
  { icon: BarChart3, title: 'Impact Dashboards', desc: 'Real-time ESG metrics with exportable reports for stakeholder presentations.' },
  { icon: FileText, title: 'Compliance Reports', desc: 'Auto-generated documentation meeting EU taxonomy and Saudi Vision 2030 requirements.' },
  { icon: Globe, title: 'Circular Scoring', desc: 'Proprietary circularity index measuring material lifecycle efficiency across the supply chain.' },
];

export default function ESGSection() {
  return (
    <section id="esg" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={NATURE_IMG} alt="Nature recovery scene" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/98 via-background/95 to-background/80" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="gold-label mb-3 block">ESG & Reporting</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Sustainability Built Into <span className="text-gradient-gold">Every Transaction</span></h2>
          <p className="text-muted-foreground mb-12 leading-relaxed">
            Every kilogram processed generates verifiable environmental impact data. Track your contribution to the circular economy with enterprise-grade reporting.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <feat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}