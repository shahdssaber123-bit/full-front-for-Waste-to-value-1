import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const faqs = [
  { q: 'How does the pricing model work?', a: 'Our platform uses market-reference pricing updated weekly. Suppliers are paid based on actual weight, purity grade, and current market rates after QA verification at our hubs.' },
  { q: 'What materials do you accept?', a: 'We handle PET, HDPE, mixed paper, cardboard (OCC), aluminum, steel/ferrous metals, clear and mixed glass, e-waste, and organic waste. Each material has specific QA criteria and grading standards.' },
  { q: 'How is quality assurance conducted?', a: 'Every inbound shipment undergoes contamination testing, weight verification, and purity grading at our processing hubs. Results are documented with photographic evidence and ISO-compliant certificates.' },
  { q: 'Can I integrate my ERP system?', a: 'Yes. We offer REST APIs and webhook integrations for SAP, Oracle, and custom ERP systems. Our enterprise tier includes dedicated integration support.' },
  { q: 'What regions do you operate in?', a: 'Currently operational across Saudi Arabia with expansion into UAE, Egypt, and Jordan. Our logistics network covers major industrial zones and port cities.' },
  { q: 'How does the ESG reporting work?', a: 'Every transaction generates CO₂ offset data, landfill diversion metrics, and circularity scores. Reports are auto-generated and meet EU taxonomy and Saudi Vision 2030 standards.' },
];

export default function FAQSection() {
  return (
    <section className="py-24 bg-gradient-warm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="gold-label mb-3 block">FAQ</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Common Questions</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-xl border border-border/60 px-6">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline py-5">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-16 p-12 rounded-3xl bg-gradient-hero text-white">
          <h3 className="font-heading text-2xl font-bold mb-3">Ready to <span className="text-gradient-gold">Transform</span> Your Supply Chain?</h3>
          <p className="text-white/70 text-sm mb-6">Join the leading B2B waste commodity platform today.</p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-foreground hover:bg-white/90 h-12 px-8 rounded-xl font-semibold">
              Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}