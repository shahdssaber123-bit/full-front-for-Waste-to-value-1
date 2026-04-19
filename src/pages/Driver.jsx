import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import StatCard from '@/components/shared/StatCard';
import { useDataStore } from '@/hooks/useDataStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, MapPin, Package, Star, CheckCircle2, Clock, ChevronRight, User, Phone, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { dataStore } from '@/lib/dataStore';
import { toast } from 'sonner';

const DRIVER_STAGES = ['Driver Assigned', 'Pickup In Progress', 'Arrived at HUB'];
const DRIVER_NEXT = {
  'Driver Assigned': 'Pickup In Progress',
  'Pickup In Progress': 'Arrived at HUB',
  'Arrived at HUB': null,
};

export default function Driver() {
  const { operations, currentUser, ratings, store } = useDataStore();
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== 'driver') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">Please log in as Driver to access this page.</p>
          <Button onClick={() => navigate('/login')} className="bg-gradient-wine text-white">Sign In</Button>
        </div>
      </div>
    );
  }

  const myOps = operations.filter(o => o.driverId === currentUser.id);
  const activeMissions = myOps.filter(o => DRIVER_STAGES.includes(o.stage));
  const completedMissions = myOps.filter(o => ['Completed', 'Arrived at HUB', 'QA Inspection', 'Accepted', 'Sorting', 'Baling', 'Stored in Inventory', 'Reserved by Industry', 'Outbound Delivery'].includes(o.stage));
  const myRatings = ratings.filter(r => r.driverId === currentUser.id);
  const avgRating = myRatings.length > 0 ? (myRatings.reduce((s, r) => s + r.rating, 0) / myRatings.length).toFixed(1) : currentUser.rating || 'N/A';

  const handleAdvance = (op) => {
    const nextStage = DRIVER_NEXT[op.stage];
    if (!nextStage) return;
    dataStore.updateOperation(op.id, { stage: nextStage });
    toast.success(`Mission updated to "${nextStage}"`);
  };

  const handleDeliver = (op) => {
    dataStore.updateOperation(op.id, { stage: 'Arrived at HUB' });
    dataStore.addNotification('u2', 'delivery', `Driver ${currentUser.name} delivered ${op.material} to HUB - ${op.id}`, op.id);
    toast.success('Delivery confirmed! Material arrived at HUB.');
  };

  const stageLabel = {
    'Driver Assigned': { label: 'Assigned', color: 'bg-blue-50 text-blue-700' },
    'Pickup In Progress': { label: 'On the Way', color: 'bg-amber-50 text-amber-700' },
    'Arrived at HUB': { label: 'Delivered', color: 'bg-green-50 text-green-700' },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-2 bg-gradient-wine" />
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-wine flex items-center justify-center shrink-0">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="font-heading text-xl font-bold">{currentUser.name}</h1>
                <p className="text-sm text-muted-foreground">{currentUser.company}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {currentUser.phone}</span>
                  <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" /> {currentUser.vehicle}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {currentUser.location}</span>
                  <span className="flex items-center gap-1">Plate: {currentUser.plate}</span>
                </div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-amber-50">
                <div className="flex items-center gap-1 justify-center mb-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-xl font-bold">{avgRating}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{myRatings.length} reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Active Missions" value={activeMissions.length} icon={Clock} />
          <StatCard title="Completed" value={completedMissions.length} icon={CheckCircle2} />
          <StatCard title="Total Trips" value={myOps.length} icon={Truck} />
          <StatCard title="Rating" value={avgRating} icon={Star} />
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="bg-muted rounded-xl p-1">
            <TabsTrigger value="active" className="rounded-lg text-xs">Active Missions ({activeMissions.length})</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg text-xs">Trip History</TabsTrigger>
            <TabsTrigger value="ratings" className="rounded-lg text-xs">My Ratings</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeMissions.length === 0 && (
              <Card className="p-12 text-center"><p className="text-muted-foreground">No active missions. Waiting for admin assignment.</p></Card>
            )}
            {activeMissions.map(op => {
              const stage = stageLabel[op.stage] || { label: op.stage, color: 'bg-muted' };
              return (
                <motion.div key={op.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all">
                    <div className="h-1.5 bg-gradient-wine" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-sm">{op.material}</h3>
                          <p className="text-xs text-muted-foreground">{op.id} · {op.estQty}kg est.</p>
                        </div>
                        <Badge className={`${stage.color} text-xs`}>{stage.label}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Supplier</p>
                            <p className="font-medium">{op.supplierName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-medium">{op.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Material</p>
                            <p className="font-medium">{op.material}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Pickup Date</p>
                            <p className="font-medium">{op.pickupDate}</p>
                          </div>
                        </div>
                      </div>

                      {op.notes && <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg mb-4">{op.notes}</p>}

                      <div className="flex gap-2">
                        {op.stage === 'Driver Assigned' && (
                          <Button size="sm" onClick={() => handleAdvance(op)} className="bg-gradient-wine text-white rounded-lg text-xs flex-1">
                            <ChevronRight className="w-3.5 h-3.5 mr-1" /> Start Pickup
                          </Button>
                        )}
                        {op.stage === 'Pickup In Progress' && (
                          <Button size="sm" onClick={() => handleDeliver(op)} className="bg-green-600 text-white rounded-lg text-xs flex-1">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Confirm Delivery to HUB
                          </Button>
                        )}
                        {op.stage === 'Arrived at HUB' && (
                          <Badge className="bg-green-50 text-green-700 text-xs">✓ Delivered — Awaiting QA</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            {completedMissions.map(op => (
              <Card key={op.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{op.material} · {op.actualQty || op.estQty}kg</p>
                    <p className="text-xs text-muted-foreground">{op.id} · {op.supplierName} · {op.pickupDate}</p>
                  </div>
                  <Badge className="bg-green-50 text-green-700 text-xs">{op.stage}</Badge>
                </CardContent>
              </Card>
            ))}
            {completedMissions.length === 0 && <Card className="p-12 text-center"><p className="text-muted-foreground">No completed trips yet.</p></Card>}
          </TabsContent>

          <TabsContent value="ratings" className="space-y-3">
            {myRatings.map(r => (
              <Card key={r.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {Array(r.rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                    {Array(5 - r.rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 text-muted-foreground/30" />)}
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground">"{r.comment}"</p>}
                  <p className="text-xs text-muted-foreground mt-2">Operation: {r.opId} · {new Date(r.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
            {myRatings.length === 0 && <Card className="p-12 text-center"><p className="text-muted-foreground">No ratings yet.</p></Card>}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}