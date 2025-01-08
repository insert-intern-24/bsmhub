'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';

const openLoginPopup = () => {
  // login popup
  const popup = window.open(
    `${window.location.origin}/auth/login`,
    '_blank',
    'popup,scrollbars=yes,resizable=yes,width=500,height=800',
  );

  popup?.focus();

  // close popup
  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;

    if (event.data === 'success') {
      popup?.close();
      window.location.reload();
    }
  });
};
const AccountComponent = () => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  supabase.auth.getUser().then((res) => {
    setUser(res.data.user);
  });

  return user ? UserProfile(user) : signInButton();
};

export default AccountComponent;
function UserProfile(user: User) {
  return (
    <>
      <img
        src={user.user_metadata.avatar_url}
        alt="Profile Image"
        className="h-7 rounded-full"
      />
    </>
  );
}

function signInButton() {
  return (
    <button
      className="bg-foreground text-white px-3 py-1 rounded-2xl"
      onClick={openLoginPopup}
    >
      sign in
    </button>
  );
}
