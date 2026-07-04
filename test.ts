import { Database } from './types/database';

type GenericTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
};

type Orders = Database['public']['Tables']['orders'];
const test: GenericTable = {} as Orders;
