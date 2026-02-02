import { useQuery } from '@tanstack/react-query';
import { API } from '../api';

export const customerKeys = {
  all: ['customers'] as const,
  list: () => [...customerKeys.all, 'list'] as const,
};

export const useGetCustomers = () => {
  return useQuery({
    queryKey: customerKeys.list(),
    queryFn: () => API.getCustomers(),
  });
};
