import { useQuery } from '@tanstack/react-query';
import { API } from '../api';

// ============================================
// Query Keys
// ============================================

export const healthKeys = {
  all: ['health'] as const,
  health: () => [...healthKeys.all] as const,
};

// ============================================
// Queries
// ============================================

export const useGetHealth = () => {
  return useQuery({
    queryKey: healthKeys.health(),
    queryFn: () => API.getHealth(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};
