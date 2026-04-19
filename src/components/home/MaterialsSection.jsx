import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

const PET_IMG = 'https://media.base44.com/images/public/69e277b2cca8ad6115f9cd35/4a5f9135c_generated_0bb20bc4.png';

const materials = [
  { name: 'PET Plastic',    code: 'PET',    price: '$0.85/kg', grade: 'A+', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { name: 'HDPE Plastic',   code: 'HDPE',   price: '$0.72/kg', grade: 'A',  color: 'bg-sky-50 border-sky-200 text-sky-800' },
  { name: 'Mixed Paper',    code: 'PAPER',  price: '$0.35/kg', grade: 'B+', color: 'bg-amber-50 border-amber-200 text-amber-800' },
  { name: 'Cardboard OCC',  code: 'OCC',    price: '$0.28/kg', grade: 'B',  color: 'bg-orange-50 border-orange-200 text-orange-800' },
  { name: 'Aluminum',       code: 'ALU',    price: '$1.45/kg', grade: 'A+', color: 'bg-slate-50 border-slate-200 text-slate-800' },
  { name: 'Steel / Ferrous',code: 'FE',     price: '$0.38/kg', grade: 'A',  color: 'bg-stone-50 border-stone-200 text-stone-800' },
  { name: 'Clear Glass',    code: 'GLASS',  price: '$0.12/kg', grade: 'B',  color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { name: 'E-Waste',        code: 'EWASTE', price: '$2.10/kg', grade: 'Var',color: 'bg-violet-50 border-violet-200 text-violet-800' },
];

const guarantees = [
  'ISO-compliant QA at every hub',
  'Full chain-of-custody documentation',
  'Real-time pricing benchmarks',
  'Purity certificates per batch',
];

export default function MaterialsSection() {
  return (
    <section id="materials" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* ── Left: copy + material grid ─── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <span className="gold-label mb-3 block">Commodity Trading</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-5 leading-tight text-foreground">
              Verified Materials.<br />
              <span className="text-gradient-gold">Transparent Pricing.</span>
            </h2>
            <p className="text-base text-muted-foreground mb-5 leading-relaxed">
              Every material on our platform is tested, graded, and traceable to its source. Industry buyers receive guaranteed purity levels with full batch documentation — no surprises, no disputes.
            </p>
            <ul className="space-y-3 mb-9">
              {guarantees.map((g, i) => (
                <li key={i} className="flex items-center gap-3 text-[15px] font-medium text-foreground">
                  <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                  {g}
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-3">
              {materials.map((mat, i) => (
                <motion.div
                  key={mat.code}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  whileHover={{ y: -2, transition: { duration: 0.18 } }}
                  className={`p-4 rounded-xl border-2 ${mat.color} cursor-default`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs tracking-wider">{mat.code}</span>
                    <Badge variant="secondary" className="text-[10px] bg-white font-bold border">{mat.grade}</Badge>
                  </div>
                  <p className="text-sm font-semibold mb-0.5">{mat.name}</p>
                  <p className="text-xs font-bold opacity-75">{mat.price}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: clean image, no text overlay ─── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-primary/8 ring-1 ring-border">
              <img
                src={PET_IMG}
                alt="Sorted and baled PET plastic materials ready for processing"
                className="w-full h-[520px] object-cover"
              />
            </div>

            {/* Floating stat — below image, not on it */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-7 -left-7 bg-white rounded-2xl border border-border shadow-xl p-5 min-w-[200px]"
            >
              <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide">Live Volume Today</p>
              <p className="text-2xl font-bold text-foreground font-heading">8,450 kg</p>
              <p className="text-sm text-green-600 font-bold mt-1">↑ 12% vs last week</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}