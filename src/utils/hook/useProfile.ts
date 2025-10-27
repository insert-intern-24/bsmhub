'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { checkProfileExistence } from '@/services/client/profile/profileApi';

// Query Keys
export const profileKeys = {
  all: ['profile'] as const,
  existence: () => [...profileKeys.all, 'existence'] as const,
};

// 프로필 존재 여부 Hook
export const useProfileExistence = () => {
  return useQuery({
    queryKey: profileKeys.existence(),
    queryFn: checkProfileExistence,
    enabled: true,
    staleTime: Infinity,
  });
};

// 프로필 존재 여부 새로고침 Hook
export const useRefreshProfileExistence = () => {
  const queryClient = useQueryClient();
  
  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: profileKeys.existence(),
    });
  };

  return { refresh };
};

// 프로필 존재 여부 캐시 무효화 Hook
export const useInvalidateProfileExistence = () => {
  const queryClient = useQueryClient();
  
  const invalidate = () => {
    queryClient.removeQueries({
      queryKey: profileKeys.existence(),
    });
  };

  return { invalidate };
};
