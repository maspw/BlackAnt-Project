'use client';

import { useState, useEffect } from 'react';
import { Bell, Clock, Package, ShoppingCart, Info, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/lib/supabaseClient';
import type { Notification } from '@/types/database';
import { markAsRead, markAllAsRead } from '@/actions/notifications';
import { formatRelativeTime } from '@/lib/utils-admin';

const FONT_UI = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

function getNotificationIcon(type: string) {
  switch (type) {
    case 'deadline':
      return <Clock size={14} className="text-white" />;
    case 'stock':
      return <Package size={14} className="text-white" />;
    case 'order':
      return <ShoppingCart size={14} className="text-white" />;
    default:
      return <Info size={14} className="text-white" />;
  }
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initial fetch
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) {
        setNotifications(data as Notification[]);
      }
    };
    
    fetchNotifications();

    // Listen to changes
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = notifications.length;

  const handleMarkAsRead = async (id: string) => {
    // Optimistic UI update
    setNotifications(prev => prev.filter(n => n.id !== id));
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications([]);
    await markAllAsRead();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#3c3d40]/50 transition-colors"
          title="Notifikasi"
        >
          <Bell size={18} className="text-[#acadae]" />
          {unreadCount > 0 && (
            <span 
              className="absolute top-1 right-1 flex items-center justify-center min-w-[14px] h-[14px] rounded-full text-[9px] font-bold text-white px-1"
              style={{ backgroundColor: '#e24756', fontFamily: FONT_MONO }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        align="end" 
        className="w-80 p-0 border-none rounded-[8px] overflow-hidden"
        style={{ 
          backgroundColor: '#1b1d1f', 
          boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset, 0 10px 30px rgba(0,0,0,0.5)' 
        }}
      >
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #34353c' }}>
          <span className="text-[13px] font-semibold text-white tracking-tight" style={{ fontFamily: FONT_UI }}>Notifikasi</span>
          <span className="text-[10px] font-medium text-[#83c3ff] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(131,195,255,0.1)' }}>
            {unreadCount} baru
          </span>
        </div>

        <div className="flex flex-col max-h-[350px] overflow-y-auto scrollbar-thin">
          {unreadCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell size={24} className="text-[#acadae] opacity-30 mb-2" />
              <span className="text-[12px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>Tidak ada notifikasi baru</span>
            </div>
          ) : (
            notifications.map((notif, i) => {
              const isUrgent = notif.priority === 'urgent';
              return (
                <div 
                  key={notif.id} 
                  className="flex items-start gap-3 p-4 hover:bg-[#3c3d40]/30 transition-colors relative group"
                  style={{ 
                    borderBottom: i < notifications.length - 1 ? '1px solid #34353c' : 'none',
                    borderLeft: `2px solid ${isUrgent ? '#e24756' : '#83c3ff'}`
                  }}
                >
                  <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: isUrgent ? 'rgba(226,71,86,0.15)' : 'rgba(131,195,255,0.15)' }}>
                    {getNotificationIcon(notif.type)}
                  </div>
                  
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[12px] font-semibold text-white leading-tight mb-1" style={{ fontFamily: FONT_UI }}>
                      {notif.title}
                    </span>
                    {notif.message && (
                      <span className="text-[12px] text-[#acadae] leading-snug mb-1.5" style={{ fontFamily: FONT_UI }}>
                        {notif.message}
                      </span>
                    )}
                    <span className="text-[10px] text-[#acadae]" style={{ fontFamily: FONT_MONO }}>
                      {formatRelativeTime(notif.created_at)}
                    </span>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notif.id);
                    }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded flex items-center justify-center bg-[#1b1d1f] hover:bg-[#34353c] text-[#83c3ff] border border-[#34353c]"
                    title="Tandai sudah dibaca"
                  >
                    <Check size={12} strokeWidth={3} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {unreadCount > 0 && (
          <div className="p-2" style={{ borderTop: '1px solid #34353c' }}>
            <button 
              onClick={handleMarkAllAsRead}
              className="w-full h-8 flex items-center justify-center text-[12px] font-medium text-[#acadae] hover:text-white hover:bg-[#34353c]/50 rounded-[4px] transition-colors"
              style={{ fontFamily: FONT_UI }}
            >
              Tandai semua sudah dibaca
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
