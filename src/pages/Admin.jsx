import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import StatCard from '@/components/shared/StatCard';
import AdminCharts from '@/components/admin/AdminCharts';
import OperationsTable from '@/components/admin/OperationsTable';
import InventoryPanel from '@/components/admin/InventoryPanel';
import { useDataStore } from '@/hooks/useDataStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Package, Warehouse, Users, Truck, ShoppingCart, AlertTriangle, Bell, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Admin() {
  const { operations, inventory, users, reservations, currentUser, getNotifications, store } = useDataStore();
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">Please log in as Admin to access this page.</p>
          <Button onClick={() => navigate('/login')} className="bg-gradient-wine text-white">Sign In</Button>
        </div>
      </div>
    );
  }

  const notifications = getNotifications(currentUser.id);
  const unread = notifications.filter(n => !n.read).length;
  const activeOps = operations.filter(o => !['Completed', 'Rejected'].includes(o.stage));
  const suppliers = users.filter(u => u.role === 'supplier');
  const drivers = users.filter(u => u.role === 'driver');
  const totalStock = inventory.reduce((s, i) => s + i.weight, 0);
  const nearExpiry = inventory.filter(i => {
    const days = Math.floor((new Date(i.riskDate).getTime() - Date.now()) / 86400000);
    return days < 30 && days >= 0;
  });
  const messages = store.getMessages().filter(m => m.to === 'u2');
  const pendingReservations = reservations.filter(r => r.status === 'Pending');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Waste-to-Value Operations Center</p>
          </div>
          <div className="flex gap-2">
            {nearExpiry.length > 0 && (
              <Badge className="bg-red-50 text-red-600 border-red-200 gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {nearExpiry.length} Near Expiry
              </Badge>
            )}
            {unread > 0 && (
              <Badge className="bg-primary/10 text-primary gap-1">
                <Bell className="w-3.5 h-3.5" /> {unread} Unread
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Active Operations" value={activeOps.length} icon={Package} />
          <StatCard title="Suppliers" value={suppliers.length} icon={Users} trend="+2" trendUp />
          <StatCard title="Drivers" value={drivers.length} icon={Truck} />
          <StatCard title="Total Stock" value={`${(totalStock / 1000).toFixed(1)}t`} icon={Warehouse} />
          <StatCard title="Reservations" value={reservations.length} icon={ShoppingCart} />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted rounded-xl p-1 flex-wrap h-auto">
            <TabsTrigger value="overview" className="rounded-lg text-xs gap-1.5"><LayoutDashboard className="w-3.5 h-3.5" /> Overview</TabsTrigger>
            <TabsTrigger value="operations" className="rounded-lg text-xs gap-1.5"><Package className="w-3.5 h-3.5" /> Operations</TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-lg text-xs gap-1.5"><Warehouse className="w-3.5 h-3.5" /> Inventory</TabsTrigger>
            <TabsTrigger value="reservations" className="rounded-lg text-xs gap-1.5"><ShoppingCart className="w-3.5 h-3.5" /> Reservations</TabsTrigger>
            <TabsTrigger value="messages" className="rounded-lg text-xs gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Messages ({messages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminCharts operations={operations} inventory={inventory} />
          </TabsContent>

          <TabsContent value="operations">
            <OperationsTable operations={operations} users={users} />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryPanel inventory={inventory} />
          </TabsContent>

          <TabsContent value="reservations">
            <Card>
              <CardHeader><CardTitle className="text-base">Industry Reservations</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {reservations.length === 0 && <p className="text-sm text-muted-foreground">No reservations yet.</p>}
                {reservations.map(res => (
                  <motion.div key={res.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 rounded-xl border border-border/60">
                    <div>
                      <p className="font-semibold text-sm">{res.industryName}</p>
                      <p className="text-xs text-muted-foreground">{res.material} · {res.quantity}kg · Meeting: {res.meetingDate}</p>
                      {res.notes && <p className="text-xs text-muted-foreground mt-1">{res.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={res.status === 'Confirmed' ? 'bg-green-50 text-green-700' : res.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-muted'}>{res.status}</Badge>
                      {res.status === 'Pending' && (
                        <>
                          <Button size="sm" className="h-7 text-xs bg-green-600 text-white" onClick={() => { store.updateReservation(res.id, { status: 'Confirmed' }); store.addNotification(res.industryId, 'reservation', `Your reservation for ${res.material} has been confirmed!`, null); }}>Approve</Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-destructive" onClick={() => { store.updateReservation(res.id, { status: 'Rejected' }); store.addNotification(res.industryId, 'reservation', `Your reservation for ${res.material} was declined.`, null); }}>Reject</Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader><CardTitle className="text-base">Messages from Suppliers</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
                {messages.map(msg => (
                  <div key={msg.id} className="p-4 rounded-xl bg-muted/50 border border-border/40">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">{msg.fromName}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}