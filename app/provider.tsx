'use client';
import React, { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
     
        <Suspense>
        {children}
        </Suspense>
        
  
    </SessionProvider>
  );
};