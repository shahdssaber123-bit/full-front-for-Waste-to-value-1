import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Recycle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { dataStore } from '@/lib/dataStore';
import { toast } from 'sonner';

const PATTERN_IMG = 'https://media.base44.com/images/public/69e277b2cca8ad6115f9cd35/e622644fb_generated_5990b155.png';

const demoAccounts = [
  { email: 'supplier@demo.com', role: 'Supplier', name: 'Al-Rashid Recycling Co.' },
  { email: 'admin@demo.com', role: 'Admin', name: 'Sarah Al-Fahad' },
  { email: 'industry@demo.com', role: 'Industry', name: 'GreenPack Industries' },
  { email: 'driver@demo.com', role: 'Driver', name: 'Omar Al-Mansouri' },
  { email: 'hub@demo.com', role: 'Hub Manager', name: 'Nora Al-Sulaiman' },
];

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  dataStore.init();

  const handleLogin = (loginEmail) => {
    const e = loginEmail || email;
    const user = dataStore.loginUser(e);
    if (user) {
      toast.success(`Welcome back, ${user.name}!`);
      const routes = { supplier: '/supplier', admin: '/admin', industry: '/industry', driver: '/driver', hub_manager: '/admin' };
      navigate(routes[user.role] || '/');
    } else {
      toast.error('Account not found. Please check your email or sign up.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <img src={PATTERN_IMG} alt="Circular economy pattern" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,30%,8%)]/82 to-[hsl(168,40%,16%)]/72" />
        <div className="relative z-10 p-12 max-w-md">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-white">Waste-to-Value</span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Welcome Back to the Circular Economy</h2>
          <p className="text-white/60 leading-relaxed">Access your dashboard, manage operations, and track materials across the entire supply chain.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-wine flex items-center justify-center">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-lg">Waste-to-Value</span>
          </Link>

          <h1 className="font-heading text-2xl font-bold mb-2">Sign In</h1>
          <p className="text-sm text-muted-foreground mb-8">Enter your credentials or use a demo account below.</p>

          <div className="space-y-4 mb-8">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Email Address</Label>
              <Input type="email" placeholder="your@company.com" value={email} onChange={e => setEmail(e.target.value)} className="h-11 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Password</Label>
              <div className="relative">
                <Input type={showPw ? 'text' : 'password'} placeholder="••••••••" className="h-11 rounded-xl pr-10" />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button onClick={() => handleLogin()} className="w-full h-11 rounded-xl bg-gradient-primary hover:opacity-90 text-white font-semibold">
              Sign In <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">Demo Quick Access</span></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {demoAccounts.map(acc => (
              <button key={acc.email} onClick={() => handleLogin(acc.email)}
                className="p-3 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all text-left">
                <p className="text-xs font-semibold">{acc.role}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{acc.name}</p>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}