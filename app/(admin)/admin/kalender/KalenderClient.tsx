'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Package } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import type { Order } from '@/types/database';

const FONT_UI = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

function getCalendarDays(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Convert JS day (0=Sun, 1=Mon) to our grid (0=Mon...6=Sun)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const days: Date[] = [];
  // Pad previous month
  for (let i = 0; i < offset; i++) {
    days.push(new Date(year, month, 1 - offset + i));
  }
  // Current month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  // Pad next month
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }
  return days;
}

function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

function normalizeDate(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function KalenderClient({ orders }: { orders: Order[] }) {
  const today = normalizeDate(new Date());
  
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const calendarDays = useMemo(() => {
    return getCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth());
  }, [currentMonth]);

  const monthName = currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // Event Styling Logic
  // Ice Signal #83c3ff untuk deadline mendekat, Emerald #34d399 untuk selesai, Vermilion #e24756 untuk overdue.
  const getEventStyle = (order: Order) => {
    if (!order.deadline_date) return null;
    const deadline = normalizeDate(new Date(order.deadline_date));
    const isFinished = order.status === 'finish' || order.status === 'shipping';
    
    if (isFinished) {
      return { bg: 'rgba(52,211,153,0.15)', text: '#34d399', border: 'rgba(52,211,153,0.3)' }; // Emerald
    }
    if (deadline.getTime() < today.getTime()) {
      return { bg: 'rgba(226,71,86,0.15)', text: '#e24756', border: 'rgba(226,71,86,0.3)' }; // Vermilion
    }
    return { bg: 'rgba(131,195,255,0.15)', text: '#83c3ff', border: 'rgba(131,195,255,0.3)' }; // Ice Signal
  };

  // Upcoming deadlines (next 7 days, excluding finished ones)
  const upcomingDeadlines = useMemo(() => {
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    return orders.filter(o => {
      if (!o.deadline_date) return false;
      const isFinished = o.status === 'finish' || o.status === 'shipping';
      if (isFinished) return false;
      
      const deadline = normalizeDate(new Date(o.deadline_date));
      return deadline.getTime() >= today.getTime() && deadline.getTime() <= sevenDaysFromNow.getTime();
    }).sort((a, b) => new Date(a.deadline_date!).getTime() - new Date(b.deadline_date!).getTime());
  }, [orders, today]);

  const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full flex-1 min-h-0">
      
      {/* ── KIRI: Kalender ───────────────────────────────────── */}
      <div 
        className="flex-1 flex flex-col rounded-[8px] p-5 h-full overflow-hidden"
        style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}
      >
        <div className="flex items-center justify-between mb-5 shrink-0">
          <div className="flex items-center gap-2">
            <CalendarIcon size={18} style={{ color: '#83c3ff' }} />
            <h2 className="text-[16px] font-semibold text-white tracking-tight" style={{ fontFamily: FONT_UI }}>{monthName}</h2>
          </div>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-[4px] border transition-colors"
              style={{ borderColor: '#34353c', color: '#acadae' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3c3d40'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#acadae'; }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-[4px] border transition-colors"
              style={{ borderColor: '#34353c', color: '#acadae' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3c3d40'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#acadae'; }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Header Hari */}
          <div className="grid grid-cols-7 shrink-0" style={{ borderBottom: '1px solid #34353c' }}>
            {WEEKDAYS.map(day => (
              <div key={day} className="py-2 text-center text-[12px] uppercase font-medium tracking-wider" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid Tanggal */}
          <div className="grid grid-cols-7 flex-1 border-l border-[#34353c]">
            {calendarDays.map((day, idx) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isToday = isSameDay(day, today);
              
              // Find events for this day
              const dayEvents = orders.filter(o => {
                if (!o.deadline_date) return false;
                return isSameDay(normalizeDate(new Date(o.deadline_date)), day);
              });

              return (
                <div
                  key={idx}
                  className="flex flex-col p-1.5 overflow-hidden"
                  style={{
                    borderRight: '1px solid #34353c',
                    borderBottom: '1px solid #34353c',
                    backgroundColor: isToday ? 'rgba(131,195,255,0.05)' : 'transparent',
                  }}
                >
                  <span
                    className={`text-[12px] font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                      isToday ? 'bg-[#83c3ff] text-[#080809]' : (isCurrentMonth ? 'text-white' : 'text-[#acadae] opacity-40')
                    }`}
                    style={{ fontFamily: FONT_UI }}
                  >
                    {day.getDate()}
                  </span>
                  
                  <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] scrollbar-thin">
                    {dayEvents.map(event => {
                      const style = getEventStyle(event);
                      if (!style) return null;
                      return (
                        <button
                          key={event.id}
                          onClick={() => setSelectedOrder(event)}
                          className="text-left text-[11px] px-1.5 py-1 rounded-[3px] truncate w-full transition-opacity hover:opacity-80 border"
                          style={{
                            backgroundColor: style.bg,
                            color: style.text,
                            borderColor: style.border,
                            fontFamily: FONT_UI
                          }}
                          title={`${event.customer_name} - ${event.product_type}`}
                        >
                          <span className="font-semibold">{event.customer_name}</span> <span className="opacity-80">({event.quantity}pcs)</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── KANAN: Upcoming Deadlines ────────────────────────── */}
      <div 
        className="w-full lg:w-[320px] shrink-0 rounded-[8px] p-5 flex flex-col h-full overflow-hidden"
        style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}
      >
        <div className="flex items-center gap-2 mb-5 shrink-0">
          <Clock size={16} style={{ color: '#acadae' }} />
          <h3 className="text-[14px] font-semibold text-white tracking-tight" style={{ fontFamily: FONT_UI }}>Upcoming Deadlines (7 Hari)</h3>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col">
          {upcomingDeadlines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
              <Package size={24} className="text-[#acadae] mb-2" />
              <span className="text-[12px] text-[#acadae]">Tidak ada pesanan mendekati deadline.</span>
            </div>
          ) : (
            upcomingDeadlines.map((order, i) => {
              const deadline = new Date(order.deadline_date!);
              const style = getEventStyle(order);
              return (
                <div
                  key={order.id}
                  className="flex flex-col py-3 cursor-pointer group"
                  style={{ borderBottom: i < upcomingDeadlines.length - 1 ? '1px solid #34353c' : 'none' }}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[13px] font-semibold text-white group-hover:text-[#83c3ff] transition-colors">{order.customer_name}</span>
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-[3px]" style={{ backgroundColor: style?.bg, color: style?.text, border: `1px solid ${style?.border}` }}>
                      {deadline.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#acadae]">{order.product_type}</span>
                    <span className="text-[12px] text-white" style={{ fontFamily: FONT_MONO }}>{order.quantity} pcs</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── MODAL: Order Detail ────────────────────────── */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => { if(!open) setSelectedOrder(null); }}>
        {selectedOrder && (
          <DialogContent
            className="p-0 border-0 max-w-sm overflow-hidden"
            style={{
              backgroundColor: '#1b1d1f',
              boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset, 0 24px 64px rgba(0,0,0,0.6)',
              borderRadius: '8px',
            }}
          >
            <DialogHeader
              className="px-5 h-[48px] flex-row items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <CalendarIcon size={14} style={{ color: '#83c3ff' }} />
                <DialogTitle className="text-[14px] font-medium text-white m-0" style={{ fontFamily: FONT_UI }}>
                  Detail Order
                </DialogTitle>
              </div>
              <DialogDescription className="sr-only">Detail informasi order kalender</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col px-5 py-4 gap-4">
              <div className="flex flex-col gap-1 text-center bg-[#0d0d0e] border border-[#34353c] rounded-[6px] p-3">
                <span className="text-[11px] text-[#acadae] uppercase tracking-wider">No. Pesanan</span>
                <span className="text-[15px] font-bold text-[#83c3ff]" style={{ fontFamily: FONT_MONO }}>{selectedOrder.order_number}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-[#34353c]">
                <span className="text-[12px] text-[#acadae]">Customer</span>
                <span className="text-[13px] font-semibold text-white">{selectedOrder.customer_name}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#34353c]">
                <span className="text-[12px] text-[#acadae]">Jenis Produk</span>
                <span className="text-[13px] text-white">{selectedOrder.product_type}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#34353c]">
                <span className="text-[12px] text-[#acadae]">Jumlah</span>
                <span className="text-[13px] text-white font-semibold" style={{ fontFamily: FONT_MONO }}>{selectedOrder.quantity} pcs</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#34353c]">
                <span className="text-[12px] text-[#acadae]">Status</span>
                <span className="text-[12px] uppercase tracking-wider font-semibold text-white">{selectedOrder.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[#acadae]">Deadline</span>
                <span className="text-[13px] text-[#e24756] font-semibold">
                  {new Date(selectedOrder.deadline_date!).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
