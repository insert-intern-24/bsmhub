'use client';

import MakeProfileOverlay from '../overlay/MakeProfile';
import { createClient } from '@/utils/supabase/client';
import OneTapComponent from '../../auth/GoogleOneTab';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dropdown from '@components/Dropdown';
import Image from 'next/image';

const UserProfile = ({ user }: { user: User }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="relative">
      <button
        className="block"
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <Image
          src={user.user_metadata.avatar_url}
          alt="Profile Image"
          width={21}
          height={21}
          className="rounded-full object-cover"
        />
      </button>
      {isDropdownOpen && (
        <Dropdown
          items={[
            {
              icon: 'shield_person',
              children: '계정설정',
              onClick: () => {
                router.push('/mypage');
              },
            },
            {
              icon: 'move_item',
              children: '로그아웃',
              onClick: () => {
                router.push('/auth/logout');
              },
            },
          ]}
          setOverlayBg={setDropdownOpen}
        />
      )}
      <MakeProfileOverlay />
    </div>
  );
};

const SignInButton = () => {
  const openLoginPopup = () => {
    const popup = window.open(
      `${window.location.origin}/auth/login`,
      '_blank',
      'popup,scrollbars=yes,resizable=yes,width=500,height=800',
    );

    popup?.focus();

    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data === 'success') {
        popup?.close();
      }
    });
  };

  return (
    <>
      <button
        className="bg-foreground text-white px-3 py-1 rounded-2xl"
        onClick={openLoginPopup}
      >
        sign in
      </button>
      <OneTapComponent />
    </>
  );
};

const AccountComponent = () => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      setUser(res.data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return user ? <UserProfile user={user} /> : <SignInButton />;
};

export default AccountComponent;
