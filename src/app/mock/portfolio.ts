import { PortfolioItemsProps } from "@/types/portfolio";

export const portfolioItemDatas: PortfolioItemsProps[] = [
    {
    mode: 'link',
    datas: [
      { value: 'obtuse.kr', url: 'https://obtuse.kr' },
      { value: 'triangledrop.obtuse.kr', url: 'https://triangledrop.obtuse.kr' },
    ]
  },
  {
    mode: 'certificate',
    datas: [
      { value: 'TOPCIT 3수준 이상' },
      { value: '정보처리산업기사' },
    ]
  },
  {
    mode: 'competition',
    datas: [
      { value: '2024 2회 교내 AI 공모전 4위' },
      { value: '2024 교내 여름 AI 캠프 장려상' },
      { value: '2024 정보올림피아드 1차대회 동상' },
      { value: '부산 북구 창업경진대회 최우수상' },
      { value: '2023 부울경 중학생 알고리즘 경진대회 동상' },
    ]
  },
  {
    mode: 'skill',
    datas: [
      { value: 'Node.js' },
      { value: 'FastAPI' },
      { value: 'Python' },
      { value: 'SpringBoot' },
      { value: 'React.js' },
      { value: 'Typescript' },
      { value: 'Next.js' },
    ]
  }
]