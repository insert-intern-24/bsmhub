'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Body, Label, Label2 } from '@/app/components/system/text';
import type { ProjectDetailViewModel } from '../types';
import { FALLBACK_PROFILE } from './styles';

const MOBILE_MEDIA_QUERY = '(max-width: 900px)';
const MAX_HEIGHT_THRESHOLD = 200; // 200px 이상이면 접기

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
    <a href={`/portfolio/${member.id}`} className="cursor-pointer">
      <div className="relative h-10 w-10 overflow-hidden rounded-full">
        <Image
          src={member.profileImage || FALLBACK_PROFILE}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
    </a>
    <div className="flex-col">
      <a href={`/portfolio/${member.id}`} className="cursor-pointer hover:underline">
        <Label2 className="font-semibold">{member.name}</Label2>
      </a>
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
  const [shouldFold, setShouldFold] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (contentRef.current && isMobile) {
      const height = contentRef.current.scrollHeight;
      setShouldFold(height > MAX_HEIGHT_THRESHOLD);
    } else {
      setShouldFold(false);
    }
  }, [members, isMobile]);

  const handleReveal = () => {
    setIsGradientVisible(false);
  };

  const showFoldEffect = shouldFold && isGradientVisible && isMobile;

  return (
    <section className="relative flex-col gap-[0.375rem]">
      <Label>기여</Label>
      <div className="relative overflow-hidden">
        <div 
          ref={contentRef}
          className="flex-col gap-[0.5rem] relative z-0"
        >
          {members.length > 0 ? (
            members.map((member) => (
              <TeamMemberItem key={member.id} member={member} />
            ))
          ) : (
            <Label className="text-detail">참여자 정보가 없습니다.</Label>
          )}
        </div>
        {showFoldEffect && (
          <>
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/70 via-white/85 to-white" />
            <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center">
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
      </div>
    </section>
  );
};
