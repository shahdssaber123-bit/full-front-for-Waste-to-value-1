import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#7B2D3B', '#B87333', '#5B8C5A', '#D4A853', '#3E2723', '#8B5E3C', '#6B7280', '#2563EB'];

export default function AdminCharts({ operations, inventory }) {
  // Material breakdown
  const matData = operations.reduce((acc, op) => {
    const existing = acc.find(a => a.name === op.material);
    if (existing) { existing.value += (op.actualQty || op.estQty); }
    else { acc.push({ name: op.material, value: op.actualQty || op.estQty }); }
    return acc;
  }, []);

  // Stage breakdown
  const stageData = operations.reduce((acc, op) => {
    const existing = acc.find(a => a.name === op.stage);
    if (existing) { existing.count += 1; }
    else { acc.push({ name: op.stage, count: 1 }); }
    return acc;
  }, []);

  // Monthly volume (simulated)
  const monthlyData = [
    { month: 'Jan', volume: 8200 }, { month: 'Feb', volume: 9400 },
    { month: 'Mar', volume: 11200 }, { month: 'Apr', volume: 12480 },
  ];

  // Inventory aging
  const now = Date.now();
  const agingData = inventory.map(item => {
    const daysOld = Math.floor((now - new Date(item.dateAdded).getTime()) / 86400000);
    const daysToRisk = Math.floor((new Date(item.riskDate).getTime() - now) / 86400000);
    return { name: item.material.substring(0, 10), daysOld, daysToRisk: Math.max(0, daysToRisk) };
  });

  // Purity distribution
  const purityData = inventory.reduce((acc, item) => {
    const g = item.purityGrade || 'Unknown';
    const existing = acc.find(a => a.name === g);
    if (existing) existing.value += item.weight;
    else acc.push({ name: g, value: item.weight });
    return acc;
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Volume (kg)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,20%,88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="volume" fill="#7B2D3B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Materials Breakdown</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={matData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name.substring(0, 8)}>
                {matData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Purity Distribution</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={purityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>
                {purityData.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Inventory Aging (days)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={agingData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,20%,88%)" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
              <Tooltip />
              <Bar dataKey="daysOld" fill="#B87333" name="Days in Stock" radius={[0, 4, 4, 0]} />
              <Bar dataKey="daysToRisk" fill="#5B8C5A" name="Days to Risk" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}