
'use client';
import Link from 'next/link';
import { IconStarFilled } from '@tabler/icons-react';
import { navigation } from './Header';
import { usePathname } from 'next/navigation';

const Navigator = () => {
  const pathName = usePathname();

  const extendedNavigation = [
    ...navigation,
    { label: '홈', href: '/'}
  ]

  return (
    <nav className='hidden responsive-navigator'>
      {extendedNavigation.map((({label, href}) => {
        const isActiveColor = pathName === href ? '#007AFF' : '#999'

        return (
          <Link
            key={label}
            href={href}
            className='flex-col flex-center'
          >
            <IconStarFilled
              color={`${isActiveColor}`}
            />
            <div style={{ color: isActiveColor }}>{label}</div>
          </Link>
        )
      }))}
    </nav>
  )
}

export default Navigator;