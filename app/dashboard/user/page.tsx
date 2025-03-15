'use client';

import { useSession } from 'next-auth/react';

export default function Dashboard() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return <div>Please sign in to view dashboard</div>;
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="space-y-4">
                {session?.user?.image && (
                    <img
                        src={session.user.image}
                        alt="User avatar"
                        className="w-24 h-24 rounded-full mx-auto"
                    />
                )}
                
                <div className="space-y-2">
                    <p className="text-gray-700">
                        <span className="font-semibold">Name:</span> {session?.user?.name}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Email:</span> {session?.user?.email}
                    </p>
                </div>
            </div>
        </div>
    );
}
