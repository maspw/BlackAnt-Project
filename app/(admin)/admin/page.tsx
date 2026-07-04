import { redirect } from 'next/navigation';

/**
 * app/(admin)/admin/page.tsx
 *
 * Route: /admin → redirect ke /admin/dashboard
 */
export default function AdminRootPage() {
  redirect('/admin/dashboard');
}
