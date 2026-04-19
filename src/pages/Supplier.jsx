import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import StatCard from '@/components/shared/StatCard';
import StageTracker from '@/components/shared/StageTracker';
import PickupRequestModal from '@/components/supplier/PickupRequestModal';
import { useDataStore } from '@/hooks/useDataStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Plus, Clock, CheckCircle2, Truck, Leaf, DollarSign, Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dataStore } from '@/lib/dataStore';
import { toast } from 'sonner';

export default function Supplier() {
  const { operations, currentUser, ratings, store } = useDataStore();
  const navigate = useNavigate();
  const [showPickup, setShowPickup] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);
  const [showRate, setShowRate] = useState(null);
  const [rateVal, setRateVal] = useState(5);
  const [rateComment, setRateComment] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState('');

  if (!currentUser || currentUser.role !== 'supplier') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">Please log in as a Supplier to access this page.</p>
          <Button onClick={() => navigate('/login')} className="bg-gradient-wine text-white">Sign In</Button>
        </div>
      </div>
    );
  }

  const myOps = operations.filter(o => o.supplierId === currentUser.id);
  const activeOps = myOps.filter(o => !['Completed', 'Rejected'].includes(o.stage));
  const completedOps = myOps.filter(o => o.stage === 'Completed');
  const totalWeight = completedOps.reduce((s, o) => s + (o.actualQty || 0), 0);
  const totalPayout = completedOps.reduce((s, o) => {
    const mat = dataStore.MATERIALS.find(m => m.name === o.material);
    return s + (o.actualQty || 0) * (mat?.avgPrice || 0);
  }, 0);

  const handleRate = () => {
    if (!showRate) return;
    store.addRating({ driverId: showRate.driverId, supplierId: currentUser.id, opId: showRate.id, rating: rateVal, comment: rateComment });
    toast.success('Rating submitted!');
    setShowRate(null);
    setRateVal(5);
    setRateComment('');
  };

  const handleMessage = () => {
    if (!msgText.trim()) return;
    store.addMessage({ from: currentUser.id, to: 'u2', text: msgText, fromName: currentUser.name });
    store.addNotification('u2', 'message', `Message from ${currentUser.name}: ${msgText.substring(0, 50)}...`, null);
    toast.success('Message sent to admin');
    setMsgText('');
    setShowMsg(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold">Supplier Dashboard</h1>
            <p className="text-sm text-muted-foreground">{currentUser.name} · {currentUser.company}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowMsg(true)} className="rounded-xl">
              <MessageSquare className="w-4 h-4 mr-2" /> Message Admin
            </Button>
            <Button size="sm" onClick={() => setShowPickup(true)} className="rounded-xl bg-gradient-wine text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" /> New Pickup Request
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Active Operations" value={activeOps.length} icon={Clock} />
          <StatCard title="Completed" value={completedOps.length} icon={CheckCircle2} trend="3 this month" trendUp />
          <StatCard title="Total Diverted" value={`${(totalWeight / 1000).toFixed(1)}t`} icon={Leaf} />
          <StatCard title="Total Payout" value={`$${totalPayout.toFixed(0)}`} icon={DollarSign} trend="+12%" trendUp />
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="bg-muted rounded-xl p-1">
            <TabsTrigger value="active" className="rounded-lg text-xs">Active ({activeOps.length})</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg text-xs">Completed ({completedOps.length})</TabsTrigger>
            <TabsTrigger value="impact" className="rounded-lg text-xs">Environmental Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeOps.length === 0 && (
              <Card className="p-12 text-center"><p className="text-muted-foreground">No active operations. Create a pickup request to get started.</p></Card>
            )}
            {activeOps.map(op => (
              <motion.div key={op.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedOp(op)}>
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{op.material}</h3>
                          <p className="text-xs text-muted-foreground">{op.id} · {op.estQty}kg est.</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">{op.stage}</Badge>
                    </div>
                    <StageTracker currentStage={op.stage} compact />
                    {op.driverName && (
                      <p className="text-xs text-muted-foreground mt-3">
                        <Truck className="w-3.5 h-3.5 inline mr-1" /> Driver: {op.driverName}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedOps.map(op => {
              const mat = dataStore.MATERIALS.find(m => m.name === op.material);
              const payout = (op.actualQty || 0) * (mat?.avgPrice || 0);
              const hasRated = ratings.some(r => r.opId === op.id && r.supplierId === currentUser.id);
              return (
                <Card key={op.id} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{op.material} · {op.actualQty}kg</h3>
                        <p className="text-xs text-muted-foreground">{op.id} · Purity: {op.purityGrade}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${payout.toFixed(2)}</p>
                        <Badge variant="secondary" className="text-[10px] bg-green-50 text-green-700">Completed</Badge>
                      </div>
                    </div>
                    {op.driverName && !hasRated && (
                      <Button variant="outline" size="sm" className="mt-2 text-xs rounded-lg" onClick={() => setShowRate(op)}>
                        <Star className="w-3.5 h-3.5 mr-1" /> Rate Driver: {op.driverName}
                      </Button>
                    )}
                    {hasRated && <p className="text-xs text-muted-foreground mt-2">✓ Driver rated</p>}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="impact">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card className="p-6 text-center">
                <Leaf className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <p className="text-2xl font-bold">{(totalWeight * 0.0028).toFixed(1)}t</p>
                <p className="text-sm text-muted-foreground">CO₂ Offset</p>
              </Card>
              <Card className="p-6 text-center">
                <Package className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-2xl font-bold">{(totalWeight / 1000).toFixed(1)}t</p>
                <p className="text-sm text-muted-foreground">Landfill Diverted</p>
              </Card>
              <Card className="p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <p className="text-2xl font-bold">{completedOps.length}</p>
                <p className="text-sm text-muted-foreground">Successful Transactions</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Operation Detail */}
        <Dialog open={!!selectedOp} onOpenChange={() => setSelectedOp(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-heading">Operation {selectedOp?.id}</DialogTitle></DialogHeader>
            {selectedOp && (
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Material:</span> <strong>{selectedOp.material}</strong></div>
                  <div><span className="text-muted-foreground">Est. Qty:</span> <strong>{selectedOp.estQty}kg</strong></div>
                  <div><span className="text-muted-foreground">Actual Qty:</span> <strong>{selectedOp.actualQty ? `${selectedOp.actualQty}kg` : 'Pending'}</strong></div>
                  <div><span className="text-muted-foreground">QA Result:</span> <strong>{selectedOp.qaResult || 'Pending'}</strong></div>
                  <div><span className="text-muted-foreground">Driver:</span> <strong>{selectedOp.driverName || 'Not assigned'}</strong></div>
                  <div><span className="text-muted-foreground">Pickup Date:</span> <strong>{selectedOp.pickupDate}</strong></div>
                </div>
                <StageTracker currentStage={selectedOp.stage} />
                {selectedOp.notes && <p className="text-sm text-muted-foreground bg-muted p-3 rounded-xl">Notes: {selectedOp.notes}</p>}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Rate Driver */}
        <Dialog open={!!showRate} onOpenChange={() => setShowRate(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle className="font-heading">Rate Driver</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <p className="text-sm text-muted-foreground">Rate {showRate?.driverName} for operation {showRate?.id}</p>
              <div className="flex gap-2 justify-center">
                {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={() => setRateVal(v)}>
                    <Star className={`w-8 h-8 ${v <= rateVal ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                  </button>
                ))}
              </div>
              <Textarea value={rateComment} onChange={e => setRateComment(e.target.value)} placeholder="Optional comment..." rows={3} className="rounded-xl" />
              <Button onClick={handleRate} className="w-full bg-gradient-wine text-white rounded-xl">Submit Rating</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Message Admin */}
        <Dialog open={showMsg} onOpenChange={setShowMsg}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle className="font-heading">Message Admin</DialogTitle></DialogHeader>
            <Textarea value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Type your message..." rows={4} className="rounded-xl" />
            <Button onClick={handleMessage} className="w-full bg-gradient-wine text-white rounded-xl">Send Message</Button>
          </DialogContent>
        </Dialog>

        <PickupRequestModal open={showPickup} onClose={() => setShowPickup(false)} user={currentUser} />
      </div>
    </div>
  );
}