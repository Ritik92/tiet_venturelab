// components/product-status-badge.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProductStatus } from '@prisma/client';

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const statusConfig = {
    PENDING: { label: 'Pending', variant: 'outline' },
    APPROVED: { label: 'Approved', variant: 'success' },
    REJECTED: { label: 'Rejected', variant: 'destructive' },
    FUNDED: { label: 'Funded', variant: 'default' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant as any} className="font-normal">
      {config.label}
    </Badge>
  );
}