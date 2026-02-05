import { useQuery, useMutation } from '@tanstack/react-query';
import { API } from '../api';
import type { CustomerProfile } from '@/types/customer';

export const communityKeys = {
  all: ['communities'] as const,
  list: () => [...communityKeys.all, 'list'] as const,
  generated: (persona: string, customerIds: string[]) =>
    [...communityKeys.all, 'generated', persona, customerIds] as const,
};

export const useGetCommunities = () => {
  return useQuery({
    queryKey: communityKeys.list(),
    queryFn: () => API.getCommunities(),
  });
};

// Mutation for generating communities
export const useGenerateCommunities = () => {
  return useMutation({
    mutationFn: ({
      persona,
      customers,
      count,
    }: {
      persona: string;
      customers: CustomerProfile[];
      count?: number;
    }) => API.generateCommunities(persona, customers, count),
  });
};

// Query for fetching generated communities (if you want to cache them)
export const useGeneratedCommunities = (
  persona: string | null,
  customers: CustomerProfile[] | null,
  enabled = true,
) => {
  const customerIds = customers?.map((c) => c.id) || [];

  return useQuery({
    queryKey: communityKeys.generated(persona || '', customerIds),
    queryFn: () => API.generateCommunities(persona!, customers!, 5),
    enabled: enabled && !!persona && !!customers && customers.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
