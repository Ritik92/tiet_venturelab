import { Users, Package, Handshake } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'user' | 'product' | 'mentorship';
  title: string;
  description: string;
  timestamp: Date;
}

interface RecentActivityFeedProps {
  activities: Activity[];
}

export default function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-blue-500 text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-full p-2 shadow-sm">
            {activity.type === 'user' && <Users className="h-4 w-4 text-white" />}
            {activity.type === 'product' && <Package className="h-4 w-4 text-white" />}
            {activity.type === 'mentorship' && <Handshake className="h-4 w-4 text-white" />}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-gray-800">{activity.title}</p>
            <p className="text-sm text-gray-600">{activity.description}</p>
            <p className="text-xs text-blue-500">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}