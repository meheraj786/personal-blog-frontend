// app/admin/layout.tsx

import { ProtectedRoute } from '@/components/protected-route';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
