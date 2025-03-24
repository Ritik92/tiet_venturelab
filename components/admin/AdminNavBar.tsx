'use client'
import React from 'react';
import Link from 'next/link';
import { Home, Package, Handshake, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

export const AdminNavbar = () => {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white shadow-md border-r border-gray-100 p-4">
      <div className="flex flex-col h-full">
        {/* Logo and Title */}
        <div className="mb-8 flex items-center space-x-3">
          <LayoutDashboard className="h-8 w-8 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>

        {/* Navigation Links */}
        <div className="space-y-2 flex-grow">
          <NavLink 
            href="/dashboard/admin" 
            icon={<Home className="h-5 w-5" />} 
            label="Home" 
          />
          <NavLink 
            href="/dashboard/admin/products" 
            icon={<Package className="h-5 w-5" />} 
            label="Manage Products" 
          />
          <NavLink 
            href="/dashboard/admin/mentorship" 
            icon={<Handshake className="h-5 w-5" />} 
            label="Manage Mentorships" 
          />
            <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center space-x-3 px-4 py-2 rounded-md transition-all duration-200 w-full text-left text-red-600 hover:bg-red-50 hover:cursor-pointer"
            >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Log Out</span>
            </button>
        </div>

        {/* Footer */}
        <div className="mt-auto text-center text-sm text-gray-500 pt-4 border-t">
          © {new Date().getFullYear()} Admin Dashboard
        </div>
      </div>
    </nav>
  );
};
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
        "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
        "group relative"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
      <div 
        className={cn(
          "absolute right-2 h-1.5 w-1.5 rounded-full opacity-0",
          "group-hover:opacity-100 bg-blue-500 transition-opacity"
        )}
      />
    </Link>
  );
};