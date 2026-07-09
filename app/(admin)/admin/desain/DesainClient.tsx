'use client';

import { useState, useRef, useTransition, useActionState, useEffect } from 'react';
import { UploadCloud, Eye, Download, Trash2, Filter, X, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { createDesignRecord, deleteDesign } from '@/actions/designs';

const FONT_UI = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

type DesignRecord = {
  id: string;
  name: string;
  file_url: string;
  file_type: string | null;
  notes: string | null;
  created_at: string;
  customers?: { id: string; name: string } | null;
  orders?: { id: string; order_number: string } | null;
};

type DesainClientProps = {
  initialDesigns: any[];
  customers: { id: string; name: string }[];
  orders: { id: string; order_number: string; customer_name: string }[];
};

export default function DesainClient({ initialDesigns, customers, orders }: DesainClientProps) {
  const [designs, setDesigns] = useState<DesignRecord[]>(initialDesigns);
  
  // Dialogs
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDesign, setPreviewDesign] = useState<DesignRecord | null>(null);
  
  // Filters
  const [filterType, setFilterType] = useState<string>('');
  const [filterCustomer, setFilterCustomer] = useState<string>('');

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form action
  const [state, formAction, isPending] = useActionState(createDesignRecord, { status: 'idle' });

  // Reset upload dialog on success
  useEffect(() => {
    if (state.status === 'success' && !isPending && isUploadOpen) {
      setIsUploadOpen(false);
      setFile(null);
      // Auto reload could be handled by router.refresh() from action, but since we use local state here:
      window.location.reload(); 
    }
  }, [state.status, isPending, isUploadOpen]);

  // Filtering
  const filteredDesigns = designs.filter(d => {
    if (filterType && d.file_type !== filterType) return false;
    if (filterCustomer && d.customers?.id !== filterCustomer) return false;
    return true;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleCustomUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert('Pilih file desain terlebih dahulu.');
      return;
    }
    
    setUploading(true);
    
    // Upload ke Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('designs')
      .upload(fileName, file);
      
    if (uploadError) {
      alert(`Gagal upload file: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    // Dapatkan public URL
    const { data: publicUrlData } = supabase.storage.from('designs').getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl;

    // Trigger server action manually
    const formData = new FormData(e.currentTarget);
    formData.set('file_url', publicUrl);
    
    startTransition(() => {
      formAction(formData);
    });
    setUploading(false);
  };

  const [isPendingDelete, startTransition] = useTransition();
  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Hapus desain ini?')) return;
    const res = await deleteDesign(id, url);
    if (res.success) {
      setDesigns(prev => prev.filter(d => d.id !== id));
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 h-9 rounded-[6px]" style={{ backgroundColor: '#141415', border: '1px solid #34353c' }}>
            <Filter size={14} className="text-[#acadae]" />
            <select 
              className="bg-transparent text-[12px] text-white outline-none"
              style={{ fontFamily: FONT_UI }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Semua Tipe</option>
              <option value="Logo">Logo</option>
              <option value="Mockup">Mockup</option>
              <option value="Pattern">Pattern</option>
              <option value="Reference">Reference</option>
            </select>
          </div>
          
          <select 
            className="h-9 px-3 rounded-[6px] text-[12px] text-white outline-none"
            style={{ backgroundColor: '#141415', border: '1px solid #34353c', fontFamily: FONT_UI }}
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
          >
            <option value="">Semua Customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <button 
          onClick={() => setIsUploadOpen(true)}
          className="h-9 px-4 rounded-[6px] text-[12px] font-medium transition-colors"
          style={{ 
            color: '#83c3ff', 
            border: '1px solid #83c3ff', 
            backgroundColor: 'rgba(131,195,255,0.1)',
            fontFamily: FONT_UI 
          }}
        >
          Upload Desain
        </button>
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px]">
        {filteredDesigns.map(design => (
          <div 
            key={design.id}
            className="relative rounded-[8px] overflow-hidden group flex flex-col"
            style={{ 
              backgroundColor: '#1b1d1f', 
              boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' 
            }}
          >
            {/* Thumbnail aspect-square */}
            <div className="w-full aspect-square bg-[#141415] relative">
              <img 
                src={design.file_url} 
                alt={design.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Type Badge */}
              <div 
                className="absolute top-3 right-3 px-2 py-0.5 rounded-[4px] text-[11px] uppercase tracking-wider"
                style={{ 
                  backgroundColor: '#1b1d1f', 
                  border: '1px solid #83c3ff', 
                  color: '#83c3ff',
                  fontFamily: FONT_MONO
                }}
              >
                {design.file_type || 'Desain'}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  onClick={() => setPreviewDesign(design)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ffffff] hover:bg-[#acadae] transition-colors"
                >
                  <Eye size={18} color="#080809" />
                </button>
                <a 
                  href={design.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  download
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ffffff] hover:bg-[#acadae] transition-colors"
                >
                  <Download size={18} color="#080809" />
                </a>
                <button 
                  onClick={() => handleDelete(design.id, design.file_url)}
                  disabled={isPendingDelete}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e24756] hover:bg-[#c93f4c] transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} color="#ffffff" />
                </button>
              </div>
            </div>

            {/* Caption band (56px) */}
            <div className="h-[56px] px-4 flex flex-col justify-center border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <span className="text-[14px] font-medium text-white truncate" style={{ fontFamily: FONT_UI }}>
                {design.name}
              </span>
              <span className="text-[12px] truncate" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                {design.customers?.name || 'No Customer'} {design.orders ? `• Order: ${design.orders.order_number}` : ''}
              </span>
            </div>
          </div>
        ))}
        {filteredDesigns.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed rounded-[8px]" style={{ borderColor: '#34353c' }}>
            <ImageIcon size={32} className="text-[#acadae] opacity-30 mb-4" />
            <span className="text-[14px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>Belum ada desain yang diunggah.</span>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent 
          className="sm:max-w-[425px] border-none p-6" 
          style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-[18px] font-medium" style={{ fontFamily: FONT_UI }}>Upload Desain</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCustomUploadSubmit} className="flex flex-col gap-4 mt-2">
            
            {/* Drag & Drop Zone */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="h-32 rounded-[8px] flex flex-col items-center justify-center cursor-pointer transition-colors"
              style={{ 
                backgroundColor: isDragging ? 'rgba(131,195,255,0.05)' : '#141415', 
                border: `1px dashed ${isDragging ? '#83c3ff' : '#34353c'}`,
              }}
            >
              <UploadCloud size={24} className="text-[#acadae] mb-2" />
              <span className="text-[12px] text-[#acadae] px-4 text-center" style={{ fontFamily: FONT_UI }}>
                {file ? file.name : 'Tarik file kesini atau klik untuk upload'}
              </span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden" 
                accept="image/*,.pdf"
              />
            </div>

            {/* Hidden URL input */}
            <input type="hidden" name="file_url" value="placeholder" />

            {/* Fields */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>Nama Desain</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="h-9 px-3 rounded-[6px] bg-[#141415] text-[13px] text-white outline-none focus:ring-1 focus:ring-[#83c3ff]"
                style={{ border: '1px solid #34353c' }}
                placeholder="Misal: Mockup Kaos Event"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>Tipe</label>
              <select 
                name="file_type" 
                required 
                className="h-9 px-3 rounded-[6px] bg-[#141415] text-[13px] text-white outline-none focus:ring-1 focus:ring-[#83c3ff]"
                style={{ border: '1px solid #34353c' }}
              >
                <option value="Mockup">Mockup</option>
                <option value="Logo">Logo</option>
                <option value="Pattern">Pattern</option>
                <option value="Reference">Reference</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>Customer</label>
              <select 
                name="customer_id" 
                required 
                className="h-9 px-3 rounded-[6px] bg-[#141415] text-[13px] text-white outline-none focus:ring-1 focus:ring-[#83c3ff]"
                style={{ border: '1px solid #34353c' }}
              >
                <option value="">Pilih Customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>Terkait Order (Opsional)</label>
              <select 
                name="order_id" 
                className="h-9 px-3 rounded-[6px] bg-[#141415] text-[13px] text-white outline-none focus:ring-1 focus:ring-[#83c3ff]"
                style={{ border: '1px solid #34353c' }}
              >
                <option value="">Tidak ada</option>
                {orders.map(o => <option key={o.id} value={o.id}>{o.order_number} - {o.customer_name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>Catatan (Opsional)</label>
              <textarea 
                name="notes" 
                rows={2}
                className="p-3 rounded-[6px] bg-[#141415] text-[13px] text-white outline-none focus:ring-1 focus:ring-[#83c3ff]"
                style={{ border: '1px solid #34353c' }}
              />
            </div>

            {state.status === 'error' && (
              <div className="text-[12px] text-[#e24756] mt-1">{state.message}</div>
            )}

            <div className="flex justify-end gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => setIsUploadOpen(false)}
                className="h-9 px-4 rounded-[6px] text-[12px] font-medium text-[#acadae] hover:text-white transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isPending || uploading}
                className="h-9 px-5 rounded-[6px] text-[12px] font-medium text-[#080809] transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#83c3ff' }}
              >
                {(isPending || uploading) ? 'Mengunggah...' : 'Upload'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewDesign} onOpenChange={() => setPreviewDesign(null)}>
        <DialogContent 
          className="sm:max-w-[700px] border-none p-0 overflow-hidden"
          style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
        >
          {previewDesign && (
            <div className="flex flex-col">
              <div className="relative w-full h-[400px] bg-[#141415]">
                <img 
                  src={previewDesign.file_url} 
                  alt={previewDesign.name}
                  className="w-full h-full object-contain"
                />
                <button 
                  onClick={() => setPreviewDesign(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[20px] font-medium text-white leading-none" style={{ fontFamily: FONT_UI }}>{previewDesign.name}</h3>
                    <p className="text-[13px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>
                      {previewDesign.customers?.name} {previewDesign.orders ? `• Order: ${previewDesign.orders.order_number}` : ''}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-[4px] text-[11px] uppercase tracking-wider" style={{ border: '1px solid #83c3ff', color: '#83c3ff', fontFamily: FONT_MONO }}>
                    {previewDesign.file_type}
                  </div>
                </div>
                {previewDesign.notes && (
                  <p className="text-[13px] text-[#acadae] leading-relaxed" style={{ fontFamily: FONT_UI }}>
                    {previewDesign.notes}
                  </p>
                )}
                <div className="flex justify-end pt-2">
                  <a 
                    href={previewDesign.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    download
                    className="h-9 px-5 rounded-[6px] text-[12px] font-medium flex items-center gap-2 transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <Download size={14} />
                    Download Resolusi Penuh
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
