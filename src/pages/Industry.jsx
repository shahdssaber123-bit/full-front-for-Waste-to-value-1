import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import StatCard from '@/components/shared/StatCard';
import { useDataStore } from '@/hooks/useDataStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Package, Clock, FileText, Building2, Calendar, Scale, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { dataStore } from '@/lib/dataStore';
import { toast } from 'sonner';

export default function Industry() {
  const { inventory, reservations, currentUser, store } = useDataStore();
  const navigate = useNavigate();
  const [showReserve, setShowReserve] = useState(null);
  const [form, setForm] = useState({ quantity: '', meetingDate: '', notes: '', companyDetails: '' });

  if (!currentUser || currentUser.role !== 'industry') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">Please log in as Industry to access this page.</p>
          <Button onClick={() => navigate('/login')} className="bg-gradient-wine text-white">Sign In</Button>
        </div>
      </div>
    );
  }

  const available = inventory.filter(i => !i.reserved);
  const myReservations = reservations.filter(r => r.industryId === currentUser.id);
  const confirmed = myReservations.filter(r => r.status === 'Confirmed');

  const handleReserve = () => {
    if (!showReserve || !form.quantity || !form.meetingDate) {
      toast.error('Please fill in required fields');
      return;
    }
    store.addReservation({
      industryId: currentUser.id,
      industryName: currentUser.name,
      inventoryId: showReserve.id,
      material: showReserve.material,
      quantity: Number(form.quantity),
      status: 'Pending',
      meetingDate: form.meetingDate,
      notes: form.notes,
      companyDetails: form.companyDetails || `${currentUser.company} - ${currentUser.sector || 'Manufacturing'}`,
    });
    store.updateInventoryItem(showReserve.id, { reserved: true, reservedBy: currentUser.id });
    toast.success('Reservation submitted! Admin will review shortly.');
    setShowReserve(null);
    setForm({ quantity: '', meetingDate: '', notes: '', companyDetails: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold">Industry Portal</h1>
            <p className="text-sm text-muted-foreground">{currentUser.name} · {currentUser.company}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Available Materials" value={available.length} icon={Package} />
          <StatCard title="My Reservations" value={myReservations.length} icon={ShoppingCart} />
          <StatCard title="Confirmed" value={confirmed.length} icon={Shield} />
          <StatCard title="Pending" value={myReservations.filter(r => r.status === 'Pending').length} icon={Clock} />
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="bg-muted rounded-xl p-1">
            <TabsTrigger value="browse" className="rounded-lg text-xs">Browse Materials</TabsTrigger>
            <TabsTrigger value="reservations" className="rounded-lg text-xs">My Reservations</TabsTrigger>
            <TabsTrigger value="invoices" className="rounded-lg text-xs">Invoices</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg text-xs">Company Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {available.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all group">
                    <div className="h-2 bg-gradient-wine" />
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-[10px] font-mono">{item.batchId}</Badge>
                        <Badge className="text-[10px] bg-green-50 text-green-700">Available</Badge>
                      </div>
                      <h3 className="font-bold text-base mb-3">{item.material}</h3>
                      <div className="grid grid-cols-2 gap-y-2 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1"><Scale className="w-3 h-3" /> {item.weight}kg</div>
                        <div className="flex items-center gap-1"><Shield className="w-3 h-3" /> {item.purityGrade}</div>
                        <div>Stage: <span className="text-foreground">{item.processingStage}</span></div>
                        <div>Condition: <span className="text-foreground">{item.condition}</span></div>
                      </div>
                      <Button onClick={() => setShowReserve(item)} className="w-full bg-gradient-wine text-white rounded-xl text-xs hover:opacity-90">
                        <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Reserve Material
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {available.length === 0 && (
                <Card className="col-span-full p-12 text-center">
                  <p className="text-muted-foreground">No materials available at this time. Check back soon.</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reservations">
            <div className="space-y-4">
              {myReservations.length === 0 && <Card className="p-12 text-center"><p className="text-muted-foreground">No reservations yet.</p></Card>}
              {myReservations.map(res => (
                <Card key={res.id} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{res.material}</h3>
                        <p className="text-xs text-muted-foreground">{res.id} · {res.quantity}kg · Meeting: {res.meetingDate}</p>
                        {res.notes && <p className="text-xs text-muted-foreground mt-1">{res.notes}</p>}
                      </div>
                      <Badge variant="outline" className={
                        res.status === 'Confirmed' ? 'bg-green-50 text-green-700' :
                        res.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }>{res.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            <div className="space-y-4">
              {confirmed.map(res => (
                <Card key={res.id} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Invoice #{res.id}</p>
                          <p className="text-xs text-muted-foreground">{res.material} · {res.quantity}kg</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">${(res.quantity * (dataStore.MATERIALS.find(m => m.name === res.material)?.avgPrice || 0.5)).toFixed(2)}</p>
                        <Badge className="text-[10px] bg-green-50 text-green-700">Confirmed</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {confirmed.length === 0 && <Card className="p-12 text-center"><p className="text-muted-foreground">No invoices yet.</p></Card>}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-wine flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{currentUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentUser.company}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground text-xs">Email</span><p className="font-medium">{currentUser.email}</p></div>
                  <div><span className="text-muted-foreground text-xs">Phone</span><p className="font-medium">{currentUser.phone}</p></div>
                  <div><span className="text-muted-foreground text-xs">Location</span><p className="font-medium">{currentUser.location}</p></div>
                  <div><span className="text-muted-foreground text-xs">Sector</span><p className="font-medium">{currentUser.sector || 'Manufacturing'}</p></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reserve Modal */}
        <Dialog open={!!showReserve} onOpenChange={() => setShowReserve(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle className="font-heading">Reserve Material</DialogTitle></DialogHeader>
            {showReserve && (
              <div className="space-y-4 mt-2">
                <div className="p-3 rounded-xl bg-muted/50 border">
                  <p className="font-semibold text-sm">{showReserve.material}</p>
                  <p className="text-xs text-muted-foreground">{showReserve.batchId} · {showReserve.weight}kg available · {showReserve.purityGrade}</p>
                </div>
                <div>
                  <Label className="text-xs">Desired Quantity (kg) *</Label>
                  <Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder={`Max: ${showReserve.weight}`} className="h-10 rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs">Discussion Date *</Label>
                  <Input type="date" value={form.meetingDate} onChange={e => setForm({ ...form, meetingDate: e.target.value })} className="h-10 rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs">Company Details</Label>
                  <Input value={form.companyDetails} onChange={e => setForm({ ...form, companyDetails: e.target.value })} placeholder="Company name & sector" className="h-10 rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs">Notes</Label>
                  <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional requirements..." rows={3} className="rounded-xl" />
                </div>
                <Button onClick={handleReserve} className="w-full h-11 rounded-xl bg-gradient-wine text-white hover:opacity-90 font-semibold">
                  <Calendar className="w-4 h-4 mr-2" /> Submit Reservation
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}