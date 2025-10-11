import { TagProps } from "@/app/components/contents/SkillTag"

export interface ItemProps {
  mode: 'competition' | 'certificate' | 'link'
  value: string | null
  url?: string
  prize?: string
}

export interface PortfolioDetailProps {
    mode: ItemProps['mode'] | 'skill'
    datas: Array<
        | Omit<ItemProps, 'mode'>
        | Omit<TagProps, 'mode'>
    >
}