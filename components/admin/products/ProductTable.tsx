'use client';

import Link from 'next/link';
import { ProductStatus, Category } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { 
  ArrowUpDown, 
  Eye, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Product = {
  id: string;
  title: string;
  status: ProductStatus;
  category: Category;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

interface ProductsTableProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  sort: string;
  order: 'asc' | 'desc';
}

export default function ProductsTable({
  products,
  currentPage,
  totalPages,
  totalProducts,
  sort,
  order,
}: ProductsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  // Function to toggle sorting
  const toggleSort = (field: string) => {
    const newOrder = sort === field && order === 'asc' ? 'desc' : 'asc';
    router.push(`/admin/products?${createQueryString('sort', field)}&${createQueryString('order', newOrder)}`);
  };

  // Get status badge color
  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'FUNDED':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Navigation to different pages
  const goToPage = (page: number) => {
    router.push(`/admin/products?${createQueryString('page', page.toString())}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => toggleSort('title')}
              >
                <div className="flex items-center space-x-1">
                  <span>Title</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => toggleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Entrepreneur</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => toggleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Submitted</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.user.name}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                    >
                      <Link href={`/admin/products/${product.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{products.length}</strong> of <strong>{totalProducts}</strong> products
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}