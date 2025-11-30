import {
  Label,
  Title,
  Body,
} from '@/app/components/ui/text/text';
import React from 'react';
import ProfileImage from '@/app/components/ui/profile/ProfileImage';
import BulletList from '@/app/components/ui/list/BulletList';
import Section from '@/app/components/viewer/Section';

const page = () => {
  return (
    <div className="flex-col gap-[24px] w-full">
      {/* 상단 라벨 */}
      <Label className="text-blue-secondary font-light">
        3학년 소프트웨어개발과
      </Label>

      {/* 프로필 섹션 */}
      <div className="flex-col gap-[22px] w-full">
        {/* 프로필 정보 */}
        <div className="flex-center gap-[20px] w-full">
          {/* 프로필 이미지 */}
          <div className="h-[213px] w-[166px] shrink-0">
            <ProfileImage
              src={null}
              name="홍 길 동"
              size={{ width: 166, height: 213 }}
              shape="square"
              className="w-full h-full"
            />
          </div>

          {/* 프로필 텍스트 정보 */}
          <div className="flex-col h-[213px] justify-between shrink-0 flex-1">
            <div className="flex-col gap-[7px] w-full">
              <Title className="text-black">
                홍 길 동
              </Title>
              <div className="flex-col gap-0">
                <Body className="text-black">
                  me@hongildong.com
                </Body>
                <Body className="text-blue-secondary">
                  아무리 어려운 과제가 있어도 의심하지 말고 설계부터 해라,<br />

                  어떤것이라도 설계할 수 있을테니까.
                </Body>
              </div>
            </div>

            {/* 희망 취업 분야 */}
            <div className="flex-col gap-[3px]">
              <div className="flex gap-[3px] items-center">
                <Label className="text-blue-secondary">
                  희망 취업 분야
                </Label>
              </div>
              <Body className="text-black">
                DevOps, 보안, 네트워크 엔지니어
              </Body>
            </div>
          </div>
        </div>

        {/* 상세 정보 섹션들 */}
        <div className="flex-col gap-[40px] w-full">
          {/* 언어/기술/스택 */}
          <Section title="언어/기술/스택">
            <Body className="text-black">
              C/C++, Java, Javascript / Typescript, Python, libcurl, libpcap,
              React, React Native, Spring Boot
            </Body>
          </Section>

          {/* 수상경력 */}
          <Section title="수상경력">
            <BulletList
              items={[
                {
                  text: '2023 BSSM 하계 해커톤 우수상',
                },
                {
                  text: '2024 마이크로소프트 이미지 모델 해커톤 전체 대상',
                },
                {
                  text: '2024 지방 경기 기능대회 동상',
                },
              ]}
            />
          </Section>

          {/* 프로젝트 및 경험 */}
          <Section title="프로젝트 및 경험">
            <BulletList
              items={[
                {
                  text: 'HC : 온프레미스 서버들의 네트워킹 상태를 확인하고 API로 데이터를 제공하는 서비스 (프론트엔드, 백엔드)',
                },
                {
                  text: 'NPAS : 네트워크 분석을 통한 보안 공격 방어 및 AI 보고서 생성 (프론트엔드, 백엔드, AI)',
                },
                {
                  text: 'SPACE : AI를 통한 문제 해결 능력 훈련 서비스 (프론트엔드, AI)',
                },
              ]}
            />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default page;