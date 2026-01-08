// hooks/use-site.ts (Minor enhancement—no core fix needed)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { siteService } from '@/services/api.service';

export function useSite() {
  return useQuery({
    queryKey: ['site'],
    queryFn: siteService.getSite,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useUpdateSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: siteService.updateSite,
    onSuccess: (data) => {
      queryClient.setQueryData(['site'], data);
      queryClient.invalidateQueries({ queryKey: ['site'] });
    },
    onError: (error) => console.error('Failed to update site:', error), // ADDED: Error logging
  });
}
