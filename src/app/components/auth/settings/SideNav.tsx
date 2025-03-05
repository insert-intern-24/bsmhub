'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AccountSettingMenus = [
  { title: '내 정보', path: '/auth/settings' },
  { title: '진로', path: '/auth/settings/career' },
  { title: '보안', path: '/auth/settings/security' },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="min-w-64">
      <nav className="flex flex-col py-4 px-2 border-r-[1px] border-strokeColor">
        {AccountSettingMenus.map(({ title, path }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={title}
              href={path}
              className={`px-3 py-2 rounded-lg hover:bg-footerBgColor ${
                isActive ? 'font-bold bg-footerBgColor' : ''
              }`}
            >
              <h2>{title}</h2>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
