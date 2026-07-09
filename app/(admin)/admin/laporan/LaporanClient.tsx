'use client';

import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatRupiah } from '@/lib/utils-admin';

const FONT_UI = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

type OrderRow = {
  id: string;
  created_at: string;
  status: string;
  total_price: number | null;
  product_type: string;
  quantity: number;
  customer_name: string;
  order_materials: { total_cost: number }[] | null;
};

type LaporanClientProps = {
  initialOrders: OrderRow[];
};

export default function LaporanClient({ initialOrders }: LaporanClientProps) {
  const [period, setPeriod] = useState('Bulan Ini');

  // 1. Filter Orders by Period
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return initialOrders.filter(o => {
      const d = new Date(o.created_at);
      if (period === 'Minggu Ini') {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        return d >= start;
      }
      if (period === 'Bulan Ini') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (period === '3 Bulan') {
        const start = new Date(now);
        start.setMonth(now.getMonth() - 3);
        return d >= start;
      }
      if (period === '6 Bulan') {
        const start = new Date(now);
        start.setMonth(now.getMonth() - 6);
        return d >= start;
      }
      if (period === 'Tahun Ini') {
        return d.getFullYear() === now.getFullYear();
      }
      return true; // default all / Custom Range (simplified for now)
    });
  }, [initialOrders, period]);

  // 2. Compute Summaries
  const { totalRevenue, totalOrders, totalCost } = useMemo(() => {
    let rev = 0;
    let cost = 0;
    let count = 0;
    filteredOrders.forEach(o => {
      if (o.status !== 'cancelled') {
        count++;
        rev += o.total_price || 0;
        const oCost = o.order_materials?.reduce((sum, mat) => sum + (mat.total_cost || 0), 0) || 0;
        // Mock cost if no real cost (for demo/UI purposes, assume 60% HPP if zero)
        cost += oCost > 0 ? oCost : (o.total_price || 0) * 0.6;
      }
    });
    return { totalRevenue: rev, totalOrders: count, totalCost: cost };
  }, [filteredOrders]);

  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
  
  let marginColor = '#f87171'; // merah < 10
  if (profitMargin > 20) marginColor = '#10b981'; // hijau
  else if (profitMargin >= 10) marginColor = '#fbbf24'; // kuning

  // 3. Compute Chart Data
  const trendData = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach(o => {
      if (o.status === 'cancelled') return;
      const d = new Date(o.created_at);
      const key = period.includes('Bulan') || period === 'Tahun Ini' 
        ? d.toLocaleString('id-ID', { month: 'short' }) 
        : d.toLocaleString('id-ID', { weekday: 'short' });
      map.set(key, (map.get(key) || 0) + (o.total_price || 0));
    });
    return Array.from(map.entries()).map(([name, Revenue]) => ({ name, Revenue })).reverse();
  }, [filteredOrders, period]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach(o => {
      if (o.status === 'cancelled') return;
      const cat = o.product_type || 'Lainnya';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, Total]) => ({ name, Total }))
      .sort((a, b) => b.Total - a.Total)
      .slice(0, 5); // top 5
  }, [filteredOrders]);

  const topCustomers = useMemo(() => {
    const map = new Map<string, { orders: number, spending: number }>();
    filteredOrders.forEach(o => {
      if (o.status === 'cancelled') return;
      const c = map.get(o.customer_name) || { orders: 0, spending: 0 };
      c.orders += 1;
      c.spending += (o.total_price || 0);
      map.set(o.customer_name, c);
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.spending - a.spending)
      .slice(0, 5);
  }, [filteredOrders]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Order ID,Tanggal,Customer,Item,Qty,Total Harga,Status'];
    const rows = filteredOrders.map(o => 
      `${o.id},${o.created_at.split('T')[0]},"${o.customer_name}","${o.product_type}",${o.quantity},${o.total_price || 0},${o.status}`
    );
    const csv = headers.concat(rows).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Blackant_${period.replace(' ', '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-widest mb-1" style={{ color: '#acadae', fontFamily: FONT_UI }}>
            Analytics
          </p>
          <h2 className="text-[24px] font-medium text-white leading-none" style={{ fontFamily: FONT_UI }}>
            Laporan & Performa
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-9 px-3 rounded-[6px] text-[12px] outline-none transition-colors"
            style={{ 
              backgroundColor: '#1b1d1f', 
              color: '#ffffff', 
              border: '1px solid #34353c',
              fontFamily: FONT_UI 
            }}
          >
            <option value="Minggu Ini">Minggu Ini</option>
            <option value="Bulan Ini">Bulan Ini</option>
            <option value="3 Bulan">3 Bulan Terakhir</option>
            <option value="6 Bulan">6 Bulan Terakhir</option>
            <option value="Tahun Ini">Tahun Ini</option>
            <option value="Semua">Semua Waktu</option>
          </select>
          <button 
            onClick={handleExportCSV}
            className="h-9 px-4 rounded-[6px] text-[12px] font-medium flex items-center gap-2 transition-colors hover:bg-[#34353c]"
            style={{ 
              color: '#ffffff', 
              border: '1px solid #34353c', 
              backgroundColor: 'transparent',
              fontFamily: FONT_UI 
            }}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[8px]">
        {[
          { label: 'Total Revenue', value: formatRupiah(totalRevenue), color: '#10b981', font: FONT_MONO },
          { label: 'Total Orders', value: totalOrders.toString(), color: '#ffffff', font: FONT_MONO },
          { label: 'Average Order Value', value: formatRupiah(aov), color: '#83c3ff', font: FONT_MONO },
          { label: 'Profit Margin', value: `${profitMargin.toFixed(1)}%`, color: marginColor, font: FONT_MONO },
        ].map(card => (
          <div 
            key={card.label}
            className="p-[12px] rounded-[8px] flex flex-col justify-center"
            style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
          >
            <span className="text-[12px] text-[#acadae] mb-2" style={{ fontFamily: FONT_UI }}>{card.label}</span>
            <span className="text-[20px] font-medium" style={{ color: card.color, fontFamily: card.font }}>
              {card.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[8px]">
        {/* Revenue Trend */}
        <div 
          className="lg:col-span-2 p-[12px] rounded-[8px] flex flex-col gap-4"
          style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
        >
          <span className="text-[14px] font-medium text-white" style={{ fontFamily: FONT_UI }}>Revenue Trend</span>
          <div className="w-full h-[250px] bg-[#141415] rounded-[4px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#34353c" vertical={false} />
                <XAxis dataKey="name" stroke="#acadae" fontSize={12} tickLine={false} axisLine={false} fontFamily={FONT_MONO} />
                <YAxis stroke="#acadae" fontSize={12} tickLine={false} axisLine={false} fontFamily={FONT_MONO} tickFormatter={(val) => `Rp${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1b1d1f', border: '1px solid #34353c', borderRadius: '4px', fontFamily: FONT_UI, fontSize: '12px' }}
                  itemStyle={{ color: '#83c3ff', fontFamily: FONT_MONO }}
                  formatter={(value: any) => formatRupiah(Number(value))}
                />
                <Line type="monotone" dataKey="Revenue" stroke="#83c3ff" strokeWidth={2} dot={{ r: 4, fill: '#141415', stroke: '#83c3ff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Customers */}
        <div 
          className="p-[12px] rounded-[8px] flex flex-col gap-4"
          style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
        >
          <span className="text-[14px] font-medium text-white" style={{ fontFamily: FONT_UI }}>Top Customers</span>
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            {topCustomers.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[12px] font-medium text-white"
                  style={{ backgroundColor: '#3c3d40', fontFamily: FONT_UI }}
                >
                  {c.name.substring(0, 1).toUpperCase()}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[13px] text-white font-medium truncate" style={{ fontFamily: FONT_UI }}>{c.name}</span>
                  <span className="text-[11px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>{c.orders} pesanan</span>
                </div>
                <div className="text-[12px] font-medium" style={{ color: '#10b981', fontFamily: FONT_MONO }}>
                  {formatRupiah(c.spending)}
                </div>
              </div>
            ))}
            {topCustomers.length === 0 && (
              <div className="text-[12px] text-[#acadae] text-center my-auto" style={{ fontFamily: FONT_UI }}>Belum ada data</div>
            )}
          </div>
        </div>
      </div>

      {/* Product Category Breakdown */}
      <div 
        className="p-[12px] rounded-[8px] flex flex-col gap-4"
        style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
      >
        <span className="text-[14px] font-medium text-white" style={{ fontFamily: FONT_UI }}>Product Category Breakdown</span>
        <div className="w-full h-[200px] bg-[#141415] rounded-[4px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#34353c" horizontal={false} />
              <XAxis type="number" stroke="#acadae" fontSize={12} tickLine={false} axisLine={false} fontFamily={FONT_MONO} />
              <YAxis dataKey="name" type="category" stroke="#acadae" fontSize={12} tickLine={false} axisLine={false} fontFamily={FONT_UI} />
              <Tooltip 
                cursor={{ fill: '#1b1d1f' }}
                contentStyle={{ backgroundColor: '#1b1d1f', border: '1px solid #34353c', borderRadius: '4px', fontFamily: FONT_UI, fontSize: '12px' }}
                itemStyle={{ color: '#83c3ff', fontFamily: FONT_MONO }}
              />
              <Bar dataKey="Total" fill="#83c3ff" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
