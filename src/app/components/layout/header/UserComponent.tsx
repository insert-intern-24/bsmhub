'use client';

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

const UserComponent = () => {
  return (
    <button
      className="bg-foreground text-white px-3 py-1 rounded-2xl"
      onClick={openLoginPopup}
    >
      sign in
    </button>
  );
};

export default UserComponent;
