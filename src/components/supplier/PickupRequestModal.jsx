import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dataStore } from '@/lib/dataStore';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

export default function PickupRequestModal({ open, onClose, user }) {
  const [form, setForm] = useState({
    material: '', estQty: '', condition: '', contamination: '', location: user?.location || '', pickupDate: '', notes: ''
  });

  const handleSubmit = () => {
    if (!form.material || !form.estQty || !form.pickupDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    const mat = dataStore.MATERIALS.find(m => m.name === form.material);
    dataStore.addOperation({
      supplierId: user.id,
      supplierName: user.name,
      material: form.material,
      materialCode: mat?.code || '',
      estQty: Number(form.estQty),
      actualQty: null,
      contamination: form.contamination ? Number(form.contamination) : null,
      qaResult: null,
      purityGrade: null,
      condition: form.condition || null,
      driverId: null,
      driverName: null,
      stage: 'Requested',
      location: form.location,
      notes: form.notes,
      pickupDate: form.pickupDate,
    });
    toast.success('Pickup request submitted successfully!');
    setForm({ material: '', estQty: '', condition: '', contamination: '', location: user?.location || '', pickupDate: '', notes: '' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">New Pickup Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-xs font-medium mb-1.5 block">Material Type *</Label>
            <Select value={form.material} onValueChange={v => setForm({ ...form, material: v })}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Select material" /></SelectTrigger>
              <SelectContent>
                {dataStore.MATERIALS.map(m => <SelectItem key={m.code} value={m.name}>{m.name} ({m.code})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Est. Quantity (kg) *</Label>
              <Input type="number" value={form.estQty} onChange={e => setForm({ ...form, estQty: e.target.value })} placeholder="e.g. 2500" className="h-10 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Condition</Label>
              <Select value={form.condition} onValueChange={v => setForm({ ...form, condition: v })}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {dataStore.CONDITIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Contamination (%)</Label>
              <Input type="number" value={form.contamination} onChange={e => setForm({ ...form, contamination: e.target.value })} placeholder="e.g. 5" className="h-10 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Pickup Date *</Label>
              <Input type="date" value={form.pickupDate} onChange={e => setForm({ ...form, pickupDate: e.target.value })} className="h-10 rounded-xl" />
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 block">Location</Label>
            <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="h-10 rounded-xl" />
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 block">Notes</Label>
            <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any additional details..." className="rounded-xl" rows={3} />
          </div>
          <Button onClick={handleSubmit} className="w-full h-11 rounded-xl bg-gradient-wine hover:opacity-90 text-white font-semibold">
            <Send className="w-4 h-4 mr-2" /> Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}