import { useQuery } from '@tanstack/react-query';
import { API } from '../api';

// ============================================
// Query Keys
// ============================================

export const helloKeys = {
  all: ['hello'] as const,
  hello: () => [...helloKeys.all] as const,
};

// ============================================
// Queries
// ============================================

export const useGetHello = () => {
  return useQuery({
    queryKey: helloKeys.hello(),
    queryFn: () => API.getHello(),
    staleTime: 60 * 1000, // 1 minute
  });
};
