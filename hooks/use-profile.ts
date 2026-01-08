// hooks/use-profile.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/api.service';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
