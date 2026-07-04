'use client';

import { useState, useMemo } from 'react';
import { PlusCircle, Search, Trash2, Send, Save, FileText } from 'lucide-react';
import type { Customer } from '@/types/database';

const FONT_UI = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

type QuotationItem = {
  id: string;
  description: string;
  qty: number;
  unit: string;
  unit_cost: number;
  unit_price: number;
};

export default function QuotationClient({ customers }: { customers: Pick<Customer, 'id' | 'name' | 'phone' | 'email' | 'address'>[] }) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [quoteNumber, setQuoteNumber] = useState(`QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  
  const customer = customers.find(c => c.id === selectedCustomerId);

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        description: '',
        qty: 1,
        unit: 'pcs',
        unit_cost: 0,
        unit_price: 0,
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Calculations
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0), [items]);
  const totalHPP = useMemo(() => items.reduce((sum, item) => sum + (item.qty * item.unit_cost), 0), [items]);
  const totalHargaJual = subtotal; // Assuming no additional global discount for now
  const marginProfitAmount = totalHargaJual - totalHPP;
  const marginProfitPercent = totalHargaJual > 0 ? (marginProfitAmount / totalHargaJual) * 100 : 0;

  const handleSaveDraft = async () => {
    alert('Fungsi Simpan Draft akan segera hadir!');
  };

  const handleSend = async () => {
    alert('Quotation telah dikirim ke customer!');
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full pb-10">
      
      {/* ── KIRI: Form Input ─────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        
        {/* Customer & Info */}
        <div className="p-5 rounded-[8px] flex flex-col gap-4" style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}>
          <h2 className="text-[14px] font-semibold text-white tracking-tight" style={{ fontFamily: FONT_UI }}>Informasi Umum</h2>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>Pilih Customer *</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full h-9 px-3 text-[13px] outline-none transition-colors"
              style={{
                backgroundColor: '#0d0d0e', color: '#ffffff',
                border: '1px solid #34353c', borderRadius: '4px', fontFamily: FONT_UI,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
            >
              <option value="" disabled style={{ backgroundColor: '#1b1d1f' }}>— Cari & Pilih Customer —</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id} style={{ backgroundColor: '#1b1d1f' }}>
                  {c.name} {c.phone ? `(${c.phone})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>Nomor Quotation</label>
            <input
              type="text"
              value={quoteNumber}
              onChange={(e) => setQuoteNumber(e.target.value)}
              className="w-full h-9 px-3 text-[13px] outline-none"
              style={{
                backgroundColor: '#0d0d0e', color: '#ffffff',
                border: '1px solid #34353c', borderRadius: '4px', fontFamily: FONT_MONO,
              }}
            />
          </div>
        </div>

        {/* Item List */}
        <div className="p-5 rounded-[8px] flex flex-col gap-4" style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-white tracking-tight" style={{ fontFamily: FONT_UI }}>Item Penawaran</h2>
            <button
              onClick={handleAddItem}
              className="inline-flex items-center gap-2 h-8 px-3 text-[12px] font-medium rounded-[4px] transition-all"
              style={{ border: '1px solid #83c3ff', color: '#83c3ff', backgroundColor: 'transparent', fontFamily: FONT_UI }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#83c3ff'; e.currentTarget.style.color = '#080809'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#83c3ff'; }}
            >
              <PlusCircle size={13} />
              Tambah Item
            </button>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {items.map((item, index) => {
              const marginAmt = item.unit_price - item.unit_cost;
              const marginPct = item.unit_price > 0 ? (marginAmt / item.unit_price) * 100 : 0;
              return (
                <div key={item.id} className="p-4 rounded-[6px] relative" style={{ backgroundColor: '#0d0d0e', border: '1px solid #34353c' }}>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-3 right-3 text-[#f87171] opacity-70 hover:opacity-100 transition-opacity"
                    title="Hapus Item"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="col-span-2 md:col-span-4 flex flex-col gap-1 pr-6">
                      <label className="text-[11px] text-[#acadae]">Deskripsi Item</label>
                      <input
                        type="text"
                        placeholder="Contoh: Kaos Polos Hitam XL"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full h-8 px-2 text-[12px] rounded-[4px] bg-[#1b1d1f] text-white border border-[#34353c] outline-none focus:border-[#83c3ff] placeholder:text-[#acadae]"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-[#acadae]">Jumlah (Qty)</label>
                      <input
                        type="number" min={1}
                        value={item.qty || ''}
                        onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                        className="w-full h-8 px-2 text-[12px] rounded-[4px] bg-[#1b1d1f] text-white border border-[#34353c] outline-none focus:border-[#83c3ff]"
                        style={{ fontFamily: FONT_MONO }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-[#acadae]">Satuan</label>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                        className="w-full h-8 px-2 text-[12px] rounded-[4px] bg-[#1b1d1f] text-white border border-[#34353c] outline-none focus:border-[#83c3ff]"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-[#acadae]">HPP / unit</label>
                      <input
                        type="number" min={0}
                        value={item.unit_cost || ''}
                        onChange={(e) => updateItem(item.id, 'unit_cost', parseInt(e.target.value) || 0)}
                        className="w-full h-8 px-2 text-[12px] rounded-[4px] bg-[#1b1d1f] text-white border border-[#34353c] outline-none focus:border-[#83c3ff]"
                        style={{ fontFamily: FONT_MONO }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-[#acadae]">Harga Jual / unit</label>
                      <input
                        type="number" min={0}
                        value={item.unit_price || ''}
                        onChange={(e) => updateItem(item.id, 'unit_price', parseInt(e.target.value) || 0)}
                        className="w-full h-8 px-2 text-[12px] rounded-[4px] bg-[#1b1d1f] text-white border border-[#34353c] outline-none focus:border-[#83c3ff]"
                        style={{ fontFamily: FONT_MONO }}
                      />
                    </div>
                  </div>
                  
                  {/* Margin indicator per item */}
                  <div className="mt-3 pt-2 border-t border-[#34353c] flex items-center justify-between">
                    <span className="text-[11px] text-[#acadae]">Margin: {formatIDR(marginAmt)}</span>
                    <span className={`text-[11px] font-mono ${marginPct > 20 ? 'text-[#34d399]' : marginPct > 0 ? 'text-[#83c3ff]' : 'text-[#f87171]'}`}>
                      {marginPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
            
            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-[#34353c] rounded-[6px]">
                <FileText size={20} className="text-[#acadae] opacity-50 mb-2" />
                <span className="text-[12px] text-[#acadae]">Belum ada item ditambahkan.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── KANAN: Preview Quotation ─────────────────────────── */}
      <div className="flex flex-col h-full gap-4">
        <div className="sticky top-6 flex flex-col gap-4">
          
          <div 
            className="flex-1 rounded-[8px] p-8 flex flex-col gap-8 min-h-[500px]"
            style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}
          >
            {/* Header Document */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-[#34353c] pb-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-[28px] font-bold text-white tracking-tight leading-none" style={{ fontFamily: FONT_UI }}>QUOTATION</h1>
                <span className="text-[16px] text-[#83c3ff]" style={{ fontFamily: FONT_MONO }}>{quoteNumber}</span>
                <span className="text-[12px] text-[#acadae] mt-1">Tanggal: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              <div className="flex flex-col gap-1 text-left sm:text-right">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#acadae]">DITUJUKAN KEPADA:</span>
                <span className="text-[14px] font-semibold text-white">{customer ? customer.name : 'Nama Customer'}</span>
                {customer?.phone && <span className="text-[12px] text-[#acadae]">{customer.phone}</span>}
                {customer?.email && <span className="text-[12px] text-[#acadae]">{customer.email}</span>}
                {customer?.address && <span className="text-[12px] text-[#acadae] max-w-[200px] mt-1">{customer.address}</span>}
              </div>
            </div>

            {/* Table Preview */}
            <div className="flex-1 flex flex-col">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#34353c]">
                    <th className="py-2 text-[11px] font-semibold text-[#acadae] uppercase tracking-wider w-[50%]">Deskripsi</th>
                    <th className="py-2 text-[11px] font-semibold text-[#acadae] uppercase tracking-wider text-center w-[15%]">Qty</th>
                    <th className="py-2 text-[11px] font-semibold text-[#acadae] uppercase tracking-wider text-right w-[15%]">Harga Satuan</th>
                    <th className="py-2 text-[11px] font-semibold text-[#acadae] uppercase tracking-wider text-right w-[20%]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#34353c]/50">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-[12px] text-[#acadae] italic">Data item masih kosong...</td>
                    </tr>
                  ) : items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 text-[13px] text-white break-words">{item.description || '-'}</td>
                      <td className="py-3 text-[13px] text-white text-center">
                        <span style={{ fontFamily: FONT_MONO }}>{item.qty}</span> <span className="text-[11px] text-[#acadae]">{item.unit}</span>
                      </td>
                      <td className="py-3 text-[13px] text-white text-right" style={{ fontFamily: FONT_MONO }}>
                        {formatIDR(item.unit_price)}
                      </td>
                      <td className="py-3 text-[13px] text-white text-right font-medium" style={{ fontFamily: FONT_MONO }}>
                        {formatIDR(item.qty * item.unit_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Calculation */}
            <div className="flex flex-col items-end gap-1.5 pt-4 border-t border-[#34353c]">
              <div className="flex justify-between w-full sm:w-[250px] text-[12px]">
                <span className="text-[#acadae]">Subtotal</span>
                <span className="text-white" style={{ fontFamily: FONT_MONO }}>{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-[250px] text-[12px]">
                <span className="text-[#acadae]">Total HPP</span>
                <span className="text-white" style={{ fontFamily: FONT_MONO }}>{formatIDR(totalHPP)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-[250px] text-[14px] font-bold mt-2 pt-2 border-t border-[#34353c]">
                <span className="text-white">TOTAL</span>
                <span className="text-[#83c3ff]" style={{ fontFamily: FONT_MONO }}>{formatIDR(totalHargaJual)}</span>
              </div>
              
              <div className="flex justify-between w-full sm:w-[250px] text-[12px] mt-2 bg-[#0d0d0e] p-2 rounded-[4px] border border-[#34353c]">
                <span className="text-[#acadae]">Margin Profit</span>
                <span 
                  className={`font-semibold ${marginProfitPercent > 20 ? 'text-[#34d399]' : marginProfitPercent > 0 ? 'text-[#83c3ff]' : 'text-[#f87171]'}`}
                  style={{ fontFamily: FONT_MONO }}
                >
                  {formatIDR(marginProfitAmount)} ({marginProfitPercent.toFixed(1)}%)
                </span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 h-9 px-4 text-[13px] font-medium rounded-[4px] transition-all bg-[#34353c] text-white hover:bg-[#3c3d40]"
            >
              <Save size={14} />
              Simpan Draft
            </button>
            <button
              onClick={handleSend}
              className="flex items-center gap-2 h-9 px-4 text-[13px] font-medium rounded-[4px] transition-all text-[#080809]"
              style={{ backgroundColor: '#83c3ff' }}
            >
              <Send size={14} />
              Kirim ke Customer
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
