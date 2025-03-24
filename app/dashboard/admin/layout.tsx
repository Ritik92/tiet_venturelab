import { AdminNavbar } from "@/components/admin/AdminNavBar";
import { cn } from "@/lib/utils";

export default function AdminLayout({ 
    children 
  }: { 
    children: React.ReactNode 
  }) {
    return (
        
      <div className="flex">
        {/* Sidebar Navigation */}
        <AdminNavbar />
        
        {/* Main Content Area */}
        <main 
          className={cn(
            "ml-64 flex-grow min-h-screen bg-gray-50 p-8",
            "transition-all duration-300"
          )}
        >
          {children}
        </main>
      </div>
    );
  }