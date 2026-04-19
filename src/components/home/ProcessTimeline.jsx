import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ClipboardCheck, Package, Factory } from 'lucide-react';

const STEPS = [
  {
    icon: Truck,
    title: 'Source Extraction',
    sub: 'Supplier Registration & Pickup',
    desc: 'Waste suppliers register materials, set pickup schedules, and request collection through a dedicated portal. The system matches them with certified drivers and optimized routes in real time.',
    detail: 'Digital pickup manifests · Route optimization · Real-time ETA tracking',
    iconBg: 'bg-blue-600',
    tagColor: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    icon: ClipboardCheck,
    title: 'Hub Inbound & QA',
    sub: 'Quality Assurance at Processing Hubs',
    desc: 'Every inbound shipment undergoes rigorous contamination testing, weight verification, and purity grading by hub managers. ISO-compliant certificates are issued for each accepted batch.',
    detail: 'Contamination scoring · Photographic evidence · ISO 14001 documentation',
    iconBg: 'bg-amber-500',
    tagColor: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  {
    icon: Package,
    title: 'Densification & Storage',
    sub: 'Processing, Baling & Inventory Entry',
    desc: 'Accepted materials are sorted, cleaned, baled, and assigned a unique batch ID with a verified purity grade. Each batch enters the live inventory system, instantly available for buyer discovery.',
    detail: 'Unique batch IDs · Purity grading · Smart inventory aging alerts',
    iconBg: 'bg-emerald-600',
    tagColor: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  },
  {
    icon: Factory,
    title: 'Factory Offtake',
    sub: 'Industry Buyer Procurement & Delivery',
    desc: 'Industry buyers browse verified live inventory, reserve materials with transparent pricing, and schedule contract deliveries. Full traceability from source to factory gate is guaranteed.',
    detail: 'Verified pricing · Contract management · Delivery scheduling',
    iconBg: 'bg-slate-700',
    tagColor: 'bg-slate-50 border-slate-200 text-slate-700',
  },
];

export default function ProcessTimeline() {
  return (
    <section id="process" className="py-28 bg-gradient-warm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="gold-label mb-3 block">How It Works</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-5 text-foreground">
            Four Stages.{' '}
            <span className="text-gradient-gold">Complete Traceability.</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Every kilogram is tracked from source extraction to factory delivery with a full chain-of-custody digital record. Nothing slips through — nothing goes undocumented.
          </p>
        </motion.div>

        {/* Steps — vertical clean list */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden lg:block absolute left-[28px] top-6 bottom-6 w-0.5 bg-border" />

          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
                className="flex gap-6 items-start group"
              >
                {/* Step node */}
                <div className="flex flex-col items-center shrink-0 relative z-10">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.12 + 0.2 }}
                    className={`w-14 h-14 rounded-2xl ${step.iconBg} flex items-center justify-center shadow-lg ring-4 ring-white`}
                  >
                    <step.icon className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="flex-1 bg-white rounded-2xl border border-border p-7 shadow-sm hover:shadow-lg hover:shadow-primary/8 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                      Stage {i + 1}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm font-semibold text-primary mb-3">{step.sub}</p>
                  <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">{step.desc}</p>
                  <div className={`inline-flex items-center border rounded-xl px-4 py-2 ${step.tagColor}`}>
                    <p className="text-xs font-semibold">{step.detail}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-16 text-center bg-white rounded-3xl border border-border p-10 shadow-sm"
        >
          <p className="text-base font-semibold text-foreground max-w-2xl mx-auto leading-relaxed">
            Every stage generates timestamped records, digital certificates, and ESG impact data —{' '}
            <span className="text-primary">a complete audit trail</span> that meets EU taxonomy and regional regulatory requirements.
          </p>
        </motion.div>
      </div>
    </section>
  );
}