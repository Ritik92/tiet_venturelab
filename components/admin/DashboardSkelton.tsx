import { Skeleton } from '@/components/ui/skelton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border border-gray-100 shadow-sm overflow-hidden">
            <div className="absolute h-full w-1 bg-gradient-to-b from-blue-300 to-blue-200 left-0 top-0"></div>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-1/2 bg-blue-100" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/4 mb-2 bg-blue-100" />
              <Skeleton className="h-4 w-2/3 bg-blue-50" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card className="border border-gray-100 shadow-sm overflow-hidden">
          <CardHeader>
            <Skeleton className="h-5 w-1/3 mb-1 bg-blue-100" />
            <Skeleton className="h-4 w-1/2 bg-blue-50" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-4 p-2 rounded-lg bg-blue-50/30">
                  <Skeleton className="h-10 w-10 rounded-full bg-blue-100" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-1/3 bg-blue-100" />
                    <Skeleton className="h-3 w-2/3 bg-blue-50" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-100 shadow-sm overflow-hidden">
          <CardHeader>
            <Skeleton className="h-5 w-1/3 mb-1 bg-blue-100" />
            <Skeleton className="h-4 w-1/2 bg-blue-50" />
          </CardHeader>
          <CardContent className="h-80">
            <Skeleton className="h-full w-full rounded-xl bg-gradient-to-br from-blue-100 to-blue-50" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}