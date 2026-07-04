import { Database } from './types/database';
import { SupabaseClient } from '@supabase/supabase-js';
const client: SupabaseClient<Database> = {} as any;
client.from('orders').select('*').then(x => x.data?.[0]?.id);
