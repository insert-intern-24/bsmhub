import { CardProps } from "../components/card/project/ProjectCard";

interface PortfolioProject {
  mode: 'personal' | 'cooperation';
  datas: CardProps[];
}

const mockAuthorProfile = '/shared/profile.png';
const mockProjectImage = '/shared/project.png';

export const mockPortfolioProjects: PortfolioProject[] = [
  {
    mode: 'personal',
    datas: [
      {
        id: 101,
        title: '클라우드 기반 서버리스 백엔드 API',
        projectImage: mockProjectImage,
        authors: [
          { name: '이준호', profileImage: mockAuthorProfile },
        ],
      },
      {
        id: 102,
        title: 'React와 Zustand를 활용한 상태 관리 연습',
        projectImage: mockProjectImage,
        authors: [
          { name: '이준호', profileImage: mockAuthorProfile },
        ],
      },
      {
        id: 103,
        title: 'Go 언어로 만든 고성능 웹 크롤러',
        projectImage: mockProjectImage,
        authors: [
          { name: '이준호', profileImage: mockAuthorProfile },
        ],
      },
            {
        id: 104,
        title: 'Go 언어로 만든 고성능 웹 크롤러',
        projectImage: mockProjectImage,
        authors: [
          { name: '이준호', profileImage: mockAuthorProfile },
        ],
      },
    ],
  },
  {
    mode: 'cooperation',
    datas: [
      {
        id: 201,
        title: '분산 환경 채팅 애플리케이션 (팀 프로젝트)',
        projectImage: mockProjectImage,
        authors: [
          { name: '김민지', profileImage: mockAuthorProfile },
          { name: '박서준', profileImage: mockAuthorProfile },
          { name: '이준호', profileImage: mockAuthorProfile },
        ],
      },
      {
        id: 202,
        title: 'Next.js 기반 실시간 쇼핑몰 대시보드',
        projectImage: mockProjectImage,
        authors: [
          { name: '최예나', profileImage: mockAuthorProfile },
          { name: '정우진', profileImage: mockAuthorProfile },
        ],
      },
            {
        id: 203,
        title: 'Next.js 기반 실시간 쇼핑몰 대시보드',
        projectImage: mockProjectImage,
        authors: [
          { name: '최예나', profileImage: mockAuthorProfile },
          { name: '정우진', profileImage: mockAuthorProfile },
        ],
      },
            {
        id: 204,
        title: 'Next.js 기반 실시간 쇼핑몰 대시보드',
        projectImage: mockProjectImage,
        authors: [
          { name: '최예나', profileImage: mockAuthorProfile },
          { name: '정우진', profileImage: mockAuthorProfile },
        ],
      },
    ],
  },
];
