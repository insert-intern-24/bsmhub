'use client';
import Link from 'next/link';
import { IconHome } from '@tabler/icons-react';
import { navigation } from './Header';
import { usePathname } from 'next/navigation';

const Navigator = () => {
  const pathName = usePathname();

  const extendedNavigation = [
    { label: '홈', href: '/', icon: IconHome },
    ...navigation,
  ];

  return (
    <nav className="hidden responsive-navigator fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-light-gray-outline flex-around">
      {extendedNavigation.map((item) => {
        const { label, href, icon: Icon, external } = item;
        const isActiveColor = pathName === href ? '#007AFF' : '#595959';

        return (
          <Link 
            key={label} 
            href={href} 
            className="flex-col flex-center"
            {...(external && { target: "_blank", rel: "noopener noreferrer nofollow" })}
          >
            <Icon color={`${isActiveColor}`} />
            <div style={{ color: isActiveColor }}>{label}</div>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigator;
