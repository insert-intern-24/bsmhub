'use client';
import React, { useState } from 'react';
import ContestList from '@/app/components/contest/ContestList';
import ContestPanel from '@/app/components/contest/ContestPanel';

interface Contest {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  judges: string[];
  awards: {
    title: string;
    project: string;
  }[];
}
const ContestItems: Contest[] = [
  {
    title: '상반기 AI캠프 해커톤',
    startDate: '2024.03.01(금)',
    endDate: '2024.03.05(화)',
    description:
      'AI 기술을 활용한 혁신적인 아이디어를 발굴하고 구현하는 해커톤입니다.',
    judges: ['김철수 교수', '박영희 박사', '이승민 AI 엔지니어'],
    awards: [
      {
        title: '대상',
        project: '실시간 번역 AI를 활용한 글로벌 채팅 플랫폼',
      },
      {
        title: '최우수상',
        project: 'AI 기반 스마트 농업 관리 시스템',
      },
      {
        title: '장려상',
        project: 'AI로 최적화된 개인 맞춤형 운동 플랜 생성 앱',
      },
    ],
  },
  {
    title: '하반기 AI캠프 해커톤',
    startDate: '2024.09.15(월)',
    endDate: '2024.09.20(토)',
    description: '최신 AI 트렌드와 기술을 접목한 프로젝트 개발 대회입니다.',
    judges: ['정현우 CTO', '김하나 데이터 과학자', '이민호 AI 디자이너'],
    awards: [
      {
        title: '대상',
        project: 'AI 기반 의료 영상 진단 보조 시스템',
      },
      {
        title: '최우수상',
        project: '자율주행차 경로 최적화 AI 솔루션',
      },
      {
        title: '창의상',
        project: 'AI로 작곡된 개인화 음악 생성 서비스',
      },
    ],
  },
  {
    title: '2024 빅데이터 챌린지',
    startDate: '2024.06.10(월)',
    endDate: '2024.06.17(월)',
    description:
      '대규모 데이터를 분석하고 시각화하여 인사이트를 도출하는 대회입니다.',
    judges: ['송지훈 박사', '한유리 데이터 분석가', '권혁준 머신러닝 전문가'],
    awards: [
      {
        title: '대상',
        project: '도시 교통 데이터 분석을 통한 교통 체증 완화 솔루션',
      },
      {
        title: '최우수상',
        project: '기후 데이터 분석으로 농업 생산성 향상 모델 개발',
      },
    ],
  },
  {
    title: '2024 스마트 IoT 경진대회',
    startDate: '2024.08.20(화)',
    endDate: '2024.08.30(금)',
    description: 'IoT 기술을 활용해 스마트한 솔루션을 개발하는 경진대회입니다.',
    judges: [
      '안재현 IoT 전문가',
      '김지수 하드웨어 엔지니어',
      '박나연 소프트웨어 개발자',
    ],
    awards: [
      {
        title: '대상',
        project: 'IoT 기반 스마트 가전 제어 시스템',
      },
      {
        title: '혁신상',
        project: 'IoT를 활용한 재난 경보 시스템',
      },
    ],
  },
  {
    title: '2024 스타트업 아이디어톤',
    startDate: '2024.11.10(토)',
    endDate: '2024.11.15(목)',
    description:
      '참신한 스타트업 아이디어를 발굴하고 실현 가능성을 검증하는 아이디어톤입니다.',
    judges: [
      '유재석 창업 전문가',
      '이하나 투자 컨설턴트',
      '홍길동 스타트업 CEO',
    ],
    awards: [
      {
        title: '대상',
        project: '공유 전기 자전거를 위한 AI 기반 최적 경로 제안 앱',
      },
      {
        title: '아이디어상',
        project: '지역 상권 활성화를 위한 AR 쇼핑 플랫폼',
      },
    ],
  },
];

function ContestPage() {
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  return (
    <div className="flex">
      {selectedContest && <ContestPanel contest={selectedContest} />}
      <ContestList
        contests={ContestItems}
        onContestClick={(contest) => setSelectedContest(contest)}
      />
    </div>
  );
}

export default ContestPage;
