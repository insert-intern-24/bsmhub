'use client';

import React from 'react';
import Image from 'next/image';
import { IconPlayerPlayFilled, IconPlaylistAdd } from '@tabler/icons-react';
import {
  Body,
  Body2,
  Label,
  Label2,
  TitleEN,
} from '@/app/components/system/text';
import SkillTag from '@/app/components/contents/SkillTag';
import projectsData from '@/data/dummy-projects.json';

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);

  const projectData =
    projectsData.find(
      (project) => project.id === parseInt(unwrappedParams.id),
    ) || projectsData[0];
  return (
    <div className="max-w-outer mx-auto py-[4.5rem]">
      <div className="flex">
        {/* 사이드바 */}
        <div className="relative px-[2.625rem] w-[21.75rem] min-w-[21.75rem] flex-shrink-0 border-r border-gray-200">
          <div className="absolute top-[-8rem] w-[7.5rem] h-[7.5rem]">
            <Image
              src={projectData.iconImage}
              alt={projectData.title}
              fill
              className="object-cover"
            />
          </div>
          {/* 프로젝트 정보 */}
          <div className="flex-col gap-[1.625rem] w-full">
            {/* 프로젝트 아이콘 */}

            {/* 제목 및 소개 */}
            <div className="flex-col gap-[0.375rem] w-full">
              <TitleEN>{projectData.title}</TitleEN>
              <Body className="text-detail">{projectData.description}</Body>
              <div className="flex w-full gap-1">
                <div className="flex-1 relative">
                  {/* 그림자 */}
                  <div
                    className="absolute inset-x-[0%] top-1/4 h-12"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%)',
                      filter: 'blur(5px)',
                      zIndex: 0,
                    }}
                  />
                  <div
                    className="h-10 flex items-center justify-center gap-1 rounded-3xl relative overflow-hidden"
                    style={{
                      opacity: 0.8,
                      backdropFilter: 'blur(33.50px)',
                      zIndex: 1,
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-3xl"
                      style={{
                        background:
                          'linear-gradient(180deg, #282A2B 0%, white 100%)',
                        padding: '0.9px',
                      }}
                    >
                      <div
                        className="w-full h-full rounded-3xl"
                        style={{
                          background:
                            'linear-gradient(170deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.4) 70%, rgba(255, 255, 255, 0.5) 100%), black',
                        }}
                      />
                    </div>
                    {/* 수평에 가까운 대각선 그라데이션 오버레이 */}
                    <div
                      className="absolute inset-0 rounded-3xl"
                      style={{
                        background:
                          'linear-gradient(110deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.05) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                    {/* 위쪽 테두리 흰색 그라데이션 */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1/3 rounded-3xl"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                    {/* 아래쪽 테두리 흰색 그라데이션 */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1/3 rounded-3xl"
                      style={{
                        background:
                          'linear-gradient(0deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                    <div className="z-10 flex items-center justify-center gap-1">
                      <IconPlayerPlayFilled
                        size={(18 * 12) / 16}
                        color="white"
                      />
                      <Body2 className="text-white">Play</Body2>
                    </div>
                    <div
                      className="absolute top-1/2 left-0 right-0 h-10"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)',
                        zIndex: -1,
                      }}
                    />
                  </div>
                </div>
                <div className="w-10 h-10 bg-light-gray-input rounded-full flex items-center justify-center">
                  <IconPlaylistAdd size={(16 * 12) / 16} color="black" />
                </div>
              </div>
            </div>

            <div className="flex-col gap-[0.375rem]">
              <Label>링크</Label>
              <Label className="text-detail">{projectData.githubUrl}</Label>
            </div>

            {/* 기술 스택 */}
            <div className="flex-col gap-[0.375rem]">
              <Label>기술스택</Label>
              <div className="flex-row gap-2 flex-wrap">
                {projectData.technologies.map((tech, index) => (
                  <SkillTag key={index} mode="default" value={tech} />
                ))}
              </div>
            </div>

            {/* 팀 멤버 */}
            <div className="flex-col gap-[0.375rem]">
              <Label>기여</Label>
              <div className="flex-col gap-[0.5rem]">
                {projectData.team.map((member) => (
                  <div
                    key={member.id}
                    className="flex-row gap-[0.375rem] items-center"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={member.profileImage}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-col">
                      <Label2 className="font-semibold">{member.name}</Label2>
                      <Label className="text-gray-base">{member.role}</Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="px-[4.6875rem] w-full">
          {/* 유튜브 동영상 */}
          <div className="flex-col mb-[0.875rem]">
            <div className="relative w-full h-[34.375rem] overflow-hidden">
              <iframe
                src={projectData.youtubeUrl}
                title={projectData.title}
                className="w-full h-full"
                allow="encrypted-media;"
                allowFullScreen
              />
            </div>
          </div>

          <Body>{projectData.detailDescription}</Body>
        </div>
      </div>
    </div>
  );
}
