import React from "react"
import Link from "next/link"
import { IconLink } from "@tabler/icons-react"
import { ItemProps } from "@/types/portfolio"

const ProfileItem = ({ mode, value, url }: ItemProps) => {
  const Content = (
    <div className='max-w-fit text-gray-base flex-center gap-0.5 text-sm font-normal'>
      {mode === 'link' && (
        <IconLink 
          width={10}
          height={10}
        />
      )}
      {value}
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