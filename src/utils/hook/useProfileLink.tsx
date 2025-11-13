'use client';

import { useState, useEffect } from 'react';
import { getProfileByStudentId } from '@/services/profile/getProfileApi.client';
import { useCurrentUser } from '@/utils/hook/useCurrentUser';

export const useProfileLink = () => {
  const currentUser = useCurrentUser();
  const [profileLink, setProfileLink] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfileLink = async () => {
      if (!currentUser?.id || !mounted) return;
      const profile = await getProfileByStudentId(currentUser.id);

      if (!mounted) return;
      if (profile) {
        setProfileLink(`/portfolio/${profile.profile_name}`);
      } else {
        setProfileLink(null);
      }
    };
    fetchProfileLink();

    return () => {
      mounted = false;
    };
  }, [currentUser?.id]);

  return profileLink;
};

