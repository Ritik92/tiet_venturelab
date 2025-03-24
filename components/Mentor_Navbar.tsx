import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  Award, 
  BookOpen, 
  UserCheck, 
  MessageCircle, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';
import { redirect } from 'next/navigation';

 export const MentorNavbar = () => {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white shadow-md border-r border-gray-100 p-4">
      <div className="flex flex-col h-full">
        {/* Logo and Title */}
        <div className="mb-8 flex items-center space-x-3">
          <Award className="h-8 w-8 text-sky-600" />
          <h2 className="text-xl font-bold text-gray-800">Mentor Dashboard</h2>
        </div>

        {/* Navigation Links */}
        <div className="space-y-2 flex-grow">
          <NavLink 
            href="/dashboard/mentor" 
            icon={<Home className="h-5 w-5" />} 
            label="Home" 
          />
          <NavLink 
            href="/dashboard/mentor/available-products" 
            icon={<BookOpen className="h-5 w-5" />} 
            label="Available Products" 
          />
          <NavLink 
            href="/dashboard/mentor/profile" 
            icon={<UserCheck className="h-5 w-5" />} 
            label="Mentor Profile" 
          />
          <NavLink 
            href="/dashboard/mentor/messages" 
            icon={<MessageCircle className="h-5 w-5" />} 
            label="Messages" 
          />
          <NavLink 
            href="/dashboard/mentor/settings" 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings" 
          />
        </div>

        {/* Footer */}
        <div className="mt-auto text-center text-sm text-gray-500 pt-4 border-t">
          © {new Date().getFullYear()} Mentor Dashboard
        </div>
      </div>
    </nav>
  );
};

// Helper component for navigation links
const NavLink = ({ 
  href, 
  icon, 
  label 
}: { 
  href: string, 
  icon: React.ReactNode, 
  label: string 
}) => {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center space-x-3 px-4 py-2 rounded-md transition-all duration-200",
        "text-gray-700 hover:bg-sky-50 hover:text-sky-600",
        "group relative"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
      <div 
        className={cn(
          "absolute right-2 h-1.5 w-1.5 rounded-full opacity-0",
          "group-hover:opacity-100 bg-sky-500 transition-opacity"
        )}
      />
    </Link>
  );
};
