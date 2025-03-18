// app/layout.tsx
import '../../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/User_Navbar';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InnoFund - Connecting Ideas with Capital',
  description: 'A platform for entrepreneurs to find mentors and funding',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const user = session?.user ? {
    name: session.user.name,
    email: session.user.email,
    profileImage: session.user.image,
    role: session.user.role
  } : null;

  return (
    <html lang="en">
      <body className={inter.className}>
        
          <div className="min-h-screen flex flex-col">
           
            <main className="flex-1 bg-gray-50 ">
              {children}
            </main>
          </div>
       
      </body>
    </html>
  );
}