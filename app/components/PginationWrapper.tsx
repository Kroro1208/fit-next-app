'use client';

import React from 'react';
import Pagination from '@/app/components/Pagination';

interface PaginationWrapperProps {
  totalPages: number;
}

export default function PaginationWrapper({ totalPages }: PaginationWrapperProps) {
  return <Pagination totalPages={totalPages} />;
}