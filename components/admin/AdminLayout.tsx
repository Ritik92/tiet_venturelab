import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSideBar';
import { useSession } from 'next-auth/react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
//     const { data: session } = useSession();
  
//   // Check if user is authenticated and has admin role
//   if (!session || session.user?.role !== 'ADMIN') {
//     redirect('/login');
//   }
  
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}