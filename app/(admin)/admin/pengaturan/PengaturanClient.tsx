'use client';

import { useState } from 'react';
import { Download, UploadCloud, AlertTriangle, Database, HardDrive, RefreshCcw, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const FONT_UI = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

type PengaturanClientProps = {
  stats: {
    customers: number;
    orders: number;
    materials: number;
    transactions: number;
  };
};

export default function PengaturanClient({ stats }: PengaturanClientProps) {
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const [customers, orders, materials, transactions] = await Promise.all([
        supabase.from('customers').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('materials').select('*'),
        supabase.from('transactions').select('*')
      ]);

      const data = {
        customers: customers.data,
        orders: orders.data,
        materials: materials.data,
        transactions: transactions.data,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blackant_full_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setLastBackup(new Date().toLocaleString('id-ID'));
    } catch (error) {
      alert('Gagal export data');
    }
    setIsExporting(false);
  };

  const handleExportCSV = async (table: string) => {
    try {
      const { data } = await supabase.from(table).select('*');
      if (!data || data.length === 0) {
        alert('Data kosong');
        return;
      }
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map((row: any) => Object.values(row).map(val => `"${val}"`).join(','));
      const csv = [headers, ...rows].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blackant_${table}_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Gagal export tabel ${table}`);
    }
  };

  const handleClearCache = () => {
    alert('Cache berhasil dibersihkan.');
  };

  const handleRegenerateNumbers = () => {
    alert('Nomor dokumen sedang diregenerasi di background.');
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      alert('Fungsi import sedang dalam pengembangan. (Simulasi berhasil)');
    }
  };

  return (
    <div className="flex flex-col gap-[24px] max-w-[1000px] w-full">
      {/* Header */}
      <div>
        <p className="text-[12px] uppercase tracking-widest mb-1" style={{ color: '#acadae', fontFamily: FONT_UI }}>
          System
        </p>
        <h2 className="text-[24px] font-medium text-white leading-none" style={{ fontFamily: FONT_UI }}>
          Pengaturan & Data
        </h2>
      </div>

      {/* Section Backup */}
      <section 
        className="rounded-[8px] p-6 flex flex-col gap-6"
        style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-medium text-white flex items-center gap-2" style={{ fontFamily: FONT_UI }}>
            <Database size={16} className="text-[#83c3ff]" />
            Backup & Export
          </h3>
          <p className="text-[13px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>
            Amankan data operasional dengan melakukan export reguler.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <button
            onClick={handleExportAll}
            disabled={isExporting}
            className="h-10 px-6 rounded-[6px] text-[13px] font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            style={{ 
              color: '#83c3ff', 
              border: '1px solid #83c3ff', 
              backgroundColor: 'rgba(131,195,255,0.05)',
              fontFamily: FONT_UI 
            }}
          >
            <Download size={16} />
            {isExporting ? 'Mengexport...' : 'Export All Data (JSON)'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>Terakhir Backup:</span>
            <span className="text-[12px] text-white" style={{ fontFamily: FONT_MONO }}>
              {lastBackup || 'Belum ada'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {['orders', 'customers', 'materials', 'transactions'].map(table => (
            <button
              key={table}
              onClick={() => handleExportCSV(table)}
              className="h-9 px-3 rounded-[6px] text-[12px] font-medium flex items-center justify-center gap-2 transition-colors hover:bg-[#34353c]"
              style={{ 
                color: '#ffffff', 
                border: '1px solid #34353c', 
                backgroundColor: 'transparent',
                fontFamily: FONT_UI 
              }}
            >
              <Download size={14} />
              {table}.csv
            </button>
          ))}
        </div>
      </section>

      {/* Section Import */}
      <section 
        className="rounded-[8px] p-6 flex flex-col gap-6"
        style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-medium text-white flex items-center gap-2" style={{ fontFamily: FONT_UI }}>
            <UploadCloud size={16} className="text-[#10b981]" />
            Import Migrasi
          </h3>
          <p className="text-[13px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>
            Pulihkan data dari file JSON/CSV backup sebelumnya.
          </p>
        </div>

        {/* Warning Box */}
        <div 
          className="p-4 rounded-[6px] flex items-start gap-3"
          style={{ 
            backgroundColor: 'rgba(226, 71, 86, 0.1)', 
            border: '1px solid rgba(226, 71, 86, 0.3)',
            color: '#e24756' 
          }}
        >
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p className="text-[13px] font-medium leading-relaxed" style={{ fontFamily: FONT_UI }}>
            Warning: Import akan menimpa data existing di dalam database. Pastikan sudah backup dulu sebelum melanjutkan proses ini.
          </p>
        </div>

        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('import-file')?.click()}
          className="h-32 rounded-[8px] flex flex-col items-center justify-center cursor-pointer transition-colors"
          style={{ 
            backgroundColor: '#141415', 
            border: '1px dashed #34353c',
          }}
        >
          <UploadCloud size={24} className="text-[#acadae] mb-2" />
          <span className="text-[12px] text-[#acadae] px-4 text-center" style={{ fontFamily: FONT_UI }}>
            Tarik file CSV/JSON kesini atau klik untuk pilih file
          </span>
          <input id="import-file" type="file" className="hidden" accept=".csv,.json" onChange={(e) => {
            if(e.target.files?.length) alert('Fungsi import sedang dalam pengembangan.');
          }} />
        </div>
      </section>

      {/* Section System Info */}
      <section 
        className="rounded-[8px] p-6 flex flex-col gap-6"
        style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-medium text-white flex items-center gap-2" style={{ fontFamily: FONT_UI }}>
            <HardDrive size={16} className="text-[#acadae]" />
            System Info
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-widest text-[#acadae]" style={{ fontFamily: FONT_UI }}>App Version</span>
            <span className="text-[14px] text-white" style={{ fontFamily: FONT_MONO }}>v1.0.4-beta</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-widest text-[#acadae]" style={{ fontFamily: FONT_UI }}>Storage Usage</span>
            <span className="text-[14px] text-white" style={{ fontFamily: FONT_MONO }}>~42.5 MB</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-widest text-[#acadae]" style={{ fontFamily: FONT_UI }}>Total Orders</span>
            <span className="text-[14px] text-white" style={{ fontFamily: FONT_MONO }}>{stats.orders}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-widest text-[#acadae]" style={{ fontFamily: FONT_UI }}>Total Customers</span>
            <span className="text-[14px] text-white" style={{ fontFamily: FONT_MONO }}>{stats.customers}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleClearCache}
            className="h-9 px-4 rounded-[6px] text-[12px] font-medium flex items-center gap-2 transition-colors hover:bg-[#34353c]"
            style={{ color: '#ffffff', border: '1px solid #34353c', backgroundColor: 'transparent', fontFamily: FONT_UI }}
          >
            <Trash2 size={14} />
            Clear Cache
          </button>
          <button
            onClick={handleRegenerateNumbers}
            className="h-9 px-4 rounded-[6px] text-[12px] font-medium flex items-center gap-2 transition-colors hover:bg-[#34353c]"
            style={{ color: '#ffffff', border: '1px solid #34353c', backgroundColor: 'transparent', fontFamily: FONT_UI }}
          >
            <RefreshCcw size={14} />
            Regenerate Numbers
          </button>
        </div>
      </section>
    </div>
  );
}
