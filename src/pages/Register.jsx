import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Recycle, ArrowRight, Building2, Shield, Factory, Truck, Warehouse } from 'lucide-react';
import { dataStore } from '@/lib/dataStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const QA_IMG = 'https://media.base44.com/images/public/69e277b2cca8ad6115f9cd35/f810f3005_generated_d1fefeb0.png';

const roleOptions = [
  {
    value: 'supplier',
    label: 'Supplier',
    icon: Building2,
    desc: 'Register waste materials and request pickups from your facility',
    color: 'from-blue-600 to-blue-700',
  },
  {
    value: 'industry',
    label: 'Industry Buyer',
    icon: Factory,
    desc: 'Browse verified inventory and reserve materials for production',
    color: 'from-amber-600 to-amber-700',
  },
  {
    value: 'driver',
    label: 'Driver',
    icon: Truck,
    desc: 'Receive pickup missions and manage material deliveries',
    color: 'from-slate-600 to-slate-700',
  },
  {
    value: 'hub_manager',
    label: 'Hub Manager',
    icon: Warehouse,
    desc: 'Oversee QA, inventory, and processing hub operations',
    color: 'from-emerald-600 to-emerald-700',
  },
];

const STEP_ROLE = 'role';
const STEP_DETAILS = 'details';

export default function Register() {
  const [step, setStep] = useState(STEP_ROLE);
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', location: '', phone: '' });
  const navigate = useNavigate();

  dataStore.init();

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
    setStep(STEP_DETAILS);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) {
      toast.error('Please fill in all required fields');
      return;
    }
    const user = dataStore.signupUser(form);
    toast.success(`Welcome, ${user.name}! Your account is ready.`);
    const routes = {
      supplier: '/supplier',
      industry: '/industry',
      driver: '/driver',
      hub_manager: '/admin',
    };
    navigate(routes[user.role] || '/');
  };

  const selectedRole = roleOptions.find(r => r.value === form.role);

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[46%] relative items-center justify-center">
        <img
          src={QA_IMG}
          alt="Quality inspection at hub"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Lighter overlay — show image better */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,30%,8%)]/80 to-[hsl(168,45%,18%)]/70" />
        <div className="relative z-10 p-12 max-w-md">
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-sm">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-white">Waste-to-Value</span>
          </Link>
          <h2 className="font-heading text-3xl font-bold text-white mb-4 leading-tight">
            Join the Circular Economy
          </h2>
          <p className="text-white/55 leading-relaxed text-[15px]">
            Connect with a growing network of suppliers, hubs, buyers, and drivers — all on one transparent, enterprise-grade platform.
          </p>
          <div className="mt-10 space-y-3">
            {['Full chain-of-custody tracking', 'ISO-compliant documentation', 'Real-time operational visibility'].map((t, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <p className="text-sm text-white/65">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-lg">Waste-to-Value</span>
          </Link>

          <AnimatePresence mode="wait">
            {step === STEP_ROLE && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                <h1 className="font-heading text-2xl font-bold mb-1.5">How will you use the platform?</h1>
                <p className="text-sm text-muted-foreground mb-8">
                  Choose your role to get started. You can have one account per role.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roleOptions.map((opt, i) => (
                    <motion.button
                      key={opt.value}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => handleRoleSelect(opt.value)}
                      className="group text-left p-5 rounded-2xl border border-border/60 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/6 transition-all duration-300 bg-card hover:bg-primary/[0.02]"
                    >
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-300`}>
                        <opt.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="font-semibold text-sm mb-1">{opt.label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
                    </motion.button>
                  ))}
                </div>

                <p className="text-center text-sm text-muted-foreground mt-8">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                </p>
              </motion.div>
            )}

            {step === STEP_DETAILS && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                <button
                  onClick={() => setStep(STEP_ROLE)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 mb-6 transition-colors"
                >
                  ← Back to role selection
                </button>

                {selectedRole && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/12 mb-7">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedRole.color} flex items-center justify-center shrink-0`}>
                      <selectedRole.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Joining as</p>
                      <p className="font-semibold text-sm">{selectedRole.label}</p>
                    </div>
                  </div>
                )}

                <h1 className="font-heading text-2xl font-bold mb-1.5">Complete your profile</h1>
                <p className="text-sm text-muted-foreground mb-7">Fill in your details to activate your account.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Full Name *</Label>
                    <Input
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Work Email *</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="your@company.com"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Company</Label>
                      <Input
                        value={form.company}
                        onChange={e => setForm({ ...form, company: e.target.value })}
                        placeholder="Company name"
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Phone</Label>
                      <Input
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+966 5X XXX XXXX"
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Location</Label>
                    <Input
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      placeholder="City / Area"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-gradient-primary hover:opacity-90 text-white font-semibold mt-2"
                  >
                    Create Account <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}