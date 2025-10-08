import { TagProps } from "@/app/components/contents/SkillTag"

export interface PortfolioProps {
  params: { uuid: string }
  searchParams: {
    path: 'home' | 'project'
  }
}

export interface ItemProps {
  mode: 'competition' | 'certificate' | 'link'
  value: string | null
  url?: string
}

export interface PortfolioItemsProps {
    mode: ItemProps['mode'] | 'skill'
    datas: Array<
        | Omit<ItemProps, 'mode'>
        | Omit<TagProps, 'mode'>
    >
}