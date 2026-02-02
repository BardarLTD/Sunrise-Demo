import { useQuery } from '@tanstack/react-query';
import { API } from '../api';

export const communityKeys = {
  all: ['communities'] as const,
  list: () => [...communityKeys.all, 'list'] as const,
};

export const useGetCommunities = () => {
  return useQuery({
    queryKey: communityKeys.list(),
    queryFn: () => API.getCommunities(),
  });
};
