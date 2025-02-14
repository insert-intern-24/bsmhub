export interface Content {
  value: string,
  certified?: boolean | null, // 인증되었는가를 표시함
  address?: string | null // content > value를 클릭할때 이동할 주소
}

export interface Detail {
  label: string,
  symbol?: string | null,
  contents: Content[]
}

export interface Details {
  details? : Detail[] | null
}

export interface Collection {
  type: "collection"
  id: number,
  title: string,
  description: string,
  thumbnail?: string | null,
  // Data는 아직 database에 입력된 date의 종류를 기술하지 않았기 때문에 우선 string으로 작업함.
  startDate: string,
  endDate?: string | null,
  details: Details
  info : CollectionInformation
}

export interface CollectionInformation {
  target: string, // 대상
  pax: number, // 인원수
  views: number // 조회수
}

export interface Project {
  type: "project"
  id: number,
  title: string,
  description: string,
  thumbnail?: string | null,
  statement: "개발전" | "개발중" | "개발완료" | "서비스중",
  category: string
  details: Details
}

export type Collections = (Collection | Project)[]

export type DetailBoxType = "collection" | "project" | "general" | undefined