'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
            return;
        }

        if (status === 'authenticated') {
            const role = session?.user?.role;
            
            switch (role) {
                case 'ADMIN':
                    router.push('/dashboard/admin');
                    break;
                case 'MENTOR':
                    router.push('/dashboard/mentor');
                    break;
                case 'ENTREPRENEUR': // Fixed typo: ENTERPRENEUR → ENTREPRENEUR
                    router.push('/dashboard/user');
                    break;
                default:
                    // Handle unknown role or no role
                    console.log('Unknown or missing role:', role);
                    // You could redirect to a default page or show an error
                    break;
            }
        }
    }, [status, session, router]);

    // Loading state
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
            </div>
        );
    }

    // Default content (will be briefly shown before redirect happens)
    return (
        <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
            </div>
    );
}