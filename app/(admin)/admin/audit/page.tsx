import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import AuditClient from './AuditClient';

export const metadata: Metadata = { title: 'Audit Trail' };

export default async function AuditPage() {
  const supabase = createServerSupabaseClient();
  
  // We'll fetch the first 200 logs to start with, client can fetch more if needed
  const { data: logs } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  return <AuditClient initialLogs={logs || []} />;
}
