'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Body, Label, Label2 } from '@/app/components/system/text';
import type { ProjectDetailViewModel } from '../types';
import { FALLBACK_PROFILE } from './styles';

const MOBILE_MEDIA_QUERY = '(max-width: 900px)';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(MOBILE_MEDIA_QUERY);

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQueryList.matches);

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', handleChange);

      return () => {
        mediaQueryList.removeEventListener('change', handleChange);
      };
    }

    mediaQueryList.addListener(handleChange);

    return () => {
      mediaQueryList.removeListener(handleChange);
    };
  }, []);

  return isMobile;
};

interface TeamMemberItemProps {
  member: ProjectDetailViewModel['team'][number];
}

const TeamMemberItem = ({ member }: TeamMemberItemProps) => (
  <article className="flex-row items-center gap-[0.375rem]">
    <div className="relative h-10 w-10 overflow-hidden rounded-full">
      <Image
        src={member.profileImage || FALLBACK_PROFILE}
        alt={member.name}
        fill
        className="object-cover"
      />
    </div>
    <div className="flex-col">
      <Label2 className="font-semibold">{member.name}</Label2>
      <Label className="text-gray-base">{member.role}</Label>
    </div>
  </article>
);

interface ProjectTeamSectionProps {
  members: ProjectDetailViewModel['team'];
}

export const ProjectTeamSection = ({
  members,
}: ProjectTeamSectionProps) => {
  const [isGradientVisible, setIsGradientVisible] = useState(true);
  const isMobile = useIsMobile();

  const handleReveal = () => {
    setIsGradientVisible(false);
  };

  const shouldFold = isMobile && members.length > 1 && isGradientVisible;
  const visibleMembers = shouldFold ? members.slice(0, 1) : members;

  return (
    <section className="relative flex-col gap-[0.375rem]">
      <Label>기여</Label>
      <div className="relative overflow-hidden">
        <div className="flex-col gap-[0.5rem] relative z-0">
          {visibleMembers.length > 0 ? (
            <>
              <TeamMemberItem member={visibleMembers[0]} />
              {visibleMembers.slice(1).map((member) => (
                <TeamMemberItem key={member.id} member={member} />
              ))}
            </>
          ) : (
            <Label className="text-detail">참여자 정보가 없습니다.</Label>
          )}
        </div>
      </div>
      {shouldFold && (
        <>
          <div className="pointer-events-none absolute inset-0 z-10 hidden bg-gradient-to-b from-white/70 via-white/85 to-white mobile:block" />
          <div className="absolute inset-x-0 bottom-0 z-20 hidden justify-center mobile:flex">
            <button
              type="button"
              className="pointer-events-auto px-4 py-1"
              onClick={handleReveal}
            >
              <Body className="text-gray-base">더보기</Body>
            </button>
          </div>
        </>
      )}
    </section>
  );
};
