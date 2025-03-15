'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { ProductStatus, Category } from '@prisma/client';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface ProductFiltersProps {
  currentStatus?: ProductStatus;
  currentCategory?: Category;
  currentQuery?: string;
}

export default function ProductFilters({
  currentStatus,
  currentCategory,
  currentQuery = '',
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === '') {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    return params.toString();
  };
  
  const handleStatusChange = (value: string) => {
    startTransition(() => {
      router.push(`/admin/products?${createQueryString('status', value)}`);
    });
  };
  
  const handleCategoryChange = (value: string) => {
    startTransition(() => {
      router.push(`/admin/products?${createQueryString('category', value)}`);
    });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(`/admin/products?${createQueryString('query', searchQuery)}`);
    });
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    startTransition(() => {
      router.push('/admin/products');
    });
  };
  
  // Check if any filters are active
  const hasActiveFilters = currentStatus || currentCategory || currentQuery;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:w-2/3 lg:w-1/2">
            <Select
              value={currentStatus || ''}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="FUNDED">Funded</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={currentCategory || ''}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                <SelectItem value="HEALTH">Health</SelectItem>
                <SelectItem value="EDUCATION">Education</SelectItem>
                <SelectItem value="FINANCE">Finance</SelectItem>
                <SelectItem value="FOOD">Food</SelectItem>
                <SelectItem value="RETAIL">Retail</SelectItem>
                <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                <SelectItem value="SUSTAINABILITY">Sustainability</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="whitespace-nowrap"
              disabled={isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}