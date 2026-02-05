import { useQuery, useMutation } from '@tanstack/react-query';
import { API } from '../api';

export const customerKeys = {
  all: ['customers'] as const,
  list: () => [...customerKeys.all, 'list'] as const,
  generated: (persona: string) =>
    [...customerKeys.all, 'generated', persona] as const,
};

export const useGetCustomers = () => {
  return useQuery({
    queryKey: customerKeys.list(),
    queryFn: () => API.getCustomers(),
  });
};

// Mutation for generating customers
export const useGenerateCustomers = () => {
  return useMutation({
    mutationFn: ({ persona, count }: { persona: string; count?: number }) =>
      API.generateCustomers(persona, count),
  });
};

// Query for fetching generated customers (if you want to cache them)
export const useGeneratedCustomers = (
  persona: string | null,
  enabled = true,
) => {
  return useQuery({
    queryKey: customerKeys.generated(persona || ''),
    queryFn: () => API.generateCustomers(persona!, 5),
    enabled: enabled && !!persona,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
