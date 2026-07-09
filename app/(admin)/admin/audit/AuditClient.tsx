'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import type { ActivityLog } from '@/types/database';

const FONT_UI = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

type AuditClientProps = {
  initialLogs: ActivityLog[];
};

export default function AuditClient({ initialLogs }: AuditClientProps) {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 50;

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return initialLogs.filter(log => {
      if (filterAction && log.action !== filterAction) return false;
      if (filterEntity && log.entity_type !== filterEntity) return false;
      if (search) {
        const q = search.toLowerCase();
        const user = log.user_id?.toLowerCase() || '';
        const entity = log.entity_type?.toLowerCase() || '';
        const details = JSON.stringify(log.new_values || {}).toLowerCase();
        if (!user.includes(q) && !entity.includes(q) && !details.includes(q)) return false;
      }
      return true;
    });
  }, [initialLogs, search, filterAction, filterEntity]);

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);
  const currentLogs = filteredLogs.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const getActionColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('create') || act.includes('insert')) return '#10b981'; // Emerald
    if (act.includes('update') || act.includes('edit')) return '#83c3ff'; // Ice Signal
    if (act.includes('delete') || act.includes('remove')) return '#e24756'; // Vermilion
    return '#acadae'; // Fog
  };

  const syntaxHighlight = (json: any) => {
    if (!json) return 'null';
    let str = JSON.stringify(json, null, 2);
    // basic syntax highlight regex
    str = str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let color = '#ffffff'; // Paper White
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          color = '#83c3ff'; // key -> Ice Signal
        } else {
          color = '#10b981'; // string -> Emerald
        }
      }
      return `<span style="color: ${color}">${match}</span>`;
    });
    return str;
  };

  return (
    <div className="flex flex-col gap-4 max-w-[1200px] w-full">
      {/* Header */}
      <div>
        <p className="text-[12px] uppercase tracking-widest mb-1" style={{ color: '#acadae', fontFamily: FONT_UI }}>
          System
        </p>
        <h2 className="text-[24px] font-medium text-white leading-none" style={{ fontFamily: FONT_UI }}>
          Audit Trail
        </h2>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 h-9 rounded-[6px]" style={{ backgroundColor: '#141415', border: '1px solid #34353c' }}>
            <Search size={14} className="text-[#acadae]" />
            <input 
              type="text"
              placeholder="Search user, entity, details..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-[12px] text-white outline-none w-[180px]"
              style={{ fontFamily: FONT_UI }}
            />
          </div>

          <div className="flex items-center gap-2 px-3 h-9 rounded-[6px]" style={{ backgroundColor: '#141415', border: '1px solid #34353c' }}>
            <Filter size={14} className="text-[#acadae]" />
            <select 
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="bg-transparent text-[12px] text-white outline-none"
              style={{ fontFamily: FONT_UI }}
            >
              <option value="">Semua Action</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
            </select>
          </div>

          <select 
            value={filterEntity}
            onChange={e => setFilterEntity(e.target.value)}
            className="h-9 px-3 rounded-[6px] text-[12px] text-white outline-none"
            style={{ backgroundColor: '#141415', border: '1px solid #34353c', fontFamily: FONT_UI }}
          >
            <option value="">Semua Entity</option>
            {Array.from(new Set(initialLogs.map(l => l.entity_type))).filter(Boolean).map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[8px] overflow-hidden" style={{ backgroundColor: '#141415', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {['Timestamp', 'User', 'Action', 'Entity', 'Details'].map(h => (
                  <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-widest font-medium border-b" style={{ color: '#acadae', borderColor: '#34353c', fontFamily: FONT_UI }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentLogs.map(log => {
                const isExpanded = expandedRow === log.id;
                const dateObj = new Date(log.created_at);
                // format like "2026-07-09 14:45:00"
                const ts = `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;
                
                return (
                  <React.Fragment key={log.id}>
                    <tr 
                      onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                      className="group cursor-pointer transition-colors border-b" 
                      style={{ borderColor: '#34353c' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3c3d40'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <td className="px-4 py-2.5 text-[12px] whitespace-nowrap" style={{ color: '#acadae', fontFamily: FONT_MONO }}>{ts}</td>
                      <td className="px-4 py-2.5 text-[13px] text-white whitespace-nowrap" style={{ fontFamily: FONT_UI }}>{log.user_id || 'System'}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 text-[11px] rounded-[4px] uppercase tracking-wider" style={{ border: `1px solid ${getActionColor(log.action)}`, color: getActionColor(log.action), fontFamily: FONT_MONO }}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[13px] text-white whitespace-nowrap" style={{ fontFamily: FONT_UI }}>{log.entity_type}</td>
                      <td className="px-4 py-2.5 text-[12px] truncate max-w-[200px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                        {JSON.stringify(log.new_values || log.old_values || {})}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <td colSpan={5} className="px-4 py-4 border-b" style={{ borderColor: '#34353c' }}>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <span className="text-[11px] uppercase tracking-widest" style={{ color: '#acadae', fontFamily: FONT_UI }}>Old Values</span>
                              <pre className="p-3 rounded-[4px] text-[11px] overflow-x-auto" style={{ backgroundColor: '#080809', border: '1px solid #34353c', fontFamily: FONT_MONO }} dangerouslySetInnerHTML={{ __html: syntaxHighlight(log.old_values) }} />
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-[11px] uppercase tracking-widest" style={{ color: '#acadae', fontFamily: FONT_UI }}>New Values</span>
                              <pre className="p-3 rounded-[4px] text-[11px] overflow-x-auto" style={{ backgroundColor: '#080809', border: '1px solid #34353c', fontFamily: FONT_MONO }} dangerouslySetInnerHTML={{ __html: syntaxHighlight(log.new_values) }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {currentLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[13px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                    Tidak ada aktivitas yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#34353c' }}>
            <span className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
              Menampilkan {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, filteredLogs.length)} dari {filteredLogs.length} logs
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-[4px] flex items-center justify-center transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#26272d', border: '1px solid #34353c', color: '#ffffff' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-[4px] flex items-center justify-center transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#26272d', border: '1px solid #34353c', color: '#ffffff' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
