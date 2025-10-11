import { TagProps } from "@/app/components/contents/SkillTag"
import { Database } from "@/utils/supabase/database.types"

type DatabaseType = Database['public']['Tables']

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

export type ProfileType = DatabaseType['profile']['Row']