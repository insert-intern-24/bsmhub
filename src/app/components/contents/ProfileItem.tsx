import React from "react"
import Image from "next/image"
import Link from "next/link"

interface ItemProps {
  mode: 'competition' | 'certificate' | 'link'
  value: string | null
  url?: string | null
}

const ProfileItem = ({ mode, value, url }: ItemProps) => {
  const Content = (
    <div className='max-w-fit text-gray-base inline-flex text-sm font-normal'>
      {mode === 'link' && (
        <Image 
          src='/profile/link.svg' 
          alt='link icon'
          width={15}
          height={15}
        />
      )}
      {value}
      {mode === 'certificate' && (
        <Image 
          src='/profile/certificate.svg' 
          alt='certificate icon'
          width={12}
          height={12}
          className='ml-1'
        />
      )}
    </div>
  )

  return url ? (
    <Link
      href={url}
      target='_blank'
      className='outline-none border-none inline-flex max-w-fit'
    >{Content}</Link>
  ) : (
    Content
  )
}

export default ProfileItem;