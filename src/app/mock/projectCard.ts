interface CardProps {
  id: number;
  title: string;
  projectImage: string;
  authors: {
    name: string;
    profileImage: string;
  }[];
}

export const mockCardData: CardProps[] = [
  {
    id: 101,
    title: 'AI 기반 스마트 헬스케어 시스템 개발',
    projectImage: '/shared/project.png',
    authors: [
      {
        name: '김민준',
        profileImage: '/shared/profile.png',
      },
      {
        name: '이서윤',
        profileImage: '/shared/profile.png',
      },
    ],
  },
  {
    id: 205,
    title: '반려동물 입양 매칭 플랫폼 ReHome',
    projectImage: '/shared/project.png',
    authors: [
      {
        name: '박지훈',
        profileImage: '/shared/profile.png',
      },
    ],
  },
  {
    id: 312,
    title: '실시간 협업 가능한 온라인 코드 에디터',
    projectImage: '/shared/project.png',
    authors: [
      {
        name: '최예나',
        profileImage: '/shared/profile.png',
      },
      {
        name: '정우진',
        profileImage: '/shared/profile.png',
      },
      {
        name: '한솔',
        profileImage: '/shared/profile.png',
      },
    ],
  },
    {
    id: 315,
    title: '실시간 협업 가능한 온라인 코드 에디터',
    projectImage: '/shared/project.png',
    authors: [
      {
        name: '최예나',
        profileImage: '/shared/profile.png',
      },
      {
        name: '정우진',
        profileImage: '/shared/profile.png',
      },
      {
        name: '한솔',
        profileImage: '/shared/profile.png',
      },
    ],
  },
      {
    id: 3,
    title: '실시간 협업 가능한 온라인 코드 에디터',
    projectImage: '/shared/project.png',
    authors: [
      {
        name: '최예나',
        profileImage: '/shared/profile.png',
      },
      {
        name: '정우진',
        profileImage: '/shared/profile.png',
      },
      {
        name: '한솔',
        profileImage: '/shared/profile.png',
      },
    ],
  },
      {
    id: 4,
    title: '실시간 협업 가능한 온라인 코드 에디터',
    projectImage: '/shared/project.png',
    authors: [
      {
        name: '최예나',
        profileImage: '/shared/profile.png',
      },
      {
        name: '정우진',
        profileImage: '/shared/profile.png',
      },
      {
        name: '한솔',
        profileImage: '/shared/profile.png',
      },
    ],
  },
];

export default mockCardData;